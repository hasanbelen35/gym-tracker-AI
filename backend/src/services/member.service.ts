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

    // GET MEMBER'S WORKOUT PROGRAMS BY ID SERVICE
    async getMemberPrograms(memberId: number, onlyActive: boolean = false) {
        AppError.assertMemberId(memberId);

        logger.info(`Attempting to fetch programs for member ID: ${memberId}`);

        const existingMember = await prisma.member.findUnique({
            where: { id: memberId },
            select: { id: true },
        });

        if (!existingMember) {
            logger.warn(`Fetch programs failed: Member not found with ID: ${memberId}`);
            throw new AppError(404, "Üye sistemde bulunamadı.");
        }

        const programs = await prisma.program.findMany({
            where: {
                memberId,
                ...(onlyActive && { isActive: true }),
            },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
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
                        dayName: true,
                        dayOrder: true,
                        isRestDay: true,
                        exercises: {
                            orderBy: { orderIndex: 'asc' },
                            select: {
                                id: true,
                                orderIndex: true,
                                notes: true,
                                exercise: {
                                    select: {
                                        id: true,
                                        name: true,
                                        category: true,
                                        targetMuscle: true
                                    },
                                },
                                sets: {
                                    orderBy: { setNumber: 'asc' },
                                    select: {
                                        id: true,
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

    // TODO : WILL ADD CONTROLLERS FOR THEM
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