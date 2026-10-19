import prisma from "../lib/db";
import { AppError } from "../middleware/errorMiddleware";

// SET INPUT INTERFACE
export interface LogSingleSetInput {
    workoutLogId: number;
    exerciseLogId: number;
    setNumber: number;
    actualReps?: number;
    actualWeight?: number;
    actualRir?: number;
    status: "MATCHED" | "MODIFIED" | "SKIPPED";
}

export class WorkoutLogService {


    // CHECK IS ACTIVE SESSION 
    async getActiveSession(memberId: number) {

        AppError.assertMemberId(memberId);

        const activeSession = await prisma.workoutLog.findFirst({
            where: {
                memberId,
                status: "IN_PROGRESS",
            },
            include: {
                workoutDay: {
                    include: {
                        program: true,
                        exercises: {
                            orderBy: { orderIndex: 'asc' },
                            include: {
                                exercise: true,
                                sets: {
                                    orderBy: { setNumber: 'asc' },
                                },
                            },
                        },
                    },
                },
                exerciseLogs: {
                    include: {
                        setLogs: {
                            orderBy: { setNumber: 'asc' },
                        },
                    },
                },
            },
        });

        return activeSession;
    }

    // START ACTIVATED SESSION WORKOOUT
    async startWorkoutSession(memberId: number) {

        AppError.assertMemberId(memberId);

        const existingActive = await this.getActiveSession(memberId);
        if (existingActive) {
            throw new AppError(400, "Zaten devam eden aktif bir antrenman oturumunuz var.");
        }

        const activeProgram = await prisma.program.findFirst({
            where: {
                memberId,
                isActive: true,
                archivedAt: null,
            },
            include: {
                days: {
                    include: {
                        exercises: {
                            orderBy: { orderIndex: 'asc' },
                            include: {
                                exercise: true,
                                sets: {
                                    orderBy: { setNumber: 'asc' },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!activeProgram || activeProgram.days.length === 0) {
            throw new AppError(404, "Aktif bir antrenman programınız bulunamadı.");
        }

        // TODAY NAME 
        const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

        let targetDay = activeProgram.days.find(
            (day) => day.dayName.toLowerCase() === todayName.toLowerCase() ||
                day.dayName.toLowerCase().includes(todayName.toLowerCase())
        );

        if (!targetDay) {
            const dayIndex = new Date().getDay();
            targetDay = activeProgram.days.find(d => d.dayOrder === (dayIndex === 0 ? 7 : dayIndex)) || activeProgram.days[0];
        }

        if (!targetDay || targetDay.isRestDay) {
            throw new AppError(400, "Bugün için planlanmış aktif bir antrenman günü bulunamadı veya bugün dinlenme günü.");
        }

        // COPY FOR LOG TABLE ALL DATA
        const newSession = await prisma.workoutLog.create({
            data: {
                memberId,
                workoutDayId: targetDay.id,
                status: "IN_PROGRESS",
                startedAt: new Date(),
                exerciseLogs: {
                    create: targetDay.exercises.map((ex, index) => ({
                        exerciseName: ex.exercise.name,
                        orderIndex: index,
                        notes: ex.notes,
                        setLogs: {
                            create: ex.sets.map((set) => ({
                                workoutSetId: set.id,
                                setNumber: set.setNumber,
                                targetReps: set.targetReps,
                                targetWeight: set.targetWeight,
                                targetRir: set.rir,
                                actualReps: set.targetReps ? parseInt(set.targetReps) || null : null,
                                actualWeight: set.targetWeight ?? null,
                                actualRir: set.rir ?? null,
                                status: "MATCHED",
                            })),
                        },
                    })),
                },
            },
            include: {
                workoutDay: {
                    include: {
                        program: true,
                        exercises: {
                            include: {
                                exercise: true,
                                sets: true,
                            },
                        },
                    },
                },
                exerciseLogs: {
                    include: {
                        setLogs: true,
                    },
                },
            },
        });

        return newSession;
    }

    // SET BASED REAL-TIME LOGGING
    async logSingleSet(memberId: number, data: LogSingleSetInput) {

        AppError.assertMemberId(memberId);


        const { workoutLogId, exerciseLogId, setNumber, actualReps, actualWeight, actualRir, status } = data;

        const session = await prisma.workoutLog.findFirst({
            where: { id: workoutLogId, memberId, status: "IN_PROGRESS" },
        });

        if (!session) {
            throw new AppError(403, "Aktif bir antrenman oturumu bulunamadı.");
        }

        const savedSetLog = await prisma.exerciseSetLog.upsert({
            where: {
                exerciseLogId_setNumber: {
                    exerciseLogId,
                    setNumber,
                },
            },
            update: {
                actualReps,
                actualWeight,
                actualRir,
                status,
            },
            create: {
                exerciseLogId,
                setNumber,
                actualReps,
                actualWeight,
                actualRir,
                status,
            },
        });

        return savedSetLog;
    }

    /**
     * 4. Antrenmanı tamamlama
     */
    async finishWorkoutSession(memberId: number, workoutLogId: number, memberNote?: string) {

        AppError.assertMemberId(memberId);

        const session = await prisma.workoutLog.findFirst({
            where: { id: workoutLogId, memberId, status: "IN_PROGRESS" },
        });

        if (!session) {
            throw new AppError(404, "Aktif oturum bulunamadı.");
        }

        const completedAt = new Date();
        const durationMinutes = Math.round((completedAt.getTime() - new Date(session.startedAt).getTime()) / 60000);

        const updatedSession = await prisma.workoutLog.update({
            where: { id: workoutLogId },
            data: {
                status: "COMPLETED",
                completedAt,
                durationMinutes: durationMinutes > 0 ? durationMinutes : 1,
                memberNote,
            },
        });

        return updatedSession;
    }
}