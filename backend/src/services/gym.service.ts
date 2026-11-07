import { logger } from "../config/logger";
import { AppError } from "../middleware/errorMiddleware";
import { gymRepo, memberListRepo, memberDetailRepo, trainerRepo } from "../repository/gym.repository";

export class GymService {

    async getAllGymData() {
        logger.info("Fetching all gyms data");
        const gyms = await gymRepo.findAllGyms();
        logger.info(`Successfully fetched ${gyms.length} gyms`);
        return gyms;
    }

    // GET ALL MEMBERS ASSIGNED TO GYM PAGINATED SERVICE 
    async getAllMembers(gymId: number, page: number = 1, limit: number = 10) {
        AppError.assertGym(gymId);

        logger.info(`Fetching members for gym ${gymId} (Page: ${page}, Limit: ${limit})`);

        const skip = (page - 1) * limit;
        const [members, totalCount] = await memberListRepo.findPaginated(gymId, skip, limit);

        logger.info(`Successfully fetched ${members.length} members for gym ${gymId}`);

        return {
            data: members,
            pagination: {
                total: totalCount,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalCount / limit),
            }
        };
    }
    // REMOVE MEMBER FROM GYM
    async removeMemberFromGym(gymId: number, memberPublicId: string) {
        AppError.assertGym(gymId);
        AppError.assertMemberPublicId(memberPublicId);

        logger.info(`Attempting to remove member with publicId: ${memberPublicId} from gymId: ${gymId}`);

        const member = await memberDetailRepo.findByPublicId(gymId, memberPublicId);
        if (!member) {
            logger.warn(`Member removal failed: Member not found with publicId: ${memberPublicId} in gymId: ${gymId}`);
            throw new AppError(404, 'Aradığınız kullanıcı sistemde bulunamadı.');
        }

        const deletedMember = await memberDetailRepo.deleteWithRelations(member.id);
        logger.info(`Member successfully removed with ID: ${member.id} from gymId: ${gymId}`);
        return deletedMember;
    }

    // GET MEMBER'S PROFLE DATA
    async getMemberProfile(gymId: number, memberPublicId: string) {
        AppError.assertGym(gymId);
        AppError.assertMemberPublicId(memberPublicId);

        logger.info(`Fetching profile details for member publicId: ${memberPublicId} in gymId: ${gymId}`);

        const member = await memberDetailRepo.findWithRelations(gymId, memberPublicId);

        if (!member) {
            logger.warn(`Member not found: ${memberPublicId} in gym ${gymId}`);
            throw new AppError(404, "Aradığınız kullanıcı sistemde bulunamadı.");
        }

        logger.info(`Successfully fetched profile details for member publicId: ${memberPublicId}`);
        return member;
    }

    // GET MEMBER'S MEASUREMENTS DATA PAGINATED
    async getMemberMeasurements(gymId: number, memberPublicId: string, page: number = 1, limit: number = 10) {
        AppError.assertGym(gymId);
        AppError.assertMemberPublicId(memberPublicId);

        // Önce üyenin varlığını ve yetkisini doğrula
        const member = await memberDetailRepo.findByPublicId(gymId, memberPublicId);
        if (!member) {
            throw new AppError(404, "Aradığınız kullanıcı sistemde bulunamadı.");
        }

        logger.info(`Fetching paginated measurements for member ID: ${member.id} (Page: ${page}, Limit: ${limit})`);

        return await memberDetailRepo.findMeasurementsPaginated(member.id, page, limit);
    }

    // GET MEMBER'S SESSIONS DATA PAGINATED
    async getMemberSessions(gymId: number, memberPublicId: string, page: number = 1, limit: number = 10) {
        AppError.assertGym(gymId);
        AppError.assertMemberPublicId(memberPublicId);

        const member = await memberDetailRepo.findByPublicId(gymId, memberPublicId);
        if (!member) {
            throw new AppError(404, "Aradığınız kullanıcı sistemde bulunamadı.");
        }

        logger.info(`Fetching paginated sessions for member ID: ${member.id} (Page: ${page}, Limit: ${limit})`);

        return await memberDetailRepo.findSessionsPaginated(member.id, page, limit);
    }

    // GET MEMBER'S PROGRAMS DATA PAGINATED
    async getMemberPrograms(gymId: number, memberPublicId: string, page: number = 1, limit: number = 10) {
        AppError.assertGym(gymId);
        AppError.assertMemberPublicId(memberPublicId);

        const member = await memberDetailRepo.findByPublicId(gymId, memberPublicId);
        if (!member) {
            throw new AppError(404, "Aradığınız kullanıcı sistemde bulunamadı.");
        }

        logger.info(`Fetching paginated programs for member ID: ${member.id} (Page: ${page}, Limit: ${limit})`);

        return await memberDetailRepo.findProgramsPaginated(member.id, page, limit);
    }

    //  GET ALL TRAINER  FROM GYM
    async getAllTrainers(gymId: number) {
        AppError.assertGym(gymId);

        logger.info(`Fetching all trainers for gymId: ${gymId}`);
        const trainers = await trainerRepo.findAll(gymId);

        logger.info(`Successfully fetched ${trainers.length} trainers for gymId: ${gymId}`);
        return trainers;
    }

    // REMOVE TRAINER FROM GYM
    async removeTrainerFromGym(gymId: number, trainerPublicId: string) {
        AppError.assertGym(gymId);
        AppError.assertTrainerPublicId(trainerPublicId);

        logger.info(`Attempting to remove trainer with publicId: ${trainerPublicId} from gymId: ${gymId}`);

        const trainer = await trainerRepo.findByPublicId(gymId, trainerPublicId);
        if (!trainer) {
            logger.warn(`Trainer removal failed: Trainer not found with publicId: ${trainerPublicId} in gymId: ${gymId}`);
            throw new AppError(404, "Eğitmen bu salonda bulunamadı.");
        }

        const deletedTrainer = await trainerRepo.deleteWithRelations(trainer.id, gymId);

        logger.info(`Trainer successfully removed with ID: ${trainer.id} from gymId: ${gymId}`);
        return deletedTrainer;
    }

    // GET TRAINER DETAILED DATA 
    async getTrainerDetail(gymId: number, trainerPublicId: string) {
        AppError.assertGym(gymId);
        AppError.assertTrainerPublicId(trainerPublicId);

        logger.info(`Fetching details for trainer publicId: ${trainerPublicId} in gymId: ${gymId}`);

        const trainer = await trainerRepo.findDetailWithRelations(gymId, trainerPublicId);

        if (!trainer) {
            logger.warn(`Trainer detail fetch failed: Trainer not found with publicId: ${trainerPublicId} in gymId: ${gymId}`);
            throw new AppError(404, "Aradığınız eğitmen bu salonda bulunamadı.");
        }

        logger.info(`Successfully fetched details for trainer ID: ${trainer.id}`);
        return trainer;
    }

    // APPROVE MEMBER ASSIGNMENT TO TRAINER 
    async approveMemberAssignment(memberPublicId: string, gymId: number) {
        AppError.assertGym(gymId);
        AppError.assertMemberPublicId(memberPublicId);

        logger.info(`Approving member assignment for member publicId: ${memberPublicId} in gymId: ${gymId}`);

        const member = await memberDetailRepo.findByPublicId(gymId, memberPublicId);
        if (!member) {
            logger.warn(`Member assignment approval failed: Member not found with publicId: ${memberPublicId} in gymId: ${gymId}`);
            throw new AppError(404, "Üye bu salonda bulunamadı.");
        }

        if (member.assignmentStatus !== 'PENDING') {
            logger.warn(`Member assignment approval failed: Status is not PENDING (${member.assignmentStatus}) for publicId: ${memberPublicId}`);
            throw new AppError(400, "Sadece onay bekleyen (PENDING) talepler onaylanabilir.");
        }

        const updatedMember = await memberDetailRepo.updateAssignmentStatus(member.id, 'ASSIGNED');

        logger.info(`Member assignment successfully approved for publicId: ${memberPublicId}`);
        return updatedMember;
    }

    // REJECT MEMBER ASSIGNMENT TO TRAINER
    async rejectMemberAssignment(memberPublicId: string, gymId: number) {
        AppError.assertGym(gymId);
        AppError.assertMemberPublicId(memberPublicId);

        logger.info(`Rejecting member assignment for member publicId: ${memberPublicId} in gymId: ${gymId}`);

        const member = await memberDetailRepo.findByPublicId(gymId, memberPublicId);
        if (!member) {
            logger.warn(`Member assignment rejection failed: Member not found with publicId: ${memberPublicId} in gymId: ${gymId}`);
            throw new AppError(404, "Üye bu salonda bulunamadı.");
        }

        if (member.assignmentStatus !== 'PENDING') {
            logger.warn(`Member assignment rejection failed: Status is not PENDING (${member.assignmentStatus}) for publicId: ${memberPublicId}`);
            throw new AppError(400, "Sadece onay bekleyen (PENDING) talepler reddedilebilir.");
        }

        const updatedMember = await memberDetailRepo.updateAssignmentStatus(member.id, 'UNASSIGNED', true);

        logger.info(`Member assignment successfully rejected for publicId: ${memberPublicId}`);
        return updatedMember;
    }

    // GET MEMBER'S BY STATUS 
    async getMembersByStatus(gymId: number, status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED') {
        AppError.assertGym(gymId);

        const validStatuses = ['PENDING', 'ASSIGNED', 'UNASSIGNED'];
        if (!status || !validStatuses.includes(status)) {
            throw new AppError(400, "Geçersiz atama durumu. (PENDING, ASSIGNED veya UNASSIGNED olmalıdır)");
        }

        logger.info(`Fetching members by status: ${status} for gymId: ${gymId}`);

        const members = await memberListRepo.findByStatus(gymId, status);

        logger.info(`Successfully fetched ${members.length} members with status ${status}`);
        return members;
    }
}