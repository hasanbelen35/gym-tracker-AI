// ==========================================
// MEMBER REPOSITORY
// ==========================================

import prisma from "../lib/db";
import { Prisma } from "@prisma/client";

export const memberRepository = {
    async findByIdWithTrainer(memberId: number) {
        return await prisma.member.findUnique({
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
    },

    async findById(memberId: number) {
        return await prisma.member.findUnique({
            where: { id: memberId },
        });
    },

    async findCurrentMemberWithRelations(memberId: number) {
        return await prisma.member.findUnique({
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
                },
                profile: true
            }
        });
    },

    async updateMemberWithProfileTransaction(
        memberId: number,
        memberData: Prisma.MemberUpdateInput,
        profileData: Prisma.MemberProfileUpdateInput
    ) {
        return await prisma.$transaction(async (tx) => {
            const updatedMember = await tx.member.update({
                where: { id: memberId },
                data: {
                    ...memberData,
                    isProfileCompleted: true,
                },
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

            const updatedProfile = await tx.memberProfile.upsert({
                where: { memberId: memberId },
                update: profileData,
                create: {
                    memberId: memberId,
                    ...(profileData as any)
                }
            });

            return {
                ...updatedMember,
                profile: updatedProfile
            };
        });
    },

    async updateMember(memberId: number, data: Prisma.MemberUpdateInput, selectFields?: Prisma.MemberSelect) {
        return await prisma.member.update({
            where: { id: memberId },
            data,
            ...(selectFields && { select: selectFields })
        });
    },

    async findProgramsPaginated(whereCondition: Prisma.ProgramWhereInput, skip: number, limit: number) {
        return await prisma.program.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' },
            ...(skip >= 0 && limit > 0 && { skip, take: limit }),
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
        });
    },

    async countPrograms(whereCondition: Prisma.ProgramWhereInput) {
        return await prisma.program.count({ where: whereCondition });
    }
};