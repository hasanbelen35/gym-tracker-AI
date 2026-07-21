import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ExerciseService {
    async getExercisesByQuery(query: {
        search?: string;
        category?: string;
        equipment?: string;
        targetMuscle?: string;
    }) {
        const { search, category, equipment, targetMuscle } = query;

        const whereClause: any = {};

        if (search && typeof search === "string") {
            whereClause.name = {
                contains: search,
            };
        }

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
}