import { Response, NextFunction } from 'express';
import { AuthRequest } from "../../middleware/auth.middleware";
import { analyzeMemberPerformanceService } from '../../ai/ai.service';
import { logger } from "../../config/logger";

export const analyzeMemberHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const trainerId = req.user?.id;
        logger.info(`Trainer ID ${trainerId} attempting to analyze member performance`);

        if (!trainerId) {
            logger.warn("Analyze member performance failed: Unauthorized access, missing trainer ID");
            return res.status(401).json({ success: false, message: "Unauthorized access." });
        }

        const memberPublicId = req.params.memberPublicId as string;

        if (!memberPublicId) {
            logger.warn(`Analyze member performance failed: Member ID is required for trainer ID: ${trainerId}`);
            return res.status(400).json({ success: false, message: "Üye ID gereklidir." });
        }

        logger.info(`Trainer ID ${trainerId} generating AI analysis for member publicId: ${memberPublicId}`);

        const analysis = await analyzeMemberPerformanceService(memberPublicId);

        logger.info(`AI analysis successfully generated for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
        return res.status(200).json({
            success: true,
            data: {
                analysis,
            },
        });
    } catch (error) {
        logger.error("Error in analyzeMemberHandler controller", { error: error instanceof Error ? error.message : error });
        next(error);
    }
};