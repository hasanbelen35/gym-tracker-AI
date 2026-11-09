import prisma from "../lib/db";
import { Gender } from "@prisma/client";
import { CreateMeasurementType } from "../types/types";
import { UpdateTrainerProfileData } from "../types/trainer.types";

// TRAINER GYM PROCESSES
export const trainerGymRepo = {
    // FIND GYM PUBLIC ID BY TRAINER ID
    async findGymByTrainerId(trainerId: number) {
        return await prisma.trainer.findUnique({
            where: { id: trainerId },
            select: {
                gym: {
                    select: { publicId: true }
                }
            }
        });
    }
};

// TRAINER MEMBER PROCESSES
export const trainerMemberRepo = {
    // FIND MEMBER BY PUBLIC ID INSIDE A GYM
    async findInGymByPublicId(memberPublicId: string, gymPublicId: string) {
        return await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                gym: { publicId: gymPublicId },
            },
            select: {
                id: true,
                publicId: true,
                assignmentStatus: true,
                trainerId: true,
            }
        });
    },

    // SET MEMBER AS PENDING FOR TRAINER
    async setPendingAssignment(memberId: number, trainerId: number) {
        return await prisma.member.update({
            where: { id: memberId },
            data: {
                trainerId: trainerId,
                assignmentStatus: 'PENDING',
            },
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                assignmentStatus: true,
                trainerId: true,
            }
        });
    },

    // CLEAR MEMBER ASSIGNMENT AND SET UNASSIGNED
    async clearAssignment(memberId: number) {
        return await prisma.member.update({
            where: { id: memberId },
            data: {
                trainerId: null,
                assignmentStatus: 'UNASSIGNED',
            },
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                assignmentStatus: true,
                trainerId: true,
            }
        });
    },

    // FIND MEMBERS BY ASSIGNMENT STATUS
    async findByStatus(trainerId: number, gymPublicId: string, status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED') {
        return await prisma.member.findMany({
            where: {
                trainerId: status === 'UNASSIGNED' ? null : trainerId,
                gym: { publicId: gymPublicId },
                assignmentStatus: status
            },
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                email: true,
                avatarUrl: true,
                assignmentStatus: true
            }
        });
    },


    // FIND MEMBER'S DETAILED PROFILE DATA
    async findAssignedProfile(trainerId: number, memberPublicId: string) {
        return await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED'
            },
            select: {
                id: true,
                publicId: true,
                name: true,
                surname: true,
                email: true,
                phone: true,
                createdAt: true,
                assignmentStatus: true,
                weight: true,
                height: true,
                age: true,
                medicalNotes: true,
                gender: true,
                avatarUrl: true,
                gym: {
                    select: { id: true, name: true }
                }
            }
        });
    },

    // PAGINATED MEASUREMENTS DATA
    async findMemberMeasurements(trainerId: number, memberPublicId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const where = {
            member: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED' as const
            }
        };

        const [data, total] = await Promise.all([
            prisma.memberMeasurement.findMany({
                where,
                orderBy: { measuredAt: 'desc' },
                skip,
                take: limit,
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
                    notes: true,
                    measuredAt: true,
                    createdAt: true
                }
            }),
            prisma.memberMeasurement.count({ where })
        ]);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    // PAGINATED SESSIONS DATA
    async findMemberSessions(trainerId: number, memberPublicId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const where = {
            member: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED' as const
            }
        };

        const [data, total] = await Promise.all([
            prisma.session.findMany({
                where,
                orderBy: { checkIn: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    publicId: true,
                    checkIn: true,
                    checkOut: true,
                    duration: true
                }
            }),
            prisma.session.count({ where })
        ]);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    // PAGINATED PROGRAMS DATA
    async findMemberPrograms(trainerId: number, memberPublicId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const where = {
            member: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED' as const
            }
        };

        const [data, total] = await Promise.all([
            prisma.program.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    publicId: true,
                    title: true,
                    type: true,
                    splitType: true,
                    isActive: true,
                    createdAt: true
                }
            }),
            prisma.program.count({ where })
        ]);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },




    // FIND ASSIGNED MEMBER ID FOR AUTHORIZATION CHECK
    async findAssignedIdByPublicId(trainerId: number, memberPublicId: string) {
        return await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED'
            },
            select: { id: true }
        });
    },

    // FIND ASSIGNED MEMBER WITH ALL MEASUREMENTS
    async findAssignedWithMeasurements(trainerId: number, memberPublicId: string) {
        return await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED'
            },
            select: {
                id: true,
                measurements: {
                    orderBy: { measuredAt: 'desc' }
                }
            }
        });
    }
};

// TRAINER MEASUREMENT PROCESSES
export const trainerMeasurementRepo = {
    // CREATE MEASUREMENT FOR MEMBER
    async create(memberId: number, dto: CreateMeasurementType) {
        const {
            bodyFatRate,
            muscleMass,
            chest,
            waist,
            arm,
            hip,
            shoulder,
            photos,
            notes
        } = dto;

        return await prisma.memberMeasurement.create({
            data: {
                memberId,
                bodyFatRate,
                muscleMass,
                chest,
                waist,
                arm,
                hip,
                shoulder,
                photos: Array.isArray(photos) ? photos : [],
                notes,
            },
            select: {
                id: true,
                memberId: true,
                bodyFatRate: true,
                muscleMass: true,
                chest: true,
                waist: true,
                arm: true,
                hip: true,
                shoulder: true,
                photos: true,
                notes: true,
                createdAt: true
            }
        });
    },

    // FIND MEASUREMENT BY PUBLIC ID FOR MEMBER
    async findByPublicId(memberId: number, measurementPublicId: string) {
        return await prisma.memberMeasurement.findFirst({
            where: {
                publicId: measurementPublicId,
                memberId: memberId
            }
        });
    },

    // DELETE MEASUREMENT BY PUBLIC ID
    async deleteByPublicId(measurementPublicId: string) {
        return await prisma.memberMeasurement.delete({
            where: {
                publicId: measurementPublicId
            }
        });
    }
};

// TRAINER PROFILE PROCESSES
export const trainerProfileRepo = {
    // FIND TRAINER BY ID
    async findById(trainerId: number) {
        return await prisma.trainer.findUnique({
            where: { id: trainerId },
        });
    },

    // FIND TRAINER PROFILE WITH GYM
    async findProfileWithGym(trainerId: number) {
        return await prisma.trainer.findUnique({
            where: { id: trainerId },
            select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                gender: true,
                age: true,
                height: true,
                weight: true,
                phone: true,
                avatarUrl: true,
                createdAt: true,
                gym: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    },

    // COMPLETE TRAINER PROFILE
    async completeProfile(
        trainerId: number,
        data: {
            phone?: string;
            gender?: Gender;
            age?: number;
            height?: number;
            weight?: number;
            avatarUrl?: string;
        }
    ) {
        return await prisma.trainer.update({
            where: { id: trainerId },
            data: {
                ...(data.phone !== undefined && { phone: data.phone }),
                ...(data.gender !== undefined && { gender: data.gender }),
                ...(data.age !== undefined && { age: data.age }),
                ...(data.height !== undefined && { height: data.height }),
                ...(data.weight !== undefined && { weight: data.weight }),
                ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),

                isProfileCompleted: true,
            },
            select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                phone: true,
                gender: true,
                age: true,
                height: true,
                weight: true,
                avatarUrl: true,
                isProfileCompleted: true,
            },
        });
    },

    // UPDATE TRAINER PROFILE
    async updateProfile(trainerId: number, data: UpdateTrainerProfileData) {
        return await prisma.trainer.update({
            where: { id: trainerId },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.surname !== undefined && { surname: data.surname }),
                ...(data.gender !== undefined && { gender: data.gender }),
                ...(data.phone !== undefined && { phone: data.phone }),
                ...(data.age !== undefined && { age: data.age }),
                ...(data.height !== undefined && { height: data.height }),
                ...(data.weight !== undefined && { weight: data.weight }),
            },
            select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                phone: true,
                gender: true,
                age: true,
                height: true,
                weight: true,
                avatarUrl: true,
                isProfileCompleted: true,
                updatedAt: true,
            },
        });
    }
};

// TRAINER PROGRAM PROCESSES
export const trainerProgramRepo = {
    // FIND PROGRAM OF ASSIGNED MEMBER BY PUBLIC ID
    async findAssignedMemberProgram(trainerId: number, programPublicId: string) {
        return await prisma.program.findFirst({
            where: {
                publicId: programPublicId,
                member: {
                    trainerId,
                    assignmentStatus: 'ASSIGNED',
                },
            },
            select: { id: true },
        });
    },

    // ACTIVATE PROGRAM AND CLEAR ARCHIVE DATE
    async activate(programId: number) {
        return await prisma.program.update({
            where: { id: programId },
            data: {
                isActive: true,
                archivedAt: null,
            },
            select: {
                id: true,
                publicId: true,
                title: true,
                isActive: true,
                archivedAt: true,

            },
        });
    }
};