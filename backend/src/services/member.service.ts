// ==========================================
// MEMBER SERVICE
// ==========================================

import { memberRepository } from "../repository/member.repository";
import { CompleteProfileInput } from '../types/types';
import { logger } from "../config/logger";
import { UpdateMemberProfileData } from '../types/member.types';
import { AppError } from "../middleware/errorMiddleware";
import { Prisma } from "@prisma/client";

export class MemberService {
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

    async updateMemberProfile(memberId: number, data: CompleteProfileInput) {
        AppError.assertMemberId(memberId);

        logger.info(`Attempting to update profile for member ID: ${memberId}`);

        const existingMember = await memberRepository.findById(memberId);

        if (!existingMember) {
            logger.warn(`Profile update failed: Member not found with ID: ${memberId}`);
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

        const profileUpdateData: Prisma.MemberProfileUpdateInput = {
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

        logger.info(`Profile successfully updated for member ID: ${memberId}`);
        return updatedMember;
    }

    async getCurrentMember(memberId: number) {
        AppError.assertMemberId(memberId);

        logger.info(`Fetching current profile data for member ID: ${memberId}`);

        const member = await memberRepository.findCurrentMemberWithRelations(memberId);

        if (!member) {
            logger.warn(`Current member fetch failed: Member not found with ID: ${memberId}`);
            throw new AppError(404, "Üye profili bulunamadı.");
        }

        logger.info(`Successfully fetched current profile data for member ID: ${memberId}`);
        
        return member;
    }

    async getMemberPrograms(
        memberId: number,
        options: { onlyActive?: boolean; page?: number; limit?: number } = {}
    ) {
        AppError.assertMemberId(memberId);

        const { onlyActive = false, page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;

        const existingMember = await memberRepository.findById(memberId);

        if (!existingMember) {
            throw new AppError(404, "Üye sistemde bulunamadı.");
        }

        const whereCondition = {
            memberId,
            ...(onlyActive && { isActive: true }),
        };

        const [programs, totalCount] = await Promise.all([
            memberRepository.findProgramsPaginated(
                whereCondition, 
                onlyActive ? -1 : skip, 
                onlyActive ? 0 : limit
            ),
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

    async updateMemberProfileService(
        memberId: number,
        data: UpdateMemberProfileData
    ) {
        AppError.assertMemberId(memberId);

        logger.info(`Attempting to update profile for member ID: ${memberId}`);

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

        logger.info(`Successfully updated profile for member ID: ${memberId}`);
        return updatedMember;
    }
}