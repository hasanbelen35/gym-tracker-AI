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

    // SET MEMBER AS PENDING ONLY IF STILL UNASSIGNED AND IN SAME GYM
    async setPendingAssignment(memberId: number, trainerId: number, gymPublicId: string) {
        const result = await prisma.member.updateMany({
            where: {
                id: memberId,
                assignmentStatus: 'UNASSIGNED',
                gym: { publicId: gymPublicId }
            },
            data: {
                trainerId: trainerId,
                assignmentStatus: 'PENDING',
            }
        });

        if (result.count === 0) return null;

        return await prisma.member.findUnique({
            where: { id: memberId },
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

    // CLEAR ASSIGNMENT ONLY IF MEMBER STILL BELONGS TO TRAINER
    async clearAssignment(memberId: number, trainerId: number) {
        const result = await prisma.member.updateMany({
            where: {
                id: memberId,
                trainerId: trainerId,
                assignmentStatus: { in: ['PENDING', 'ASSIGNED'] }
            },
            data: {
                trainerId: null,
                assignmentStatus: 'UNASSIGNED',
            }
        });

        if (result.count === 0) return null;

        return await prisma.member.findUnique({
            where: { id: memberId },
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
            orderBy: { name: 'asc' },
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
                    photos: true,
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
    // CREATE MEASUREMENT FOR ASSIGNED MEMBER ONLY
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
                publicId: true,
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
                measuredAt: true,
                createdAt: true
            }
        });
    },

    // FIND MEASUREMENT BY PUBLIC ID SCOPED TO ASSIGNED MEMBER & TRAINER
    async findByPublicId(trainerId: number, memberPublicId: string, measurementPublicId: string) {
        return await prisma.memberMeasurement.findFirst({
            where: {
                publicId: measurementPublicId,
                member: {
                    publicId: memberPublicId,
                    trainerId: trainerId,
                    assignmentStatus: 'ASSIGNED'
                }
            },
            select: {
                id: true,
                publicId: true
            }
        });
    },

    // DELETE MEASUREMENT SCOPED TO ASSIGNED MEMBER & TRAINER
    async deleteByPublicId(trainerId: number, memberPublicId: string, measurementPublicId: string) {
        return await prisma.memberMeasurement.deleteMany({
            where: {
                publicId: measurementPublicId,
                member: {
                    publicId: memberPublicId,
                    trainerId: trainerId,
                    assignmentStatus: 'ASSIGNED'
                }
            }
        });
    }
};

// TRAINER PROFILE PROCESSES
export const trainerProfileRepo = {
    async findById(trainerId: number) {
        return await prisma.trainer.findUnique({
            where: { id: trainerId },
            select: { id: true },
        });
    },

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

    // ACTIVATE PROGRAM AND CLEAR ARCHIVE DATE (SAFE WITH TRAINER & ASSIGNED MEMBER SCOPING)
    async activate(trainerId: number, programPublicId: string) {
        const program = await prisma.program.findFirst({
            where: {
                publicId: programPublicId,
                member: {
                    trainerId,
                    assignmentStatus: 'ASSIGNED',
                },
            },
            select: { id: true },
        });

        if (!program) return null;

        return await prisma.program.update({
            where: { id: program.id },
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

// ==========================================
// WORKOUT LOG REPOSITORY
// ==========================================

export const workoutLogRepository = {
    // Üyenin bu antrenöre atanıp atanmadığını kontrol eder (Yetki Doğrulama)
    async isMemberAssignedToTrainer(memberPublicId: string, trainerId: number): Promise<boolean> {
        const member = await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED'
            },
            select: { id: true },
        });
        return !!member;
    },

    // ASSIGNED ÜYENİN ANTRENMAN LOGLARINI PAGINATED GETİRİR
    async findMemberWorkoutLogsPaginated(trainerId: number, memberPublicId: string, skip: number, limit: number) {
        const where = {
            member: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED' as const
            }
        };

        return await prisma.workoutLog.findMany({
            where,
            orderBy: { startedAt: 'desc' },
            ...(skip >= 0 && limit > 0 && { skip, take: limit }),
            select: {
                id: true,
                publicId: true,
                startedAt: true,
                completedAt: true,
                durationMinutes: true,
                status: true,
                memberNote: true,
                aiFeedback: true,
                workoutDay: {
                    select: {
                        id: true,
                        publicId: true,
                        dayName: true,
                        dayOrder: true,
                    },
                },
                exerciseLogs: {
                    orderBy: { orderIndex: 'asc' },
                    select: {
                        id: true,
                        publicId: true,
                        exerciseName: true,
                        orderIndex: true,
                        notes: true,
                        setLogs: {
                            orderBy: { setNumber: 'asc' },
                            select: {
                                id: true,
                                publicId: true,
                                setNumber: true,
                                targetReps: true,
                                targetWeight: true,
                                targetRir: true,
                                actualReps: true,
                                actualWeight: true,
                                actualRir: true,
                                status: true,
                            },
                        },
                    },
                },
            },
        });
    },

    // ASSIGNED ÜYENİN TOPLAM ANTRENMAN KAYDI SAYISINI DÖNER
    async countMemberWorkoutLogs(trainerId: number, memberPublicId: string): Promise<number> {
        return await prisma.workoutLog.count({
            where: {
                member: {
                    publicId: memberPublicId,
                    trainerId: trainerId,
                    assignmentStatus: 'ASSIGNED'
                }
            },
        });
    },
};