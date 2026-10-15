import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { MemberService } from '../services/member.service';
import { logger } from "../config/logger";

const memberService = new MemberService();

export class MemberController {

    // GET MEMBER'S TRAINER DATA BY MEMBER ID CONTROLLER
    async getMyTrainerDataController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            logger.info(`Member ID ${userId} requesting assigned trainer data`);

            const trainerData = await memberService.getAssignedTrainerForMember(userId!);

            logger.info(`Successfully fetched assigned trainer data for member ID: ${userId}`);
            return res.status(200).json({
                success: true,
                data: trainerData
            });
        } catch (error) {
            logger.error("Error in getMyTrainerDataController", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    }
    // UPDATE MEMBER PROFILE CONTROLLER
    async updateProfileController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            logger.info(`Member ID ${userId} attempting to update profile`);

            const { age, height, weight, gender, medicalNotes, avatarUrl } = req.body;

            const parseNumber = (val: any): number | undefined => {
                if (val === undefined || val === null || val === "") return undefined;
                const num = Number(val);
                return isNaN(num) ? undefined : num;
            };

            const updatedProfile = await memberService.updateMemberProfile(userId, {
                age: parseNumber(age),
                height: parseNumber(height),
                weight: parseNumber(weight),
                gender,
                medicalNotes,
                avatarUrl,
            });

            logger.info(`Profile successfully updated for member ID: ${userId}`);
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully!",
                data: updatedProfile
            });

        } catch (error) {
            logger.error("Error in updateProfileController", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    }
    // GET CURRENT MEMBER'S DATA CONTROLLER
    async getCurrentMemberController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            logger.info(`Fetching current data for member ID: ${userId}`);

            const member = await memberService.getCurrentMember(userId);

            logger.info(`Successfully fetched current data for member ID: ${userId}`);
            return res.status(200).json({
                success: true,
                data: member
            });

        } catch (error) {
            logger.error("Error in getCurrentMemberController", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    }

    // GET MEMBER'S WORKOUT PROGRAM CONTROLLER
    async getMyProgramsController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const memberId = req.user!.id;

            logger.info(`Attempting to fetch programs for member ID: ${memberId}`);

            const programs = await memberService.getMemberPrograms(memberId);

            logger.info(`Successfully processed programs request for member ID: ${memberId}`);
            return res.status(200).json({
                success: true,
                data: programs,
            });

        } catch (error) {
            logger.error("Error in getMyProgramsController", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    }

    // UPDATE MEMBER'S PROFILE BY ID  CONTROLLER 
    async updateMemberProfileController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const memberId = req.user!.id;

            logger.info(`Received profile update request for member ID: ${memberId}`);

            const { name, surname, gender, phone, age, height, weight, medicalNotes } = req.body;

            const parseNumber = (val: any): number | undefined => {
                if (val === undefined || val === null || val === "") return undefined;
                const num = Number(val);
                return isNaN(num) ? undefined : num;
            };

            const updatedProfile = await memberService.updateMemberProfileService(memberId, {
                name,
                surname,
                gender,
                phone,
                age: parseNumber(age),
                height: parseNumber(height),
                weight: parseNumber(weight),
                medicalNotes,
            });

            logger.info(`Successfully updated profile response sent for member ID: ${memberId}`);
            return res.status(200).json({
                success: true,
                data: updatedProfile,
            });

        } catch (error) {
            logger.error("Error in updateMemberProfileController", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    }

        // TODO : WILL ADD CONTROLLERS FOR WORKOUT LOGS 

}


