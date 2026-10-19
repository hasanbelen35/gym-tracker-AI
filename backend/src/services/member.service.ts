import prisma from "../lib/db";
import { CompleteProfileInput } from '../types/types';
import { logger } from "../config/logger";
import { UpdateMemberProfileData } from '../types/member.types';
import { CompleteWorkoutInput } from "../validations/workout.validations";
import { AppError } from "../middleware/errorMiddleware";
import { Prisma } from "@prisma/client";

export class MemberService {
    // GET MEMBER'S TRAINER DATA BY MEMBER ID CONTROLLER

    async getAssignedTrainerForMember(memberId: number) {
        AppError.assertMemberId(memberId);

        logger.info(`Fetching assigned trainer for member ID: ${memberId}`);

        const member = await prisma.member.findUnique({
            where: { id: memberId },
            select: {
                assignmentStatus: true,
                trainer: {
                    select: {
                        id: true,
                        publicId: true,
                        name: true,
                        surname: true,
                        email: true,
                        avatarUrl: true
                    }
                }
            }
        });

        if (!member) {
            logger.warn(`Assigned trainer fetch failed: Member not found with ID: ${memberId}`);
            throw new AppError(404, "Üye sistemde bulunamadı.");
        }

        logger.info(`Successfully fetched assigned trainer for member ID: ${memberId}`);
        return {
            trainer: member.trainer,
            assignmentStatus: member.assignmentStatus,
        };
    }

    // UPDATE PROFILE MEMBER 
    async updateMemberProfile(memberId: number, data: CompleteProfileInput) {
        AppError.assertMemberId(memberId);

        logger.info(`Attempting to update profile for member ID: ${memberId}`);

        const existingMember = await prisma.member.findUnique({
            where: { id: memberId },
        });

        if (!existingMember) {
            logger.warn(`Profile update failed: Member not found with ID: ${memberId}`);
            throw new AppError(404, "Üye bulunamadı.");
        }

        const updatedData: Prisma.MemberUpdateInput = {
            ...(data.age !== undefined && { age: data.age }),
            ...(data.height !== undefined && { height: data.height }),
            ...(data.weight !== undefined && { weight: data.weight }),
            ...(data.gender !== undefined && { gender: data.gender }),
            ...(data.medicalNotes !== undefined && { medicalNotes: data.medicalNotes }),
            ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
            isProfileCompleted: true,
        };

        const updatedMember = await prisma.member.update({
            where: { id: memberId },
            data: updatedData,
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                email: true,
                age: true,
                height: true,
                weight: true,
                gender: true,
                medicalNotes: true,
                avatarUrl: true,
                isProfileCompleted: true,
                updatedAt: true
            }
        });

        logger.info(`Profile successfully updated for member ID: ${memberId}`);
        return updatedMember;
    }

    // GET CURRENT MEMBER's DATA 
    async getCurrentMember(memberId: number) {
        AppError.assertMemberId(memberId);

        logger.info(`Fetching current profile data for member ID: ${memberId}`);

        const member = await prisma.member.findUnique({
            where: { id: memberId },
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                email: true,
                age: true,
                height: true,
                weight: true,
                phone: true,
                medicalNotes: true,
                gender: true,
                avatarUrl: true,
                assignmentStatus: true,
                isProfileCompleted: true,
                gym: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                trainer: {
                    select: {
                        id: true,
                        publicId: true,
                        name: true,
                        surname: true,
                        email: true,
                    }
                },
                sessions: {
                    take: 5,
                    orderBy: {
                        checkIn: 'desc',
                    },
                    select: {
                        id: true,
                        checkIn: true,
                        checkOut: true,
                    },
                }
            }
        });

        if (!member) {
            logger.warn(`Current member fetch failed: Member not found with ID: ${memberId}`);
            throw new AppError(404, "Üye profili bulunamadı.");
        }

        logger.info(`Successfully fetched current profile data for member ID: ${memberId}`);
        
        return member;
    }
    
    
    // get member programs paginated 
    async getMemberPrograms(
        memberId: number,
        options: { onlyActive?: boolean; page?: number; limit?: number } = {}
    ) {
        AppError.assertMemberId(memberId);

        const { onlyActive = false, page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;

        const existingMember = await prisma.member.findUnique({
            where: { id: memberId },
            select: { id: true },
        });

        if (!existingMember) {
            throw new AppError(404, "Üye sistemde bulunamadı.");
        }

        const whereCondition = {
            memberId,
            ...(onlyActive && { isActive: true }),
        };

        const [programs, totalCount] = await Promise.all([
            prisma.program.findMany({
                where: whereCondition,
                orderBy: { createdAt: 'desc' },
                ...(!onlyActive && { skip, take: limit }),
                select: {
                    id: true,
                    publicId: true,
                    title: true,
                    type: true,
                    splitType: true,
                    isActive: true,
                    createdAt: true,
                    archivedAt: true,
                    days: {
                        orderBy: { dayOrder: 'asc' },
                        select: {
                            id: true,
                            publicId: true,
                            dayName: true,
                            dayOrder: true,
                            isRestDay: true,
                            exercises: {
                                orderBy: { orderIndex: 'asc' },
                                select: {
                                    id: true,
                                    publicId: true,
                                    orderIndex: true,
                                    notes: true,
                                    exercise: {
                                        select: {
                                            id: true,
                                            publicId: true,
                                            name: true,
                                            category: true,
                                            targetMuscle: true,
                                            gifUrl: true,
                                        },
                                    },
                                    sets: {
                                        orderBy: { setNumber: 'asc' },
                                        select: {
                                            id: true,
                                            publicId: true,
                                            setNumber: true,
                                            targetReps: true,
                                            targetWeight: true,
                                            rir: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }),
            prisma.program.count({ where: whereCondition })
        ]);

        return {
            data: programs,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            },
        };
    }

    
    // UPDATE MEMBER'S PROFILE BY ID  SERVICE 
    async updateMemberProfileService(
        memberId: number,
        data: UpdateMemberProfileData
    ) {
        AppError.assertMemberId(memberId);

        logger.info(`Attempting to update profile for member ID: ${memberId}`);

        const existingMember = await prisma.member.findUnique({
            where: { id: memberId },
        });

        if (!existingMember) {
            logger.warn(`Member profile update failed: Member not found with ID: ${memberId}`);
            throw new AppError(404, "Üye bulunamadı.");
        }

        const updatedMember = await prisma.member.update({
            where: { id: memberId },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.surname !== undefined && { surname: data.surname }),
                ...(data.gender !== undefined && { gender: data.gender }),
                ...(data.phone !== undefined && { phone: data.phone }),
                ...(data.age !== undefined && { age: data.age }),
                ...(data.height !== undefined && { height: data.height }),
                ...(data.weight !== undefined && { weight: data.weight }),
                ...(data.medicalNotes !== undefined && { medicalNotes: data.medicalNotes }),
            },
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                email: true,
                phone: true,
                gender: true,
                age: true,
                height: true,
                weight: true,
                avatarUrl: true,
                medicalNotes: true,
                assignmentStatus: true,
                updatedAt: true,
            },
        });

        logger.info(`Successfully updated profile for member ID: ${memberId}`);
        return updatedMember;
    }




    // LOG WORKOUTS
}