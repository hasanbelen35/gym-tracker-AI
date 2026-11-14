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
    workoutLogRepository,
} from "../repository/trainer.repository";
import { getOrCalculateTrainerPerformance } from "./ai/TrainerMemberPerformanceService";

// NORMALIZE PAGINATION INPUT TO SAFE VALUES
const normalizePagination = (page?: number, limit?: number) => {
    const safePage = Math.min(10000, Math.max(1, Math.floor(Number(page)) || 1));
    const safeLimit = Math.min(50, Math.max(1, Math.floor(Number(limit)) || 10));
    return { page: safePage, limit: safeLimit };
};

export class TrainerService {

    // SEND ASSIGNMENT REQ TO GYM FOR MEMBER
    async requestMemberAssignment(memberPublicId: string, trainerId: number, gymPublicId?: string) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        const trainer = await trainerGymRepo.findGymByTrainerId(trainerId);

        if (!trainer || !trainer.gym) {
            throw new AppError(404, "Eğitmenin bağlı olduğu bir salon bulunamadı.");
        }

        if (gymPublicId && typeof gymPublicId === "string" && gymPublicId.trim() !== "" && gymPublicId !== trainer.gym.publicId) {
            logger.warn(`Request assignment blocked: Trainer ID ${trainerId} tried to access foreign gym publicId: ${gymPublicId}`);
            throw new AppError(403, "Bu salon üzerinde işlem yapma yetkiniz yok.");
        }

        const targetGymPublicId = trainer.gym.publicId;

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

        const updatedMember = await trainerMemberRepo.setPendingAssignment(member.id, trainerId, targetGymPublicId);

        if (!updatedMember) {
            logger.warn(`Request assignment failed: Member state changed during request for publicId: ${memberPublicId}`);
            throw new AppError(409, "Üyenin durumu değişti. Lütfen listeyi yenileyip tekrar deneyin.");
        }

        logger.info(`Assignment request successfully sent for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
        return updatedMember;
    }

    // CANCEL ASSIGNMENT REQ FROM GYM FOR MEMBER
    async cancelMyAssignmentRequest(memberPublicId: string, trainerId: number, gymPublicId?: string) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        const trainer = await trainerGymRepo.findGymByTrainerId(trainerId);

        if (!trainer || !trainer.gym) {
            throw new AppError(404, "Eğitmenin bağlı olduğu bir salon bulunamadı.");
        }

        if (gymPublicId && typeof gymPublicId === "string" && gymPublicId.trim() !== "" && gymPublicId !== trainer.gym.publicId) {
            logger.warn(`Cancel assignment blocked: Trainer ID ${trainerId} tried to access foreign gym publicId: ${gymPublicId}`);
            throw new AppError(403, "Bu salon üzerinde işlem yapma yetkiniz yok.");
        }

        const targetGymPublicId = trainer.gym.publicId;

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

        const updatedMember = await trainerMemberRepo.clearAssignment(member.id, trainerId);

        if (!updatedMember) {
            logger.warn(`Cancel assignment failed: Member state changed during request for publicId: ${memberPublicId}`);
            throw new AppError(409, "Üyenin durumu değişti. Lütfen listeyi yenileyip tekrar deneyin.");
        }

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

        const trainer = await trainerGymRepo.findGymByTrainerId(trainerId);

        if (!trainer || !trainer.gym) {
            throw new AppError(404, "Eğitmenin bağlı olduğu bir salon bulunamadı.");
        }

        if (gymPublicId && typeof gymPublicId === "string" && gymPublicId.trim() !== "" && gymPublicId !== trainer.gym.publicId) {
            logger.warn(`Members list blocked: Trainer ID ${trainerId} tried to access foreign gym publicId: ${gymPublicId}`);
            throw new AppError(403, "Bu salon üzerinde işlem yapma yetkiniz yok.");
        }

        const targetGymPublicId = trainer.gym.publicId;

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

        const safe = normalizePagination(page, limit);

        const member = await trainerMemberRepo.findAssignedIdByPublicId(trainerId, memberPublicId);
        if (!member) {
            throw new AppError(404, "Üye bulunamadı veya bu üyeye erişim yetkiniz yok.");
        }

        logger.info(`Fetching paginated measurements for member publicId: ${memberPublicId} (Page: ${safe.page}, Limit: ${safe.limit})`);

        return await trainerMemberRepo.findMemberMeasurements(trainerId, memberPublicId, safe.page, safe.limit);
    }

    // GET MEMBER'S SESSIONS DATA PAGINATED
    async getMemberSessionsPaginated(trainerId: number, memberPublicId: string, page: number = 1, limit: number = 10) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        const safe = normalizePagination(page, limit);

        const member = await trainerMemberRepo.findAssignedIdByPublicId(trainerId, memberPublicId);
        if (!member) {
            throw new AppError(404, "Üye bulunamadı veya bu üyeye erişim yetkiniz yok.");
        }

        logger.info(`Fetching paginated sessions for member publicId: ${memberPublicId} (Page: ${safe.page}, Limit: ${safe.limit})`);

        return await trainerMemberRepo.findMemberSessions(trainerId, memberPublicId, safe.page, safe.limit);
    }

    // GET MEMBER'S PROGRAMS DATA PAGINATED
    async getMemberProgramsPaginated(trainerId: number, memberPublicId: string, page: number = 1, limit: number = 10) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        const safe = normalizePagination(page, limit);

        const member = await trainerMemberRepo.findAssignedIdByPublicId(trainerId, memberPublicId);
        if (!member) {
            throw new AppError(404, "Üye bulunamadı veya bu üyeye erişim yetkiniz yok.");
        }

        logger.info(`Fetching paginated programs for member publicId: ${memberPublicId} (Page: ${safe.page}, Limit: ${safe.limit})`);

        return await trainerMemberRepo.findMemberPrograms(trainerId, memberPublicId, safe.page, safe.limit);
    }

    // GET MEMBER'S WORKOUT LOGS DATA PAGINATED
    async getMemberWorkoutLogsPaginated(trainerId: number, memberPublicId: string, page: number = 1, limit: number = 10) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        const safe = normalizePagination(page, limit);
        const skip = (safe.page - 1) * safe.limit;

        const isAssigned = await workoutLogRepository.isMemberAssignedToTrainer(memberPublicId, trainerId);
        if (!isAssigned) {
            logger.warn(`Workout logs access failed: Member publicId ${memberPublicId} is not assigned to trainer ID ${trainerId}`);
            throw new AppError(404, "Üye bulunamadı veya bu üyenin antrenman geçmişine erişim yetkiniz yok.");
        }

        logger.info(`Fetching paginated workout logs for member publicId: ${memberPublicId} by trainer ID: ${trainerId} (Page: ${safe.page}, Limit: ${safe.limit})`);

        const [workoutLogs, totalCount] = await Promise.all([
            workoutLogRepository.findMemberWorkoutLogsPaginated(trainerId, memberPublicId, skip, safe.limit),
            workoutLogRepository.countMemberWorkoutLogs(trainerId, memberPublicId)
        ]);

        return {
            data: workoutLogs,
            pagination: {
                page: safe.page,
                limit: safe.limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / safe.limit)
            }
        };
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
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        logger.info(`Fetching measurements for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);

        const member = await trainerMemberRepo.findAssignedWithMeasurements(trainerId, memberPublicId);

        if (!member) {
            logger.warn(`Get measurements failed: Member not found or unauthorized for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            throw new AppError(404, "Üye bulunamadı veya bu üyenin ölçümlerine erişim yetkiniz yok.");
        }

        logger.info(`Successfully fetched ${member.measurements.length} measurements for member ID: ${member.id}`);
        return member.measurements;
    }

    // DELETE MEMBER'S MEASUREMENT BY PUBLIC ID
    async deleteMemberMeasurement(trainerId: number, memberPublicId: string, measurementPublicId: string) {
        AppError.assertTrainerId(trainerId);
        AppError.assertMemberPublicId(memberPublicId);

        logger.info(`Trainer ID ${trainerId} attempting to delete measurement publicId: ${measurementPublicId} for member publicId: ${memberPublicId}`);

        const member = await trainerMemberRepo.findAssignedIdByPublicId(trainerId, memberPublicId);

        if (!member) {
            logger.warn(`Delete measurement failed: Member not found or unauthorized for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            throw new AppError(404, "Üye bulunamadı veya bu üyenin ölçümlerini silme yetkiniz yok.");
        }

        const measurement = await trainerMeasurementRepo.findByPublicId(trainerId, memberPublicId, measurementPublicId);

        if (!measurement) {
            logger.warn(`Delete measurement failed: Measurement record not found with publicId: ${measurementPublicId}`);
            throw new AppError(404, "Ölçüm kaydı bulunamadı.");
        }

        const result = await trainerMeasurementRepo.deleteByPublicId(trainerId, memberPublicId, measurementPublicId);

        if (result.count === 0) {
            throw new AppError(404, "Ölçüm kaydı bulunamadı.");
        }

        logger.info(`Measurement successfully deleted with publicId: ${measurementPublicId}`);
        return measurement;
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
        AppError.assertTrainerId(trainerId);

        logger.info(`Attempting to complete profile for trainer ID: ${trainerId}`);

        const existingTrainer = await trainerProfileRepo.findById(trainerId);

        if (!existingTrainer) {
            logger.warn(`Trainer profile completion failed: Trainer not found with ID: ${trainerId}`);
            throw new AppError(404, "Eğitmen bulunamadı.");
        }

        const updatedTrainer = await trainerProfileRepo.completeProfile(trainerId, data);

        logger.info(`Successfully completed profile for trainer ID: ${trainerId}`);
        return updatedTrainer;
    }

    // GET TRAINER'S DETAILED PROFILE DATA BY ID
    async getTrainerProfileWithGym(trainerId: number) {
        AppError.assertTrainerId(trainerId);

        const trainer = await trainerProfileRepo.findProfileWithGym(trainerId);

        if (!trainer) {
            throw new AppError(404, "Eğitmen bulunamadı.");
        }

        return trainer;
    }

    // UPDATE TRAINER PROFILE SERVICE
    async updateTrainerProfileService(
        trainerId: number,
        data: UpdateTrainerProfileData
    ) {
        AppError.assertTrainerId(trainerId);

        logger.info(`Attempting to update profile for trainer ID: ${trainerId}`);

        const existingTrainer = await trainerProfileRepo.findById(trainerId);

        if (!existingTrainer) {
            logger.warn(`Trainer profile update failed: Trainer not found with ID: ${trainerId}`);
            throw new AppError(404, "Eğitmen bulunamadı.");
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

        const activatedProgram = await trainerProgramRepo.activate(trainerId, programPublicId);

        if (!activatedProgram) {
            logger.warn(`Activate program failed: Program ${programPublicId} not found or unauthorized for trainer ID: ${trainerId}`);
            throw new AppError(404, "Program bulunamadı veya bu programı aktifleştirme yetkiniz yok.");
        }

        logger.info(`Successfully activated program ${programPublicId} by trainer ID: ${trainerId}`);
        return activatedProgram;
    }

    // FETCH CACHE DATA FROM DB MEMBER GROPİNG ANALYZE SERVICE
    async getGroupedMemberCacheService(trainerId: number) {
        AppError.assertTrainerId(trainerId);

        logger.info(`Trainer ID: ${trainerId} requesting member performance dashboard`);

        const data = await getOrCalculateTrainerPerformance(trainerId);

        logger.info(`Performance dashboard served for trainer ID: ${trainerId} (source: ${data.source})`);
        
        return data;
    }
}