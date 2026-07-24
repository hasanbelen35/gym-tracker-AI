import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ExerciseService {
    async getExercisesByQuery(query: {
        search?: string;
        category?: string;
        equipment?: string;
        targetMuscle?: string;
    }) {
        const { category, equipment, targetMuscle } = query;

        const whereClause: any = {};

        if (category && typeof category === "string") {
            whereClause.category = category;
        }

        if (equipment && typeof equipment === "string") {
            whereClause.equipment = equipment;
        }

        if (targetMuscle && typeof targetMuscle === "string") {
            whereClause.targetMuscle = targetMuscle;
        }

        const exercises = await prisma.exercise.findMany({
            where: whereClause,
            take: 50,
            orderBy: {
                name: "asc",
            },
        });

        return exercises;
    }

    // create workout program
    async createWorkoutProgram(programData: {
        memberId: number;
        trainerId: number;
        title: string;
        type?: string;
        splitType?: string;
        days: any[];
    }) {
        const { memberId, trainerId, title, type, splitType, days } = programData;

        const newProgram = await prisma.program.create({
            data: {
                memberId: Number(memberId),
                trainerId: Number(trainerId),
                title,
                type: type ? (type as any) : "WORKOUT",
                splitType: splitType ? (splitType as any) : "PPL",
                isActive: true,
                days: {
                    create: days.map((day: any) => ({
                        dayName: day.dayName,
                        dayOrder: Number(day.dayOrder),
                        isRestDay: Boolean(day.isRestDay),
                        exercises: day.isRestDay ? undefined : {
                            create: (day.exercises || []).map((exercise: any, exIndex: number) => ({
                                exerciseId: Number(exercise.exerciseId),
                                orderIndex: Number(exercise.orderIndex ?? exIndex),
                                notes: exercise.notes || null,
                                sets: {
                                    create: (exercise.sets || []).map((set: any, setIndex: number) => ({
                                        setNumber: Number(set.setNumber ?? setIndex + 1),
                                        targetReps: set.targetReps || null,
                                        targetWeight: set.targetWeight ? Number(set.targetWeight) : null,
                                        rir: set.rir !== undefined && set.rir !== null ? Number(set.rir) : null,
                                    }))
                                }
                            }))
                        }
                    }))
                }
            },
            include: {
                days: {
                    include: {
                        exercises: {
                            include: {
                                exercise: true,
                                sets: true
                            }
                        }
                    }
                },
                trainer: {
                    select: { name: true, surname: true }
                }
            }
        });

        return newProgram;
    }
}