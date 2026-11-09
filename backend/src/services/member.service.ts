import { memberRepository } from "../repository/member.repository";
import { CompleteProfileInput } from '../types/types';
import { logger } from "../config/logger";
import { UpdateMemberProfileData } from '../types/member.types';
import { AppError } from "../middleware/errorMiddleware";
import { Prisma } from "@prisma/client";

// NORMALIZE PAGINATION INPUT TO SAFE VALUES
const normalizePagination = (page?: number, limit?: number) => {
    const safePage = Math.min(10000, Math.max(1, Math.floor(Number(page)) || 1));
    const safeLimit = Math.min(50, Math.max(1, Math.floor(Number(limit)) || 10));
    return { page: safePage, limit: safeLimit, skip: (safePage - 1) * safeLimit };
};

export class MemberService {

    // GET ASSIGNED TRAINER OF MEMBER
    async getAssignedTrainerForMember(memberId: number) {
        AppError.assertMemberId(memberId);

        logger.info(`Fetching assigned trainer for member ID: ${memberId}`);

        const member = await memberRepository.findByIdWithTrainer(memberId);

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

    // COMPLETE MEMBER PROFILE (MEMBER + MEMBER PROFILE TRANSACTION)
    async updateMemberProfile(memberId: number, data: CompleteProfileInput) {
        AppError.assertMemberId(memberId);

        logger.info(`Attempting to complete profile for member ID: ${memberId}`);

        const existingMember = await memberRepository.findById(memberId);

        if (!existingMember) {
            logger.warn(`Profile completion failed: Member not found with ID: ${memberId}`);
            throw new AppError(404, "Üye bulunamadı.");
        }

        const memberUpdateData: Prisma.MemberUpdateInput = {
            ...(data.age !== undefined && { age: data.age }),
            ...(data.height !== undefined && { height: data.height }),
            ...(data.weight !== undefined && { weight: data.weight }),
            ...(data.gender !== undefined && { gender: data.gender }),
            ...(data.medicalNotes !== undefined && { medicalNotes: data.medicalNotes }),
            ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        };

        const profileUpdateData: Partial<Omit<Prisma.MemberProfileUncheckedCreateInput, 'memberId'>> = {
            ...(data.goal !== undefined && { goal: data.goal }),
            ...(data.experienceLevel !== undefined && { experienceLevel: data.experienceLevel }),
            ...(data.workoutDaysPerWeek !== undefined && { workoutDaysPerWeek: data.workoutDaysPerWeek }),
            ...(data.sessionDuration !== undefined && { sessionDuration: data.sessionDuration }),
            ...(data.equipmentAccess !== undefined && { equipmentAccess: data.equipmentAccess }),
            ...(data.activityLevel !== undefined && { activityLevel: data.activityLevel }),
            ...(data.additionalNotes !== undefined && { additionalNotes: data.additionalNotes }),
        };

        const updatedMember = await memberRepository.updateMemberWithProfileTransaction(
            memberId,
            memberUpdateData,
            profileUpdateData
        );

        logger.info(`Profile successfully completed for member ID: ${memberId}`);
        return updatedMember;
    }

    // GET CURRENT MEMBER CORE PROFILE DATA
    async getCurrentMember(memberId: number) {
        AppError.assertMemberId(memberId);

        logger.info(`Fetching core profile data for member ID: ${memberId}`);

        const member = await memberRepository.findCurrentMemberCore(memberId);

        if (!member) {
            logger.warn(`Current member fetch failed: Member not found with ID: ${memberId}`);
            throw new AppError(404, "Üye profili bulunamadı.");
        }

        logger.info(`Successfully fetched core profile data for member ID: ${memberId}`);
        return member;
    }

    // GET MEMBER'S SESSIONS DATA PAGINATED
    async getMemberSessions(
        memberId: number,
        options: { page?: number; limit?: number } = {}
    ) {
        AppError.assertMemberId(memberId);

        const { page, limit, skip } = normalizePagination(options.page, options.limit);

        const existingMember = await memberRepository.findById(memberId);
        if (!existingMember) {
            throw new AppError(404, "Üye sistemde bulunamadı.");
        }

        const [sessions, totalCount] = await Promise.all([
            memberRepository.findMemberSessionsPaginated(memberId, skip, limit),
            memberRepository.countMemberSessions(memberId)
        ]);

        return {
            data: sessions,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            },
        };
    }

    // GET MEMBER'S MEASUREMENTS DATA PAGINATED
    async getMemberMeasurements(
        memberId: number,
        options: { page?: number; limit?: number } = {}
    ) {
        AppError.assertMemberId(memberId);

        const { page, limit, skip } = normalizePagination(options.page, options.limit);

        const existingMember = await memberRepository.findById(memberId);
        if (!existingMember) {
            throw new AppError(404, "Üye sistemde bulunamadı.");
        }

        const [measurements, totalCount] = await Promise.all([
            memberRepository.findMemberMeasurementsPaginated(memberId, skip, limit),
            memberRepository.countMemberMeasurements(memberId)
        ]);

        return {
            data: measurements,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            },
        };
    }

    // GET MEMBER'S PROGRAMS DATA PAGINATED (OPTIONAL ACTIVE FILTER)
    async getMemberPrograms(
        memberId: number,
        options: { onlyActive?: boolean; page?: number; limit?: number } = {}
    ) {
        AppError.assertMemberId(memberId);

        const onlyActive = options.onlyActive ?? false;
        const { page, limit, skip } = normalizePagination(options.page, options.limit);

        const existingMember = await memberRepository.findById(memberId);
        if (!existingMember) {
            throw new AppError(404, "Üye sistemde bulunamadı.");
        }

        const whereCondition: Prisma.ProgramWhereInput = {
            memberId,
            ...(onlyActive && { isActive: true }),
        };

        const [programs, totalCount] = await Promise.all([
            memberRepository.findProgramsPaginated(whereCondition, skip, limit),
            memberRepository.countPrograms(whereCondition)
        ]);

        return {
            data: programs,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            },
        };
    }

    // UPDATE MEMBER PROFILE FIELDS
    async updateMemberProfileService(
        memberId: number,
        data: UpdateMemberProfileData
    ) {
        AppError.assertMemberId(memberId);

        logger.info(`Attempting to update profile fields for member ID: ${memberId}`);

        const existingMember = await memberRepository.findById(memberId);

        if (!existingMember) {
            logger.warn(`Member profile update failed: Member not found with ID: ${memberId}`);
            throw new AppError(404, "Üye bulunamadı.");
        }

        const updateData: Prisma.MemberUpdateInput = {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.surname !== undefined && { surname: data.surname }),
            ...(data.gender !== undefined && { gender: data.gender }),
            ...(data.phone !== undefined && { phone: data.phone }),
            ...(data.age !== undefined && { age: data.age }),
            ...(data.height !== undefined && { height: data.height }),
            ...(data.weight !== undefined && { weight: data.weight }),
            ...(data.medicalNotes !== undefined && { medicalNotes: data.medicalNotes }),
        };

        const selectFields: Prisma.MemberSelect = {
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
        };

        const updatedMember = await memberRepository.updateMember(memberId, updateData, selectFields);

        logger.info(`Successfully updated profile fields for member ID: ${memberId}`);
        return updatedMember;
    }
}