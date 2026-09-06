import { PrismaClient } from "@prisma/client";
import { logger } from "../config/logger";

const prisma = new PrismaClient();

export class ExerciseService {

    async getExercisesByQuery(query: {
        category?: string;
        equipment?: string;
        targetMuscle?: string;
    }) {
        logger.info("Fetching exercises with query filters", { query });
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

        logger.info(`Successfully fetched ${exercises.length} exercises based on query`);
        return exercises;
    }

    // create workout program
    async createWorkoutProgram(programData: {
        trainerId: number;
        memberPublicId: string;
        title: string;
        type?: string;
        splitType?: string;
        days: any[];
    }) {
        logger.info(`Trainer ID ${programData.trainerId} attempting to create workout program for member publicId: ${programData.memberPublicId}`);
        const { trainerId, memberPublicId, title, type, splitType, days } = programData;

        const member = await prisma.member.findUnique({
            where: { publicId: memberPublicId },
        });

        if (!member) {
            logger.warn(`Workout program creation failed: Member not found with publicId: ${memberPublicId}`);
            throw new Error("Üye bulunamadı.");
        }

        if (member.trainerId !== trainerId) {
            logger.warn(`Workout program creation unauthorized: Trainer ID ${trainerId} does not match member's trainer ID ${member.trainerId}`);
            throw new Error("Bu üyeye program oluşturma yetkiniz yok.");
        }

        const exercisePublicIds = days
            .flatMap((day: any) => day.exercises || [])
            .map((ex: any) => ex.exercisePublicId);

        const exercisesFromDb = await prisma.exercise.findMany({
            where: { publicId: { in: exercisePublicIds } },
            select: { id: true, publicId: true },
        });

        const exerciseIdMap = new Map(
            exercisesFromDb.map((e) => [e.publicId, e.id])
        );

        for (const pid of exercisePublicIds) {
            if (!exerciseIdMap.has(pid)) {
                logger.warn(`Workout program creation failed: Exercise not found with publicId: ${pid}`);
                throw new Error(`Egzersiz bulunamadı: ${pid}`);
            }
        }
        // create
        const newProgram = await prisma.program.create({
            data: {
                memberId: member.id,
                trainerId,
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
                                exerciseId: exerciseIdMap.get(exercise.exercisePublicId)!,
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
                            include: { exercise: true, sets: true }
                        }
                    }
                },
                trainer: { select: { name: true, surname: true } }
            }
        });

        logger.info(`Workout program successfully created with ID: ${newProgram.id} for member ID: ${member.id}`);
        return newProgram;
    }

    // DELETE WORKOUT PROGRAM BY USER 
    async deleteWorkoutProgram(programPublicId: string, trainerId: number) {
        logger.info(`Trainer ID ${trainerId} attempting to delete workout program with publicId: ${programPublicId}`);
        const program = await prisma.program.findFirst({
            where: {
                publicId: programPublicId,
                trainerId: trainerId,
            },
        });

        if (!program) {
            logger.warn(`Workout program deletion failed: Program not found or unauthorized with publicId: ${programPublicId} for trainer ID: ${trainerId}`);
            throw new Error("The program was either not found or you do not have permission to perform this operation.");
        }

        await prisma.program.delete({
            where: {
                id: program.id,
            },
        });

        logger.info(`Workout program successfully deleted with ID: ${program.id}`);
        return {
            success: true,
            message: "The program and all associated content have been successfully deleted."
        };
    }

    // GET WORKOUT PROGRAM DETAIL BY USER
    async getProgramDetail(programPublicId: string, trainerId: number) {
        logger.info(`Fetching workout program detail for publicId: ${programPublicId} by trainer ID: ${trainerId}`);
        const program = await prisma.program.findFirst({
            where: {
                publicId: programPublicId,
                trainerId: trainerId,
            },
            include: {
                days: {
                    orderBy: {
                        dayOrder: 'asc',
                    },
                    include: {
                        exercises: {
                            orderBy: {
                                orderIndex: 'asc',
                            },
                            include: {
                                exercise: true, 
                                sets: {
                                    orderBy: {
                                        setNumber: 'asc',
                                    },
                                },
                            },
                        },
                    },
                },
                member: {
                    select: {
                        publicId: true,
                        name: true,
                        surname: true,
                        email: true,
                    },
                },
            },
        });

        if (!program) {
            logger.warn(`Workout program detail fetch failed: Program not found or unauthorized with publicId: ${programPublicId} for trainer ID: ${trainerId}`);
            throw new Error("Program was either not found or you do not have permission to view this program.");
        }

        logger.info(`Successfully fetched workout program detail for ID: ${program.id}`);
        return {
            success: true,
            data: program,
        };
    }
}