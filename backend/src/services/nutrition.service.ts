import { PrismaClient, MealType } from "@prisma/client";
import { logger } from "../config/logger";

const prisma = new PrismaClient();

export class DietService {
    // CREATE DIET PROGRAM
    async createDietProgram(programData: {
        trainerId: number;
        memberPublicId: string;
        title: string;
        days: any[];
    }) {
        logger.info(`Trainer ID ${programData.trainerId} attempting to create diet program for member publicId: ${programData.memberPublicId}`);
        const { trainerId, memberPublicId, title, days } = programData;

        const member = await prisma.member.findUnique({
            where: { publicId: memberPublicId },
        });

        if (!member) {
            logger.warn(`Diet program creation failed: Member not found with publicId: ${memberPublicId}`);
            throw new Error("Member not found.");
        }

        if (member.trainerId !== trainerId) {
            logger.warn(`Diet program creation unauthorized: Trainer ID ${trainerId} does not match member's trainer ID ${member.trainerId}`);
            throw new Error("You do not have permission to create a diet program for this member.");
        }

        const newProgram = await prisma.dietProgram.create({
            data: {
                memberId: member.id,
                trainerId,
                title,
                isActive: true,
                days: {
                    create: days.map((day: any) => ({
                        dayName: day.dayName,
                        dayOrder: Number(day.dayOrder),
                        meals: {
                            create: (day.meals || []).map((meal: any, mealIndex: number) => ({
                                mealType: meal.mealType as MealType,
                                mealTitle: meal.mealTitle || null,
                                orderIndex: Number(meal.orderIndex ?? mealIndex),
                                items: {
                                    create: (meal.items || []).map((item: any) => ({
                                        foodName: item.foodName,
                                        amount: Number(item.amount),
                                        unit: item.unit,
                                        calories: item.calories !== undefined && item.calories !== null ? Number(item.calories) : null,
                                        protein: item.protein !== undefined && item.protein !== null ? Number(item.protein) : null,
                                        carbs: item.carbs !== undefined && item.carbs !== null ? Number(item.carbs) : null,
                                        fat: item.fat !== undefined && item.fat !== null ? Number(item.fat) : null,
                                        notes: item.notes || null,
                                    })),
                                },
                            })),
                        },
                    })),
                },
            },
            include: {
                days: {
                    orderBy: { dayOrder: 'asc' },
                    include: {
                        meals: {
                            orderBy: { orderIndex: 'asc' },
                            include: { items: true },
                        },
                    },
                },
                trainer: { select: { name: true, surname: true } },
            },
        });

        logger.info(`Diet program successfully created with ID: ${newProgram.id} for member ID: ${member.id}`);
        return newProgram;
    }

    // DELETE DIET PROGRAM
    async deleteDietProgram(programPublicId: string, trainerId: number) {
        logger.info(`Trainer ID ${trainerId} attempting to delete diet program with publicId: ${programPublicId}`);
        const program = await prisma.dietProgram.findFirst({
            where: {
                publicId: programPublicId,
                trainerId: trainerId,
            },
        });

        if (!program) {
            logger.warn(`Diet program deletion failed: Program not found or unauthorized with publicId: ${programPublicId} for trainer ID: ${trainerId}`);
            throw new Error("The diet program was either not found or you do not have permission to perform this operation.");
        }

        await prisma.dietProgram.delete({
            where: {
                id: program.id,
            },
        });

        logger.info(`Diet program successfully deleted with ID: ${program.id}`);
        return {
            success: true,
            message: "The diet program and all associated content have been successfully deleted.",
        };
    }

    // GET DIET PROGRAM DETAIL
    async getDietProgramDetail(programPublicId: string, trainerId: number) {
        logger.info(`Fetching diet program detail for publicId: ${programPublicId} by trainer ID: ${trainerId}`);
        const program = await prisma.dietProgram.findFirst({
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
                        meals: {
                            orderBy: {
                                orderIndex: 'asc',
                            },
                            include: {
                                items: true,
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
            logger.warn(`Diet program detail fetch failed: Program not found or unauthorized with publicId: ${programPublicId} for trainer ID: ${trainerId}`);
            throw new Error("Diet program was either not found or you do not have permission to view this program.");
        }

        logger.info(`Successfully fetched diet program detail for ID: ${program.id}`);
        return {
            success: true,
            data: program,
        };
    }

    // LIST MEMBER DIET PROGRAMS
    async getMemberDietPrograms(memberPublicId: string, trainerId: number) {
        logger.info(`Fetching diet programs for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
        
        const member = await prisma.member.findUnique({
            where: { publicId: memberPublicId },
        });

        if (!member || member.trainerId !== trainerId) {
            logger.warn(`Fetch member diet programs unauthorized or member not found: ${memberPublicId}`);
            throw new Error("Member not found or you do not have permission to access this member.");
        }

        const programs = await prisma.dietProgram.findMany({
            where: { memberId: member.id },
            orderBy: { createdAt: 'desc' },
            include: {
                days: {
                    include: {
                        meals: {
                            include: { items: true },
                        },
                    },
                },
            },
        });

        logger.info(`Successfully fetched ${programs.length} diet programs for member ID: ${member.id}`);
        return programs;
    }
}