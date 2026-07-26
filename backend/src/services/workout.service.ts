import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ExerciseService {
    async getExercisesByQuery(query: {
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
        trainerId: number;
        memberPublicId: string;
        title: string;
        type?: string;
        splitType?: string;
        days: any[];
    }) {
        const { trainerId, memberPublicId, title, type, splitType, days } = programData;

        const member = await prisma.member.findUnique({
            where: { publicId: memberPublicId },
        });

        if (!member) {
            throw new Error("Üye bulunamadı.");
        }

        if (member.trainerId !== trainerId) {
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

        return newProgram;
    }
}