import { CreateMeasurementType } from '../types/types';
import { logger } from "../config/logger";
import { Gender } from "@prisma/client";
import { UpdateTrainerProfileData } from "../types/trainer.types";
import { AppError } from "../middleware/errorMiddleware";
import {
    trainerGymRepo,
    trainerMemberRepo,
    trainerMeasurementRepo,
    trainerProfileRepo,
    trainerProgramRepo,
} from "../repository/trainer.repository";

export class TrainerService {

    // SEND ASSIGNMENT REQ TO GYM FOR MEMBER
    async requestMemberAssignment(memberPublicId: string, trainerId: number, gymPublicId?: string) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        let targetGymPublicId = gymPublicId;

        if (!targetGymPublicId || typeof targetGymPublicId !== "string" || targetGymPublicId.trim() === "") {
            const trainer = await trainerGymRepo.findGymByTrainerId(trainerId);

            if (!trainer || !trainer.gym) {
                throw new AppError(404, "Eğitmenin bağlı olduğu bir salon bulunamadı.");
            }

            targetGymPublicId = trainer.gym.publicId;
        }

        logger.info(`Trainer ID ${trainerId} attempting to request assignment for member publicId: ${memberPublicId} in gym publicId: ${targetGymPublicId}`);

        const member = await trainerMemberRepo.findInGymByPublicId(memberPublicId, targetGymPublicId);

        if (!member) {
            logger.warn(`Request member assignment failed: Member not found with publicId: ${memberPublicId} in gym publicId: ${targetGymPublicId}`);
            throw new AppError(404, "Üye belirtilen salonda bulunamadı.");
        }

        if (member.assignmentStatus !== 'UNASSIGNED') {
            logger.warn(`Request assignment failed: Member status is ${member.assignmentStatus} for publicId: ${memberPublicId}`);
            throw new AppError(400, `Bu üye şu anda atama talebi oluşturmaya uygun değil. (Mevcut Durum: ${member.assignmentStatus})`);
        }

        const updatedMember = await trainerMemberRepo.setPendingAssignment(member.id, trainerId);

        logger.info(`Assignment request successfully sent for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
        return updatedMember;
    }

    // CANCEL ASSIGNMENT REQ FROM GYM FOR MEMBER
    async cancelMyAssignmentRequest(memberPublicId: string, trainerId: number, gymPublicId?: string) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        let targetGymPublicId = gymPublicId;

        if (!targetGymPublicId || typeof targetGymPublicId !== "string" || targetGymPublicId.trim() === "") {
            const trainer = await trainerGymRepo.findGymByTrainerId(trainerId);

            if (!trainer || !trainer.gym) {
                throw new AppError(404, "Eğitmenin bağlı olduğu bir salon bulunamadı.");
            }

            targetGymPublicId = trainer.gym.publicId;
        }

        logger.info(`Trainer ID ${trainerId} attempting to cancel assignment request for member publicId: ${memberPublicId} in gym publicId: ${targetGymPublicId}`);

        const member = await trainerMemberRepo.findInGymByPublicId(memberPublicId, targetGymPublicId);

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

        const updatedMember = await trainerMemberRepo.clearAssignment(member.id);

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
            const trainer = await trainerGymRepo.findGymByTrainerId(trainerId);

            if (!trainer || !trainer.gym) {
                throw new AppError(404, "Eğitmenin bağlı olduğu bir salon bulunamadı.");
            }

            targetGymPublicId = trainer.gym.publicId;
        }

        logger.info(`Fetching members with status '${status}' for trainer ID: ${trainerId} in gym publicId: ${targetGymPublicId}`);

        const members = await trainerMemberRepo.findByStatus(trainerId, targetGymPublicId, status);

        logger.info(`Successfully fetched ${members.length} members with status '${status}' for trainer ID: ${trainerId}`);
        return members;
    }
    
    // GET MEMBER'S PROFILE DATA
    async getMemberProfile(trainerId: number, memberPublicId: string) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        logger.info(`Fetching profile details for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);

        const member = await trainerMemberRepo.findAssignedProfile(trainerId, memberPublicId);

        if (!member) {
            logger.warn(`Member not found or not assigned: ${memberPublicId} for trainer ID: ${trainerId}`);
            throw new AppError(404, "Üye bulunamadı veya bu üyeye erişim yetkiniz yok.");
        }

        logger.info(`Successfully fetched profile details for member publicId: ${memberPublicId}`);
        return member;
    }

    // GET MEMBER'S MEASUREMENTS DATA PAGINATED
    async getMemberMeasurementsPaginated(trainerId: number, memberPublicId: string, page: number = 1, limit: number = 10) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        const member = await trainerMemberRepo.findAssignedIdByPublicId(trainerId, memberPublicId);
        if (!member) {
            throw new AppError(404, "Üye bulunamadı veya bu üyeye erişim yetkiniz yok.");
        }

        logger.info(`Fetching paginated measurements for member publicId: ${memberPublicId} (Page: ${page}, Limit: ${limit})`);

        return await trainerMemberRepo.findMemberMeasurements(trainerId, memberPublicId, page, limit);
    }

    // GET MEMBER'S SESSIONS DATA PAGINATED
    async getMemberSessionsPaginated(trainerId: number, memberPublicId: string, page: number = 1, limit: number = 10) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        const member = await trainerMemberRepo.findAssignedIdByPublicId(trainerId, memberPublicId);
        if (!member) {
            throw new AppError(404, "Üye bulunamadı veya bu üyeye erişim yetkiniz yok.");
        }

        logger.info(`Fetching paginated sessions for member publicId: ${memberPublicId} (Page: ${page}, Limit: ${limit})`);

        return await trainerMemberRepo.findMemberSessions(trainerId, memberPublicId, page, limit);
    }

    // GET MEMBER'S PROGRAMS DATA PAGINATED
    async getMemberProgramsPaginated(trainerId: number, memberPublicId: string, page: number = 1, limit: number = 10) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        const member = await trainerMemberRepo.findAssignedIdByPublicId(trainerId, memberPublicId);
        if (!member) {
            throw new AppError(404, "Üye bulunamadı veya bu üyeye erişim yetkiniz yok.");
        }

        logger.info(`Fetching paginated programs for member publicId: ${memberPublicId} (Page: ${page}, Limit: ${limit})`);

        return await trainerMemberRepo.findMemberPrograms(trainerId, memberPublicId, page, limit);
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

        const member = await trainerMemberRepo.findAssignedIdByPublicId(trainerId, memberPublicId);

        if (!member) {
            logger.warn(`Add measurement failed: Member not found or unauthorized for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            throw new AppError(404, "Üye bulunamadı veya bu üyeye ölçüm ekleme yetkiniz yok.");
        }

        const measurement = await trainerMeasurementRepo.create(member.id, dto);

        logger.info(`Measurement successfully added with ID: ${measurement.id} for member ID: ${member.id}`);
        return measurement;
    }

    // GET MEASUREMENTS FROM MEMBERS
    async getMemberMeasurements(trainerId: number, memberPublicId: string) {
        logger.info(`Fetching measurements for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);

        const member = await trainerMemberRepo.findAssignedWithMeasurements(trainerId, memberPublicId);

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

        const member = await trainerMemberRepo.findAssignedIdByPublicId(trainerId, memberPublicId);

        if (!member) {
            logger.warn(`Delete measurement failed: Member not found or unauthorized for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            throw new Error("Member not found or you do not have permission to modify this member's measurements.");
        }

        const measurement = await trainerMeasurementRepo.findByPublicId(member.id, measurementPublicId);

        if (!measurement) {
            logger.warn(`Delete measurement failed: Measurement record not found with publicId: ${measurementPublicId}`);
            throw new Error("Measurement record not found.");
        }

        const deletedMeasurement = await trainerMeasurementRepo.deleteByPublicId(measurementPublicId);

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

        const existingTrainer = await trainerProfileRepo.findById(trainerId);

        if (!existingTrainer) {
            logger.warn(`Trainer profile completion failed: Trainer not found with ID: ${trainerId}`);
            throw new Error("Trainer not found");
        }

        const updatedTrainer = await trainerProfileRepo.completeProfile(trainerId, data);

        logger.info(`Successfully completed profile for trainer ID: ${trainerId}`);
        return updatedTrainer;
    }

    // GET TRAINER'S DETAILED PROFILE DATA BY ID 
    async getTrainerProfileWithGym(trainerId: number) {
        const trainer = await trainerProfileRepo.findProfileWithGym(trainerId);

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

        const existingTrainer = await trainerProfileRepo.findById(trainerId);

        if (!existingTrainer) {
            logger.warn(`Trainer profile update failed: Trainer not found with ID: ${trainerId}`);
            throw new Error("Trainer not found");
        }

        const updatedTrainer = await trainerProfileRepo.updateProfile(trainerId, data);

        logger.info(`Successfully updated profile for trainer ID: ${trainerId}`);
        return updatedTrainer;
    }

    // ACTIVATE ARCHIVED MEMBER PROGRAM
    async activateProgramService(trainerId: number, programPublicId: string) {
        AppError.assertTrainerId(trainerId);
        AppError.assertProgramPublicId(programPublicId);

        logger.info(`Trainer ID: ${trainerId} attempting to activate program ${programPublicId}`);

        const targetProgram = await trainerProgramRepo.findAssignedMemberProgram(trainerId, programPublicId);

        if (!targetProgram) {
            throw new AppError(404, "Program bulunamadı.");
        }

        const activatedProgram = await trainerProgramRepo.activate(targetProgram.id);

        logger.info(`Successfully activated program ${programPublicId} by trainer ID: ${trainerId}`);
        return activatedProgram;
    }
}