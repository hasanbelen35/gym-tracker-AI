import { PerformanceTrend, Prisma } from "@prisma/client";
import prisma from "../../lib/db";

// CONSTANTS
const DAY_MS = 24 * 60 * 60 * 1000;
const CACHE_TTL_MS = DAY_MS;

const WINDOW_DAYS = 28;
const DEFAULT_WORKOUT_DAYS_PER_WEEK = 3;
const WEIGHT_TOLERANCE = 0.9;

const WEIGHTS = { adherence: 40, sets: 35, measurement: 25 } as const;

const RISING_MIN_SCORE = 75;
const DECLINING_MAX_SCORE = 45;
const INACTIVE_DAYS = 14;
const INACTIVITY_PENALTY_AFTER_DAYS = 10;
const INACTIVITY_PENALTY = 15;

// TYPES
type MeasurementTrend = "POSITIVE" | "STAGNANT" | "NEGATIVE" | "INSUFFICIENT_DATA";

type MemberPerformance = {
    memberId: number;
    publicId: string;
    name: string;
    avatarUrl: string | null;
    score: number;
    trend: PerformanceTrend;
    adherenceRate: number;
    setCompletionRate: number;
    daysSinceLastWorkout: number | null;
    measurementTrend: MeasurementTrend;
    reasons: string[];
};

// MEMBER QUERY (ONLY THE FIELDS WE NEED)
const buildMemberSelect = (since: Date) =>
    ({
        id: true,
        publicId: true,
        name: true,
        surname: true,
        avatarUrl: true,
        profile: { select: { workoutDaysPerWeek: true, goal: true } },
        workoutLogs: {
            where: { status: "COMPLETED", completedAt: { gte: since } },
            select: {
                exerciseLogs: {
                    select: {
                        setLogs: {
                            select: {
                                status: true,
                                targetReps: true,
                                actualReps: true,
                                targetWeight: true,
                                actualWeight: true,
                            },
                        },
                    },
                },
            },
        },
        measurements: {
            orderBy: { measuredAt: "desc" },
            take: 2,
            select: { bodyFatRate: true, muscleMass: true, waist: true },
        },
    }) satisfies Prisma.MemberSelect;

type MemberRow = Prisma.MemberGetPayload<{ select: ReturnType<typeof buildMemberSelect> }>;
type SetRow = MemberRow["workoutLogs"][number]["exerciseLogs"][number]["setLogs"][number];
type MeasurementRow = MemberRow["measurements"][number];

// PREVENTS TWO CALCULATIONS FOR THE SAME TRAINER AT THE SAME TIME
const inFlight = new Map<number, ReturnType<typeof calculateAndSave>>();

// ---------------------------------------------------------------------------
// SET ANALYSIS (TARGET VS ACTUAL)
// ---------------------------------------------------------------------------

// "8-12" -> 8, "10" -> 10, "AMRAP" OR EMPTY -> 0 (NOT CHECKED)
function parseTargetReps(value: string | null): number {
    if (!value) return 0;
    const parsed = parseInt(value.split("-")[0], 10);
    return Number.isNaN(parsed) ? 0 : parsed;
}

function isSetSuccessful(set: SetRow): boolean {
    // SKIPPED SET IS ALWAYS A MISS, MATCHED SET EQUALS THE TARGET
    // DESIGNED SET (MEMBER ENTERED OWN VALUES) IS COMPARED WITH THE TARGET BELOW
    if (set.status === "SKIPPED") return false;
    if (set.status === "MATCHED") return true;

    const targetReps = parseTargetReps(set.targetReps);
    const targetWeight = set.targetWeight ?? 0;

    const repsMet = targetReps === 0 || (set.actualReps ?? 0) >= targetReps;
    const weightMet = targetWeight === 0 || (set.actualWeight ?? 0) >= targetWeight * WEIGHT_TOLERANCE;

    return repsMet && weightMet;
}

function countSets(member: MemberRow) {
    let totalSets = 0;
    let successfulSets = 0;

    for (const workout of member.workoutLogs) {
        for (const exercise of workout.exerciseLogs) {
            for (const set of exercise.setLogs) {
                totalSets++;
                if (isSetSuccessful(set)) successfulSets++;
            }
        }
    }
    return { totalSets, successfulSets };
}

// ---------------------------------------------------------------------------
// MEASUREMENT ANALYSIS (LATEST VS PREVIOUS, BASED ON MEMBER GOAL)
// ---------------------------------------------------------------------------

function evaluateMeasurements(
    measurements: MeasurementRow[],
    goal?: string | null
): { trend: MeasurementTrend; ratio: number; reason?: string } {
    const noData = { trend: "INSUFFICIENT_DATA" as const, ratio: 0.6 };

    if (measurements.length < 2) return noData;

    const [latest, previous] = measurements;
    const diff = (a: number | null, b: number | null) => (a !== null && b !== null ? a - b : null);

    const fatDiff = diff(latest.bodyFatRate, previous.bodyFatRate);
    const muscleDiff = diff(latest.muscleMass, previous.muscleMass);
    const waistDiff = diff(latest.waist, previous.waist);

    if (goal === "FAT_LOSS") {
        if (fatDiff === null && waistDiff === null) return noData;
        if ((fatDiff ?? 0) <= -0.3 || (waistDiff ?? 0) <= -1) return { trend: "POSITIVE", ratio: 1 };
        if ((fatDiff ?? 0) > 0.3 || (waistDiff ?? 0) > 1) {
            return {
                trend: "NEGATIVE",
                ratio: 0.2,
                reason: "Yağ yakımı hedefine rağmen yağ oranı veya bel çevresinde artış var.",
            };
        }
        return {
            trend: "STAGNANT",
            ratio: 0.5,
            reason: "Yağ oranı ve bel çevresinde belirgin ilerleme yok (plato).",
        };
    }

    if (goal === "MUSCLE_GAIN" || goal === "STRENGTH") {
        if (muscleDiff === null) return noData;
        if (muscleDiff >= 0.3) return { trend: "POSITIVE", ratio: 1 };
        if (muscleDiff <= -0.3) {
            return {
                trend: "NEGATIVE",
                ratio: 0.2,
                reason: "Kas kazanımı hedefine rağmen kas kütlesinde düşüş gözlemlendi.",
            };
        }
        return { trend: "STAGNANT", ratio: 0.5, reason: "Kas kütlesi artışı sabit kalmış." };
    }

    // NO GOAL OR GENERAL GOAL
    if (fatDiff === null && muscleDiff === null && waistDiff === null) return noData;

    const improving = (fatDiff ?? 0) < 0 || (muscleDiff ?? 0) > 0 || (waistDiff ?? 0) < 0;

    return improving
        ? { trend: "POSITIVE", ratio: 1 }
        : { trend: "STAGNANT", ratio: 0.6, reason: "Fiziksel ölçümlerde belirgin bir değişim yok." };
}

// ---------------------------------------------------------------------------
// SCORING + GROUPING
// ---------------------------------------------------------------------------

function resolveTrend(score: number, daysSinceLastWorkout: number | null): PerformanceTrend {
    if (daysSinceLastWorkout === null || daysSinceLastWorkout >= INACTIVE_DAYS) {
        return PerformanceTrend.DECLINING;
    }
    if (score >= RISING_MIN_SCORE) return PerformanceTrend.RISING;
    if (score < DECLINING_MAX_SCORE) return PerformanceTrend.DECLINING;
    return PerformanceTrend.STABLE;
}

function evaluateMember(member: MemberRow, lastWorkoutAt: Date | null, nowMs: number): MemberPerformance {
    const reasons: string[] = [];

    // 1) ADHERENCE: COMPLETED WORKOUTS VS EXPECTED WORKOUTS IN THE WINDOW
    const daysPerWeek = member.profile?.workoutDaysPerWeek ?? DEFAULT_WORKOUT_DAYS_PER_WEEK;
    const expectedWorkouts = Math.max(1, daysPerWeek * (WINDOW_DAYS / 7));
    const completedWorkouts = member.workoutLogs.length;
    const adherenceRate = Math.min(100, Math.round((completedWorkouts / expectedWorkouts) * 100));

    const daysSinceLastWorkout = lastWorkoutAt
        ? Math.max(0, Math.floor((nowMs - lastWorkoutAt.getTime()) / DAY_MS))
        : null;

    let adherencePoints = (adherenceRate / 100) * WEIGHTS.adherence;

    if (daysSinceLastWorkout === null) {
        adherencePoints = 0;
        reasons.push("Hiç tamamlanmış antrenman kaydı bulunmuyor.");
    } else {
        if (adherenceRate < 60) {
            reasons.push(`Son 4 haftalık antrenman hedefinin yalnızca %${adherenceRate}'i tamamlandı.`);
        }
        if (daysSinceLastWorkout > INACTIVITY_PENALTY_AFTER_DAYS) {
            reasons.push(`Son antrenmanın üzerinden ${daysSinceLastWorkout} gün geçti.`);
        }
    }

    // 2) SET PERFORMANCE: TARGET VS ACTUAL
    const { totalSets, successfulSets } = countSets(member);
    const setCompletionRate = totalSets > 0 ? Math.round((successfulSets / totalSets) * 100) : 0;
    const setPoints = (setCompletionRate / 100) * WEIGHTS.sets;

    if (totalSets > 0 && setCompletionRate < 70) {
        reasons.push(`Hedeflenen tekrar/ağırlık ile gerçekleşen değerler uyumsuz (%${setCompletionRate}).`);
    }

    // 3) MEASUREMENT TREND
    const measurement = evaluateMeasurements(member.measurements, member.profile?.goal);
    const measurementPoints = measurement.ratio * WEIGHTS.measurement;
    if (measurement.reason) reasons.push(measurement.reason);

    // 4) TOTAL SCORE (0 - 100)
    const inactivityPenalty =
        daysSinceLastWorkout !== null && daysSinceLastWorkout > INACTIVITY_PENALTY_AFTER_DAYS
            ? INACTIVITY_PENALTY
            : 0;

    const score = Math.max(
        0,
        Math.min(100, Math.round(adherencePoints + setPoints + measurementPoints - inactivityPenalty))
    );

    const trend = resolveTrend(score, daysSinceLastWorkout);

    if (reasons.length === 0) {
        reasons.push(
            trend === PerformanceTrend.RISING
                ? "Antrenman devamlılığı, set performansı ve ölçüm ilerlemesi hedefle uyumlu."
                : "Genel performans dengeli seyrediyor."
        );
    }

    return {
        memberId: member.id,
        publicId: member.publicId,
        name: `${member.name} ${member.surname}`,
        avatarUrl: member.avatarUrl,
        score,
        trend,
        adherenceRate,
        setCompletionRate,
        daysSinceLastWorkout,
        measurementTrend: measurement.trend,
        reasons,
    };
}

// ---------------------------------------------------------------------------
// CALCULATE + SAVE (MEMBER SUMMARIES AND TRAINER CACHE IN ONE TRANSACTION)
// ---------------------------------------------------------------------------

async function calculateAndSave(trainerId: number) {
    const now = new Date();
    const nowMs = now.getTime();
    const since = new Date(nowMs - WINDOW_DAYS * DAY_MS);

    // TRAINER'S GYM (MEMBERS MUST BELONG TO THE SAME GYM)
    const trainer = await prisma.trainer.findUnique({
        where: { id: trainerId },
        select: { gymId: true },
    });
    if (!trainer) throw new Error("Trainer not found");

    // PULL ONLY THIS TRAINER'S ASSIGNED MEMBERS (NOT PENDING / UNASSIGNED) WITH THEIR LAST 28 DAYS OF COMPLETED WORKOUTS
    const members = await prisma.member.findMany({
        where: {
            trainerId,
            gymId: trainer.gymId,
            assignmentStatus: "ASSIGNED",
        },
        select: buildMemberSelect(since),
    });
    const memberIds = members.map((m) => m.id);

    // REAL "LAST WORKOUT" DATE (NOT LIMITED TO THE 28 DAY WINDOW)
    const lastWorkouts = await prisma.workoutLog.groupBy({
        by: ["memberId"],
        where: { memberId: { in: memberIds }, status: "COMPLETED" },
        _max: { completedAt: true },
    });
    const lastWorkoutByMember = new Map(lastWorkouts.map((row) => [row.memberId, row._max.completedAt]));

    // EVALUATE EVERY MEMBER
    const evaluations = members.map((member) =>
        evaluateMember(member, lastWorkoutByMember.get(member.id) ?? null, nowMs)
    );

    // RISK GROUPS (BEST FIRST FOR RISING / STABLE, WORST FIRST FOR DECLINING)
    const rising = evaluations.filter((e) => e.trend === PerformanceTrend.RISING).sort((a, b) => b.score - a.score);
    const stable = evaluations.filter((e) => e.trend === PerformanceTrend.STABLE).sort((a, b) => b.score - a.score);
    const declining = evaluations.filter((e) => e.trend === PerformanceTrend.DECLINING).sort((a, b) => a.score - b.score);

    // SUMMARY COUNTS
    const summary = {
        total: evaluations.length,
        risingCount: rising.length,
        stableCount: stable.length,
        decliningCount: declining.length,
        averageScore: evaluations.length
            ? Math.round(evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length)
            : 0,
    };

    // MEMBER SUMMARY UPSERTS (aiSummary IS NOT TOUCHED)
    const memberUpserts = evaluations.map((e) => {
        const data = {
            trainerId,
            performanceScore: e.score,
            trendStatus: e.trend,
            riskReason: e.trend === PerformanceTrend.RISING ? null : e.reasons.join(" "),
            lastAnalyzedAt: now,
        };
        return prisma.memberPerformanceSummary.upsert({
            where: { memberId: e.memberId },
            create: { memberId: e.memberId, ...data },
            update: data,
        });
    });

    // TRAINER CACHE UPSERT
    const cacheData = {
        summary: summary as Prisma.InputJsonValue,
        risingMembers: rising as unknown as Prisma.InputJsonValue,
        stableMembers: stable as unknown as Prisma.InputJsonValue,
        decliningMembers: declining as unknown as Prisma.InputJsonValue,
        lastCalculatedAt: now,
    };

    // REMOVE SUMMARIES OF MEMBERS WHO ARE NO LONGER ASSIGNED TO THIS TRAINER
    const staleCleanup = prisma.memberPerformanceSummary.deleteMany({
        where: { trainerId, memberId: { notIn: memberIds } },
    });

    // CLEANUP FIRST, MEMBERS NEXT, CACHE LAST (ALL OR NOTHING)
    const results = await prisma.$transaction([
        staleCleanup,
        ...memberUpserts,
        prisma.trainerMemberPerformanceCache.upsert({
            where: { trainerId },
            create: { trainerId, ...cacheData },
            update: cacheData,
        }),
    ]);

    const savedCache = results[results.length - 1] as Awaited<
        ReturnType<typeof prisma.trainerMemberPerformanceCache.upsert>
    >;

    return {
        summary: savedCache.summary,
        risingMembers: savedCache.risingMembers,
        stableMembers: savedCache.stableMembers,
        decliningMembers: savedCache.decliningMembers,
        lastCalculatedAt: savedCache.lastCalculatedAt,
        source: "calculated" as const,
    };
}

// ---------------------------------------------------------------------------
// GET OR CALCULATE TRAINER MEMBER PERFORMANCE (USED BY TRAINER DASHBOARD)
// ---------------------------------------------------------------------------

export async function getOrCalculateTrainerPerformance(trainerId: number, forceRefresh = false) {
    const nowMs = Date.now();

    // CHECK IF CACHE EXISTS
    const existingCache = await prisma.trainerMemberPerformanceCache.findUnique({
        where: { trainerId },
    });

    // 24 HOURS CACHE VALIDATION (SKIPPED IF FORCE REFRESH)
    const isCacheValid =
        !forceRefresh &&
        existingCache &&
        nowMs - new Date(existingCache.lastCalculatedAt).getTime() < CACHE_TTL_MS;

    // IF CACHE IS VALID RETURN LAST CACHED DATA
    if (isCacheValid) {
        return {
            summary: existingCache.summary,
            risingMembers: existingCache.risingMembers,
            stableMembers: existingCache.stableMembers,
            decliningMembers: existingCache.decliningMembers,
            lastCalculatedAt: existingCache.lastCalculatedAt,
            source: "cache" as const,
        };
    }

    // OTHERWISE CALCULATE (REUSE RUNNING CALCULATION IF THERE IS ONE)
    const running = inFlight.get(trainerId);
    if (running) return running;

    const job = calculateAndSave(trainerId).finally(() => inFlight.delete(trainerId));
    inFlight.set(trainerId, job);
    return job;
}

// SINGLE MEMBER SUMMARY (MEMBER DETAIL PAGE)
// ONLY RETURNS IF THE MEMBER IS CURRENTLY ASSIGNED TO THIS TRAINER
export async function getMemberPerformanceSummary(memberId: number, trainerId: number) {
    return prisma.memberPerformanceSummary.findFirst({
        where: {
            memberId,
            trainerId,
            member: { trainerId, assignmentStatus: "ASSIGNED" },
        },
    });
}