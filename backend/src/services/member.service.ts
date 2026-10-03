import prisma from "../lib/db";
import { CompleteProfileInput } from '../types/types';
import { logger } from "../config/logger";
import { UpdateMemberProfileData } from '../types/member.types';

export class MemberService {
    async getAssignedTrainerForMember(memberId: number) {
        logger.info(`Fetching assigned trainer for member ID: ${memberId}`);
        const member = await prisma.member.findUnique({
            where: { id: memberId },
            select: {
                assignmentStatus: true,
                trainer: {
                    select: {
                        name: true,
                        surname: true,
                        email: true,
                    }
                }
            }
        });

        if (!member) {
            logger.warn(`Assigned trainer fetch failed: Member not found with ID: ${memberId}`);
            throw new Error("Member not found");
        }

        logger.info(`Successfully fetched assigned trainer for member ID: ${memberId}`);
        return {
            trainer: member.trainer,
            assignmentStatus: member.assignmentStatus,
        };
    }

    async updateMemberProfile(memberId: number, data: CompleteProfileInput) {
        logger.info(`Attempting to update profile for member ID: ${memberId}`);
        const existingMember = await prisma.member.findUnique({
            where: { id: memberId },
        });

        if (!existingMember) {
            logger.warn(`Profile update failed: Member not found with ID: ${memberId}`);
            throw new Error("Member not found");
        }
        const updatedData = {
            ...(data.age !== undefined && { age: data.age }),
            ...(data.height !== undefined && { height: data.height }),
            ...(data.weight !== undefined && { weight: data.weight }),
            ...(data.gender !== undefined && { gender: data.gender }),
            ...(data.medicalNotes !== undefined && { medicalNotes: data.medicalNotes }),
            ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
            isProfileCompleted: true,
        };
        await prisma.member.update({
            where: { id: memberId },
            data: updatedData,
        });
        logger.info(`Profile successfully updated for member ID: ${memberId}`);
        return updatedData;
    }

    async getCurrentMember(memberId: number) {
        logger.info(`Fetching current profile data for member ID: ${memberId}`);
        const member = await prisma.member.findUnique({
            where: { id: memberId },
            select: {
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
                        name: true,
                    }
                },
                trainer: {
                    select: {
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
                        checkIn: true,
                        checkOut: true,
                    },
                }
            }
        });

        if (!member) {
            logger.warn(`Current member fetch failed: Member not found with ID: ${memberId}`);
            throw new Error("Member not found");
        }

        logger.info(`Successfully fetched current profile data for member ID: ${memberId}`);
        return member;
    }

    async getMemberPrograms(memberId: number, onlyActive: boolean = false) {
        logger.info(`Attempting to fetch programs for member ID: ${memberId}`);
        const existingMember = await prisma.member.findUnique({
            where: { id: memberId },
            select: { id: true },
        });

        if (!existingMember) {
            logger.warn(`Fetch programs failed: Member not found with ID: ${memberId}`);
            throw new Error("Member not found");
        }

        const programs = await prisma.program.findMany({
            where: {
                memberId,
                ...(onlyActive && { isActive: true }),
            },
            orderBy: { createdAt: 'desc' },
            select: {
                title: true,
                type: true,
                splitType: true,
                isActive: true,
                createdAt: true,
                archivedAt: true,
                days: {
                    orderBy: { dayOrder: 'asc' },
                    select: {
                        dayName: true,
                        dayOrder: true,
                        isRestDay: true,
                        exercises: {
                            orderBy: { orderIndex: 'asc' },
                            select: {
                                orderIndex: true,
                                notes: true,
                                exercise: {
                                    select: { name: true },
                                },
                                sets: {
                                    orderBy: { setNumber: 'asc' },
                                    select: {
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
        });

        logger.info(`Fetched ${programs.length} programs for member ID: ${memberId}`);
        return programs;
    }

    async getMyPrograms(memberId: number) {
        logger.info(`Database query: Fetching programs for member ID: ${memberId}`);

        const programs = await prisma.program.findMany({
            where: {
                memberId: memberId,
            },
            select: {
                id: false,
                publicId: true,
                title: true,
                type: true,
                splitType: true,
                isActive: true,
                createdAt: true,
                trainer: {
                    select: {
                        publicId: true,
                        name: true,
                        surname: true,
                        email: true,
                    }
                },
                days: {
                    orderBy: { dayOrder: 'asc' },
                    select: {
                        id: false,
                        publicId: true,
                        dayName: true,
                        dayOrder: true,
                        isRestDay: true,
                        exercises: {
                            orderBy: { orderIndex: 'asc' },
                            select: {
                                id: false,
                                publicId: true,
                                orderIndex: true,
                                notes: true,
                                exercise: {
                                    select: {
                                        id: false,
                                        publicId: true,
                                        name: true,
                                        category: true,
                                        bodyPart: true,
                                        equipment: true,
                                        targetMuscle: true,
                                        instructions: true,
                                        instruction_steps: true,
                                        gifUrl: true,
                                        createdAt: true,
                                    }
                                },
                                sets: {
                                    orderBy: { setNumber: 'asc' },
                                    select: {
                                        id: false,
                                        publicId: true,
                                        setNumber: true,
                                        targetReps: true,
                                        targetWeight: true,
                                        rir: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        logger.info(`Successfully fetched ${programs.length} programs for member ID: ${memberId}`);
        return programs;
    }

    async updateMemberProfileService(
        memberId: number,
        data: UpdateMemberProfileData
    ) {
        logger.info(`Attempting to update profile for member ID: ${memberId}`);

        const existingMember = await prisma.member.findUnique({
            where: { id: memberId },
        });

        if (!existingMember) {
            logger.warn(`Member profile update failed: Member not found with ID: ${memberId}`);
            throw new Error("Member not found");
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
}