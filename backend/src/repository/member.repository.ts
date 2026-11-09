// ==========================================
// MEMBER REPOSITORY
// ==========================================

import prisma from "../lib/db";
import { Prisma } from "@prisma/client";

export const memberRepository = {

    // FIND MEMBER ASSIGNMENT STATUS WITH TRAINER
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

    // CHECK MEMBER EXISTENCE (RETURNS ONLY ID, NEVER THE PASSWORD HASH)
    async findById(memberId: number) {
        return await prisma.member.findUnique({
            where: { id: memberId },
            select: { id: true },
        });
    },

    // FIND CURRENT MEMBER CORE PROFILE DATA
    async findCurrentMemberCore(memberId: number) {
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
                profile: {
                    select: {
                        goal: true,
                        experienceLevel: true,
                        workoutDaysPerWeek: true,
                        sessionDuration: true,
                        equipmentAccess: true,
                        activityLevel: true,
                        additionalNotes: true,
                    }
                }
            }
        });
    },

    // FIND MEMBER SESSIONS PAGINATED
    async findMemberSessionsPaginated(memberId: number, skip: number, take: number) {
        return await prisma.session.findMany({
            where: { memberId },
            orderBy: { checkIn: 'desc' },
            skip,
            take,
            select: {
                id: true,
                publicId: true,
                checkIn: true,
                checkOut: true,
                duration: true,
            },
        });
    },

    // COUNT MEMBER SESSIONS
    async countMemberSessions(memberId: number) {
        return await prisma.session.count({
            where: { memberId },
        });
    },

    // FIND MEMBER MEASUREMENTS PAGINATED
    async findMemberMeasurementsPaginated(memberId: number, skip: number, take: number) {
        return await prisma.memberMeasurement.findMany({
            where: { memberId },
            orderBy: { measuredAt: 'desc' },
            skip,
            take,
            select: {
                id: true,
                publicId: true,
                bodyFatRate: true,
                muscleMass: true,
                chest: true,
                waist: true,
                arm: true,
                hip: true,
                shoulder: true,
                photos: true,
                notes: true,
                measuredAt: true,
                createdAt: true,
            },
        });
    },

    // COUNT MEMBER MEASUREMENTS
    async countMemberMeasurements(memberId: number) {
        return await prisma.memberMeasurement.count({
            where: { memberId },
        });
    },

    // UPDATE MEMBER AND UPSERT MEMBER PROFILE IN ONE TRANSACTION
    async updateMemberWithProfileTransaction(
        memberId: number,
        memberData: Prisma.MemberUpdateInput,
        profileData: Partial<Omit<Prisma.MemberProfileUncheckedCreateInput, 'memberId'>>
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
                where: { memberId },
                update: profileData,
                create: { memberId, ...profileData }
            });

            return {
                ...updatedMember,
                profile: updatedProfile
            };
        });
    },

    // UPDATE MEMBER FIELDS WITH OPTIONAL SELECT
    async updateMember(memberId: number, data: Prisma.MemberUpdateInput, selectFields?: Prisma.MemberSelect) {
        return await prisma.member.update({
            where: { id: memberId },
            data,
            ...(selectFields && { select: selectFields })
        });
    },

    // FIND MEMBER PROGRAMS PAGINATED WITH DAYS, EXERCISES AND SETS
    async findProgramsPaginated(whereCondition: Prisma.ProgramWhereInput, skip: number, take: number) {
        return await prisma.program.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' },
            skip,
            take,
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

    // COUNT MEMBER PROGRAMS
    async countPrograms(whereCondition: Prisma.ProgramWhereInput) {
        return await prisma.program.count({ where: whereCondition });
    }
};