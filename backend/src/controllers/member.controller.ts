import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { MemberService } from '../services/member.service';
import { logger } from "../config/logger";

const memberService = new MemberService();

export class MemberController {

    async getMyTrainerDataController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            logger.info(`Member ID ${userId} requesting assigned trainer data`);

            if (!userId) {
                logger.warn("Get trainer data failed: Authorization failed, missing user ID");
                return res.status(401).json({ message: "Authorization failed!" });
            }

            const trainer = await memberService.getAssignedTrainerForMember(userId);

            if (!trainer) {
                logger.warn(`Get trainer data failed: No assigned trainer found for member ID: ${userId}`);
                return res.status(404).json({ message: "Atanmış bir eğitmeniniz bulunmuyor." });
            }

            logger.info(`Successfully fetched assigned trainer data for member ID: ${userId}`);
            return res.status(200).json({
                success: true,
                data: trainer
            });

        } catch (error: any) {
            logger.error("Error in getMyTrainerDataController", { error: error instanceof Error ? error.message : error });
            next(error)
        }
    }

    // UPDATE MEMBER PROFILE CONTROLLER
    async updateProfileController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            logger.info(`Member ID ${userId} attempting to update profile`);

            if (!userId) {
                logger.warn("Update profile failed: Authorization failed, missing user ID");
                return res.status(401).json({ message: "Authorization failed!" });
            }

            const { age, height, weight, gender, medicalNotes, avatarUrl } = req.body;

            const updatedProfile = await memberService.updateMemberProfile(userId, {
                age: age !== undefined && age !== "" ? Number(age) : undefined,
                height: height !== undefined && height !== "" ? Number(height) : undefined,
                weight: weight !== undefined && weight !== "" ? Number(weight) : undefined,
                gender,
                medicalNotes,
                avatarUrl,
            });

            logger.info(`Profile successfully updated for member ID: ${userId}`);
            return res.status(200).json({
                success: true,
                message: "Profile updated succesfully!",
                data: updatedProfile
            });

        } catch (error: any) {
            logger.error("Error in updateProfileController", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    }

    // get current member's data controller
    async getCurrentMemberController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            logger.info(`Fetching current data for member ID: ${userId}`);

            if (!userId) {
                logger.warn("Get current member failed: Authorization failed, missing user ID");
                return res.status(401).json({ message: "Authorization failed!" });
            }

            const member = await memberService.getCurrentMember(userId);

            logger.info(`Successfully fetched current data for member ID: ${userId}`);
            return res.status(200).json({
                success: true,
                data: member
            });

        } catch (error: any) {
            logger.error("Error in getCurrentMemberController", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    }

    // GET MEMBER'S WORKOUT PROGRAM CONTROLLER


    async getMyPrograms(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const memberId = req.user?.id;

            logger.info(`Attempting to fetch programs for member ID: ${memberId}`);

            if (!memberId) {
                logger.warn("Get member programs failed: Authorization failed, missing member ID");
                return res.status(401).json({ success: false, error: "Authorization failed." });
            }

            const programs = await memberService.getMyPrograms(memberId);

            logger.info(`Successfully processed programs request for member ID: ${memberId}`);
            return res.status(200).json({
                success: true,
                data: programs,
            });

        } catch (error: any) {
            logger.error("Error in getMyPrograms controller", {
                error: error instanceof Error ? error.message : error
            });
            return next(error);
        }
    }
}


