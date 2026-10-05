import prisma from "../../lib/db";

// CONSTANTS
const DAY_MS = 24 * 60 * 60 * 1000;
const CACHE_TTL_MS = DAY_MS;

const GHOST_DAYS = 30;
const AT_RISK_DAYS = 10;
const SESSION_LIMIT = 30;
const MIN_SESSIONS_FOR_PATTERN = 4;
const ABSENCE_MULTIPLIER = 2.5;
const MIN_ABSENCE_DAYS_FOR_PATTERN = 5;
const TREND_WINDOW_DAYS = 14;
const TREND_DROP_RATIO = 0.5;
const NEW_MEMBER_GRACE_DAYS = 14;

// TYPES
type RiskReason =
    | "NO_VISIT_30_PLUS"
    | "NO_VISIT_10_PLUS"
    | "ABSENCE_ABOVE_USUAL_PATTERN"
    | "VISIT_FREQUENCY_DROPPED"
    | "NEVER_VISITED"
    | "NEW_MEMBER"
    | "REGULAR";

type MemberRiskDetail = {
    memberId: string;
    name: string;
    email: string | null;
    lastVisitDaysAgo: number;
    recentSessionCount: number;
    avgGapDays: number | null;
    visitsLast14Days: number;
    visitsPrev14Days: number;
    neverVisited: boolean;
    reason: RiskReason;
};


// GET OR CALCULATE GYM-MEMBER RISK ANALYTICS
export async function getOrCalculateGymRiskAnalytics(gymId: number, forceRefresh = false) {
    const now = new Date();
    const nowMs = now.getTime();

    // CHECK IF CACHE EXISTS
    const existingCache = await prisma.gymRiskAnalyticsCache.findUnique({
        where: { gymId },
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
            atRiskMembers: existingCache.atRiskMembers,
            ghostMembers: existingCache.ghostMembers,
            regularMembers: existingCache.regularMembers,
            lastCalculatedAt: existingCache.lastCalculatedAt,
            source: "cache",
        };
    }

    // PULL LAST 30 SESSIONS OF EACH MEMBER
    const members = await prisma.member.findMany({
        where: { gymId },
        select: {
            publicId: true,
            name: true,
            surname: true,
            email: true,
            createdAt: true,
            sessions: {
                orderBy: { checkIn: "desc" },
                take: SESSION_LIMIT,
                select: { checkIn: true },
            },
        },
    });

    // RISK GROUPS
    const regulars: MemberRiskDetail[] = [];
    const atRisk: MemberRiskDetail[] = [];
    const ghosts: MemberRiskDetail[] = [];

    for (const member of members) {
        // CONVERT SESSIONS TO TIMESTAMPS (NEWEST FIRST)
        const checkIns = member.sessions
            .filter((s) => s.checkIn)
            .map((s) => new Date(s.checkIn).getTime());

        // LAST ACTIVITY (FALLBACK TO REGISTER DATE IF NEVER VISITED)
        const neverVisited = checkIns.length === 0;
        const lastActivityMs = neverVisited ? new Date(member.createdAt).getTime() : checkIns[0];
        const daysSinceLast = Math.max(0, Math.floor((nowMs - lastActivityMs) / DAY_MS));

        // AVERAGE GAP BETWEEN CONSECUTIVE VISITS (MEMBER'S OWN PATTERN)
        let avgGapDays: number | null = null;
        if (checkIns.length >= 2) {
            let totalGapMs = 0;
            for (let i = 0; i < checkIns.length - 1; i++) {
                totalGapMs += checkIns[i] - checkIns[i + 1];
            }
            avgGapDays = Number((totalGapMs / (checkIns.length - 1) / DAY_MS).toFixed(1));
        }

        // TREND: VISITS IN LAST 14 DAYS VS PREVIOUS 14 DAYS
        const windowMs = TREND_WINDOW_DAYS * DAY_MS;
        const visitsLast14Days = checkIns.filter((t) => nowMs - t <= windowMs).length;
        const visitsPrev14Days = checkIns.filter(
            (t) => nowMs - t > windowMs && nowMs - t <= windowMs * 2
        ).length;

        let group: "regular" | "atRisk" | "ghost" = "regular";
        let reason: RiskReason = "REGULAR";

        // GROUPING CRITERIAS
        if (neverVisited) {
            // NEVER CAME: NEW MEMBER GRACE PERIOD, THEN AT RISK, THEN GHOST
            if (daysSinceLast > GHOST_DAYS) {
                group = "ghost";
                reason = "NEVER_VISITED";
            } else if (daysSinceLast > NEW_MEMBER_GRACE_DAYS) {
                group = "atRisk";
                reason = "NEVER_VISITED";
            } else {
                reason = "NEW_MEMBER";
            }
        } else if (daysSinceLast > GHOST_DAYS) {
            // NO COME MORE THAN 30 DAYS
            group = "ghost";
            reason = "NO_VISIT_30_PLUS";
        } else if (daysSinceLast > AT_RISK_DAYS) {
            // NO COME BETWEEN 10-30 DAYS
            group = "atRisk";
            reason = "NO_VISIT_10_PLUS";
        } else if (
            checkIns.length >= MIN_SESSIONS_FOR_PATTERN &&
            avgGapDays !== null &&
            daysSinceLast >= MIN_ABSENCE_DAYS_FOR_PATTERN &&
            daysSinceLast > avgGapDays * ABSENCE_MULTIPLIER
        ) {
            // CURRENT ABSENCE IS MUCH LONGER THAN MEMBER'S USUAL PATTERN
            group = "atRisk";
            reason = "ABSENCE_ABOVE_USUAL_PATTERN";
        } else if (
            checkIns.length >= MIN_SESSIONS_FOR_PATTERN &&
            visitsPrev14Days >= 4 &&
            visitsLast14Days < visitsPrev14Days * TREND_DROP_RATIO
        ) {
            // STILL COMING BUT VISIT FREQUENCY DROPPED SHARPLY
            group = "atRisk";
            reason = "VISIT_FREQUENCY_DROPPED";
        }

        // MEMBER DETAIL OBJECT
        const memberDetail: MemberRiskDetail = {
            memberId: member.publicId,
            name: `${member.name} ${member.surname}`,
            email: member.email,
            lastVisitDaysAgo: daysSinceLast,
            recentSessionCount: checkIns.length,
            avgGapDays,
            visitsLast14Days,
            visitsPrev14Days,
            neverVisited,
            reason,
        };

        // PUSH MEMBER TO ITS RISK GROUP
        if (group === "ghost") ghosts.push(memberDetail);
        else if (group === "atRisk") atRisk.push(memberDetail);
        else regulars.push(memberDetail);
    }

    // SUMMARY COUNTS
    const summary = {
        total: members.length,
        regularCount: regulars.length,
        atRiskCount: atRisk.length,
        ghostCount: ghosts.length,
    };

    // UPSERT CACHE TABLE WITH NEW CALCULATED DATA
    const savedCache = await prisma.gymRiskAnalyticsCache.upsert({
        where: { gymId },
        update: {
            summary,
            atRiskMembers: atRisk,
            ghostMembers: ghosts,
            regularMembers: regulars,
            lastCalculatedAt: now,
        },
        create: {
            gymId,
            summary,
            atRiskMembers: atRisk,
            ghostMembers: ghosts,
            regularMembers: regulars,
            lastCalculatedAt: now,
        },
    });

    // RETURN
    return {
        summary: savedCache.summary,
        atRiskMembers: savedCache.atRiskMembers,
        ghostMembers: savedCache.ghostMembers,
        regularMembers: savedCache.regularMembers,
        lastCalculatedAt: savedCache.lastCalculatedAt,
        source: "calculated",
    };
}