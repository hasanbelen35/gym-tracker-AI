import prisma from "../lib/db";
import { CompleteProfileInput } from '../types/types';
import { logger } from "../config/logger";
import { UpdateMemberProfileData } from '../types/member.types';
import { CompleteWorkoutInput } from "../validations/workout.validations";

export class MemberService {
    // GET ASSIGNED TRAINER TO MEMBER 
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
    // UPDATE PROFILE MEMBER 
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
    // GET CURRENT MEMBER's DATA 
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
    // GET MEMBER'S PROGRAMS 
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
    // UPDATE MEMBER'S PROFILE BY ID 
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

    // COMPLATE WORKOUT LOGS 
    async complateWorkoutLogsService(
        memberId: number,
        input: CompleteWorkoutInput
    ) {
        logger.info(`Attempting to complete workout session for member ID: ${memberId}`);

        const existingMember = await prisma.member.findUnique({
            where: { id: memberId },
            select: { id: true },
        });

        if (!existingMember) {
            logger.warn(`Workout session completion failed: Member not found with ID: ${memberId}`);
            throw new Error("Member not found");
        }

        if (input.workoutDayId !== undefined) {
            const existingDay = await prisma.workoutDay.findFirst({
                where: {
                    id: input.workoutDayId,
                    program: { memberId },
                },
                select: { id: true },
            });

            if (!existingDay) {
                logger.warn(`Workout session completion failed: Invalid workout day ID: ${input.workoutDayId} for member ID: ${memberId}`);
                throw new Error("Invalid workout day");
            }
        }

        const setIds = input.exercises
            .flatMap((ex) => ex.sets.map((s) => s.workoutSetId))
            .filter((id): id is number => id !== undefined);

        if (setIds.length > 0) {
            const uniqueSetIds = [...new Set(setIds)];
            const foundSetsCount = await prisma.workoutSet.count({
                where: {
                    id: { in: uniqueSetIds },
                    workoutExercise: {
                        day: {
                            program: { memberId },
                        },
                    },
                },
            });

            if (foundSetsCount !== uniqueSetIds.length) {
                logger.warn(`Workout session completion failed: Invalid or unauthorized workout set references for member ID: ${memberId}`);
                throw new Error("Invalid workout set references");
            }
        }

        const completedAt = new Date();
        const startedAt = input.durationMinutes
            ? new Date(completedAt.getTime() - input.durationMinutes * 60000)
            : completedAt;

        const workoutLog = await prisma.workoutLog.create({
            data: {
                memberId,
                workoutDayId: input.workoutDayId,
                durationMinutes: input.durationMinutes,
                memberNote: input.memberNote,
                status: "COMPLETED",
                startedAt,
                completedAt,
                exerciseLogs: {
                    create: input.exercises.map((ex) => ({
                        exerciseName: ex.exerciseName,
                        orderIndex: ex.orderIndex,
                        notes: ex.notes,
                        setLogs: {
                            create: ex.sets.map((set) => {
                                const isSkipped = set.status === "SKIPPED";
                                return {
                                    workoutSetId: set.workoutSetId,
                                    setNumber: set.setNumber,
                                    targetReps: set.targetReps,
                                    targetWeight: set.targetWeight,
                                    targetRir: set.targetRir,
                                    actualReps: isSkipped ? null : set.actualReps,
                                    actualWeight: isSkipped ? null : set.actualWeight,
                                    actualRir: isSkipped ? null : set.actualRir,
                                    status: set.status,
                                };
                            }),
                        },
                    })),
                },
            },
            select: {
                id: true,
                publicId: true,
                memberId: true,
                workoutDayId: true,
                startedAt: true,
                completedAt: true,
                durationMinutes: true,
                status: true,
                memberNote: true,
                aiFeedback: true,
                createdAt: true,
                updatedAt: true,
                exerciseLogs: {
                    orderBy: { orderIndex: "asc" },
                    select: {
                        id: true,
                        publicId: true,
                        exerciseName: true,
                        orderIndex: true,
                        notes: true,
                        setLogs: {
                            orderBy: { setNumber: "asc" },
                            select: {
                                id: true,
                                publicId: true,
                                workoutSetId: true,
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

        logger.info(`Successfully completed workout session with log ID: ${workoutLog.id} for member ID: ${memberId}`);
        return workoutLog;
    }
}