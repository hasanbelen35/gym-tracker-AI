import prisma from "../lib/db";
import { AppError } from "../middleware/errorMiddleware";

export interface FinishWorkoutInput {
    workoutLogId: number;
    memberNote?: string;
    exerciseLogs: {
        exerciseLogId: number;
        setLogs: {
            setNumber: number;
            actualReps?: number;
            actualWeight?: number;
            actualRir?: number;
            status: "MATCHED" | "MODIFIED" | "SKIPPED";
        }[];
    }[];
}

export class WorkoutLogService {

    // 
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

    // 
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

        const newSession = await prisma.$transaction(async (tx) => {
            const createdWorkoutLog = await tx.workoutLog.create({
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

            return createdWorkoutLog;
        });

        return newSession;
    }

    //
    async finishWorkoutSession(memberId: number, data: FinishWorkoutInput) {
        AppError.assertMemberId(memberId);

        const { workoutLogId, memberNote, exerciseLogs } = data;

        const session = await prisma.workoutLog.findFirst({
            where: { id: workoutLogId, memberId, status: "IN_PROGRESS" },
        });

        if (!session) {
            throw new AppError(404, "Aktif oturum bulunamadı.");
        }

        const completedAt = new Date();
        const durationMinutes = Math.round((completedAt.getTime() - new Date(session.startedAt).getTime()) / 60000);

        const updatedSession = await prisma.$transaction(async (tx) => {
            // Frontend'den gelen toplu set loglarını veritabanına işliyoruz
            if (exerciseLogs && exerciseLogs.length > 0) {
                for (const exLog of exerciseLogs) {
                    for (const setLog of exLog.setLogs) {
                        await tx.exerciseSetLog.updateMany({
                            where: {
                                exerciseLogId: exLog.exerciseLogId,
                                setNumber: setLog.setNumber,
                            },
                            data: {
                                actualReps: setLog.actualReps,
                                actualWeight: setLog.actualWeight,
                                actualRir: setLog.actualRir,
                                status: setLog.status,
                            },
                        });
                    }
                }
            }

            const finished = await tx.workoutLog.update({
                where: { id: workoutLogId },
                data: {
                    status: "COMPLETED",
                    completedAt,
                    durationMinutes: durationMinutes > 0 ? durationMinutes : 1,
                    memberNote,
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

            return finished;
        });

        return updatedSession;
    }
}