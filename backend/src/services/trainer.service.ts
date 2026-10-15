import prisma from "../lib/db";
import { CreateMeasurementType } from '../types/types';
import { logger } from "../config/logger";
import { Gender } from "@prisma/client";
import { UpdateTrainerProfileData } from "../types/trainer.types";
import { AppError } from "../middleware/errorMiddleware";

export class TrainerService {
    // SEND ASSIGNMENT REQ TO GYM FOR MEMBER
    async requestMemberAssignment(memberPublicId: string, trainerId: number, gymPublicId?: string) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        let targetGymPublicId = gymPublicId;

        if (!targetGymPublicId || typeof targetGymPublicId !== "string" || targetGymPublicId.trim() === "") {
            const trainer = await prisma.trainer.findUnique({
                where: { id: trainerId },
                select: {
                    gym: {
                        select: { publicId: true }
                    }
                }
            });

            if (!trainer || !trainer.gym) {
                throw new AppError(404, "Eğitmenin bağlı olduğu bir salon bulunamadı.");
            }

            targetGymPublicId = trainer.gym.publicId;
        }

        logger.info(`Trainer ID ${trainerId} attempting to request assignment for member publicId: ${memberPublicId} in gym publicId: ${targetGymPublicId}`);

        const member = await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                gym: { publicId: targetGymPublicId },
            },
            select: {
                id: true,
                publicId: true,
                assignmentStatus: true,
                trainerId: true,
            }
        });

        if (!member) {
            logger.warn(`Request member assignment failed: Member not found with publicId: ${memberPublicId} in gym publicId: ${targetGymPublicId}`);
            throw new AppError(404, "Üye belirtilen salonda bulunamadı.");
        }

        if (member.assignmentStatus !== 'UNASSIGNED') {
            logger.warn(`Request assignment failed: Member status is ${member.assignmentStatus} for publicId: ${memberPublicId}`);
            throw new AppError(400, `Bu üye şu anda atama talebi oluşturmaya uygun değil. (Mevcut Durum: ${member.assignmentStatus})`);
        }

        const updatedMember = await prisma.member.update({
            where: { id: member.id },
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

        logger.info(`Assignment request successfully sent for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
        return updatedMember;
    }
    // CANCEL ASSIGNMENT REQ FROM GYM FOR MEMBER
    async cancelMyAssignmentRequest(memberPublicId: string, trainerId: number, gymPublicId?: string) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        // 1. Dışarıdan salon bilgisi gelmediyse eğitmenin kendi bağlı olduğu salonu veritabanından alıyoruz
        let targetGymPublicId = gymPublicId;

        if (!targetGymPublicId || typeof targetGymPublicId !== "string" || targetGymPublicId.trim() === "") {
            const trainer = await prisma.trainer.findUnique({
                where: { id: trainerId },
                select: {
                    gym: {
                        select: { publicId: true }
                    }
                }
            });

            if (!trainer || !trainer.gym) {
                throw new AppError(404, "Eğitmenin bağlı olduğu bir salon bulunamadı.");
            }

            targetGymPublicId = trainer.gym.publicId;
        }

        logger.info(`Trainer ID ${trainerId} attempting to cancel assignment request for member publicId: ${memberPublicId} in gym publicId: ${targetGymPublicId}`);

        const member = await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                gym: { publicId: targetGymPublicId },
            },
            select: {
                id: true,
                publicId: true,
                trainerId: true,
                assignmentStatus: true,
            }
        });

        if (!member) {
            logger.warn(`Cancel assignment failed: Member not found with publicId: ${memberPublicId} in gym publicId: ${targetGymPublicId}`);
            throw new AppError(404, "Üye bulunamadı.");
        }

        if (member.trainerId !== trainerId) {
            logger.warn(`Cancel assignment failed: Member publicId ${memberPublicId} is not assigned to trainer ID: ${trainerId}`);
            throw new AppError(403, "Bu üye üzerindeki atama talebini iptal etme yetkiniz yok.");
        }

        if (!['PENDING', 'ASSIGNED'].includes(member.assignmentStatus)) {
            logger.warn(`Cancel assignment failed: Member status is ${member.assignmentStatus} for publicId: ${memberPublicId}`);
            throw new AppError(400, "İptal edilecek aktif bir atama veya onay bekleyen talep bulunmuyor.");
        }

        const updatedMember = await prisma.member.update({
            where: { id: member.id },
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

        logger.info(`Assignment request successfully cancelled for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
        return updatedMember;
    }

    // GET MEMBER'S ASSIGNMENT STATUS
    async getMembersByStatus(
        trainerId: number,
        gymPublicId?: string,
        status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED' = 'ASSIGNED'
    ) {
        AppError.assertTrainerId(trainerId);

        const validStatuses = ['PENDING', 'ASSIGNED', 'UNASSIGNED'];
        if (!status || !validStatuses.includes(status)) {
            throw new AppError(400, "Geçersiz durum (status) parametresi.");
        }

        let targetGymPublicId = gymPublicId;

        if (!targetGymPublicId || typeof targetGymPublicId !== "string" || targetGymPublicId.trim() === "") {
            const trainer = await prisma.trainer.findUnique({
                where: { id: trainerId },
                select: {
                    gym: { select: { publicId: true } }
                }
            });

            if (!trainer || !trainer.gym) {
                throw new AppError(404, "Eğitmenin bağlı olduğu bir salon bulunamadı.");
            }

            targetGymPublicId = trainer.gym.publicId;
        }

        logger.info(`Fetching members with status '${status}' for trainer ID: ${trainerId} in gym publicId: ${targetGymPublicId}`);

        const members = await prisma.member.findMany({
            where: {
                trainerId: status === 'UNASSIGNED' ? null : trainerId,
                gym: { publicId: targetGymPublicId },
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

        logger.info(`Successfully fetched ${members.length} members with status '${status}' for trainer ID: ${trainerId}`);
        return members;
    }

    // GET MEMBER'S DETAILED DATA 
    async getMemberDetail(trainerId: number, memberPublicId: string) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        logger.info(`Fetching detailed data for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);

        const member = await prisma.member.findFirst({
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
                programs: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    select: {
                        id: true,
                        title: true,
                        splitType: true,
                        isActive: true,
                        createdAt: true
                    }
                },
                sessions: {
                    orderBy: { checkIn: 'desc' },
                    take: 10,
                    select: {
                        id: true,
                        checkIn: true,
                        checkOut: true
                    }
                }
            }
        });

        if (!member) {
            logger.warn(`Member detail fetch failed: Member not found or not assigned with publicId: ${memberPublicId} for trainer ID: ${trainerId}`);
            throw new AppError(404, "Üye bulunamadı veya bu üyeye erişim yetkiniz yok.");
        }

        logger.info(`Successfully fetched details for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
        return member;
    }
    // ADD MEASUREMENTS TO MEMBERS
    async addMemberMeasurement(
        trainerId: number,
        memberPublicId: string,
        dto: CreateMeasurementType
    ) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        logger.info(`Trainer ID ${trainerId} attempting to add measurement for member publicId: ${memberPublicId}`);

        const member = await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED'
            },
            select: { id: true }
        });

        if (!member) {
            logger.warn(`Add measurement failed: Member not found or unauthorized for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            throw new AppError(404, "Üye bulunamadı veya bu üyeye ölçüm ekleme yetkiniz yok.");
        }

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

        const measurement = await prisma.memberMeasurement.create({
            data: {
                memberId: member.id,
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

        logger.info(`Measurement successfully added with ID: ${measurement.id} for member ID: ${member.id}`);
        return measurement;
    }

    // GET MEASUREMENTS FROM MEMBERS
    async getMemberMeasurements(trainerId: number, memberPublicId: string) {
        logger.info(`Fetching measurements for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
        const member = await prisma.member.findFirst({
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

        if (!member) {
            logger.warn(`Get measurements failed: Member not found or unauthorized for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            throw new Error("Member not found or you do not have access to this member's measurements.");
        }

        logger.info(`Successfully fetched ${member.measurements.length} measurements for member ID: ${member.id}`);
        return member.measurements;
    }
    // DELETE MEMBER'S MEASUREMENT BY PUBLIC ID
    async deleteMemberMeasurement(trainerId: number, memberPublicId: string, measurementPublicId: string) {
        logger.info(`Trainer ID ${trainerId} attempting to delete measurement publicId: ${measurementPublicId} for member publicId: ${memberPublicId}`);
        const member = await prisma.member.findFirst({
            where: {
                publicId: memberPublicId,
                trainerId: trainerId,
                assignmentStatus: 'ASSIGNED'
            },
            select: { id: true }
        });

        if (!member) {
            logger.warn(`Delete measurement failed: Member not found or unauthorized for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            throw new Error("Member not found or you do not have permission to modify this member's measurements.");
        }

        const measurement = await prisma.memberMeasurement.findFirst({
            where: {
                publicId: measurementPublicId,
                memberId: member.id
            }
        });

        if (!measurement) {
            logger.warn(`Delete measurement failed: Measurement record not found with publicId: ${measurementPublicId}`);
            throw new Error("Measurement record not found.");
        }

        const deletedMeasurement = await prisma.memberMeasurement.delete({
            where: {
                publicId: measurementPublicId
            }
        });

        logger.info(`Measurement successfully deleted with publicId: ${measurementPublicId}`);
        return deletedMeasurement;
    }

    // COMPLETE TRAINER PROFILE SERVICE
    async completeTrainerProfileService(
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
        logger.info(`Attempting to complete profile for trainer ID: ${trainerId}`);

        const existingTrainer = await prisma.trainer.findUnique({
            where: { id: trainerId },
        });

        if (!existingTrainer) {
            logger.warn(`Trainer profile completion failed: Trainer not found with ID: ${trainerId}`);
            throw new Error("Trainer not found");
        }

        const updatedTrainer = await prisma.trainer.update({
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

        logger.info(`Successfully completed profile for trainer ID: ${trainerId}`);
        return updatedTrainer;
    }

    // GET TRAINER'S DETAILED PROFILE DATA BY ID 
    async getTrainerProfileWithGym(trainerId: number) {
        const trainer = await prisma.trainer.findUnique({
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

        if (!trainer) {
            throw new Error("Trainer not found.");
        }

        return trainer;
    }



    // UPDATE TRAINER PROFILE SERVICE
    async updateTrainerProfileService(
        trainerId: number,
        data: UpdateTrainerProfileData
    ) {
        logger.info(`Attempting to update profile for trainer ID: ${trainerId}`);

        const existingTrainer = await prisma.trainer.findUnique({
            where: { id: trainerId },
        });

        if (!existingTrainer) {
            logger.warn(`Trainer profile update failed: Trainer not found with ID: ${trainerId}`);
            throw new Error("Trainer not found");
        }

        const updatedTrainer = await prisma.trainer.update({
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

        logger.info(`Successfully updated profile for trainer ID: ${trainerId}`);
        return updatedTrainer;
    }
}