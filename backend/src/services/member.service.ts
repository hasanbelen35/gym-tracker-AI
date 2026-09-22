import prisma from "../lib/db";
import { CompleteProfileInput } from '../types/types';
import { logger } from "../config/logger";

export class MemberService {
    // wıll delete 
    async getAssignedTrainerForMember(memberId: number) {
        logger.info(`Fetching assigned trainer for member ID: ${memberId}`);
        const member = await prisma.member.findUnique({
            where: { id: memberId },
            include: {
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
            throw new Error("Üye kaydı bulunamadı.");
        }

        logger.info(`Successfully fetched assigned trainer for member ID: ${memberId}`);
        return {
            trainer: member.trainer,
            assignmentStatus: member.assignmentStatus,
        };
    }

    // UPDATE MEMBER PROFILE DATAS
    async updateMemberProfile(memberId: number, data: CompleteProfileInput) {
        logger.info(`Attempting to update profile for member ID: ${memberId}`);
        const existingMember = await prisma.member.findUnique({
            where: { id: memberId },
        });

        if (!existingMember) {
            logger.warn(`Profile update failed: Member not found with ID: ${memberId}`);
            throw new Error("Üye bulunamadı.");
        }
        // datas
        const updatedData = {
            ...(data.age !== undefined && { age: data.age }),
            ...(data.height !== undefined && { height: data.height }),
            ...(data.weight !== undefined && { weight: data.weight }),
            ...(data.gender !== undefined && { gender: data.gender }),
            ...(data.medicalNotes !== undefined && { medicalNotes: data.medicalNotes }),
            ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
            isProfileCompleted: true,
        };
        // update data in db
        await prisma.member.update({
            where: { id: memberId },
            data: updatedData,
        });
        logger.info(`Profile successfully updated for member ID: ${memberId}`);
        return updatedData;
    }
// get current member profile data
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
            throw new Error("Member can not founded.");
        }

        logger.info(`Successfully fetched current profile data for member ID: ${memberId}`);
        return member;
    }

    // GET MEMBER'S PROGRAM BY MEMBER ID 
    async getMemberPrograms(memberId: number, onlyActive: boolean = false) {
    logger.info(`Attempting to fetch programs for member ID: ${memberId}`);
    const existingMember = await prisma.member.findUnique({
        where: { id: memberId },
        select: { id: true },
    });

    if (!existingMember) {
        logger.warn(`Fetch programs failed: Member not found with ID: ${memberId}`);
        throw new Error("Üye bulunamadı.");
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
                                select: { name: true }, // Exercise modelindeki alanlara göre düzelt
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

}