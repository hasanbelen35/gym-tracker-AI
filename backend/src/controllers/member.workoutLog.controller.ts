import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { WorkoutLogService, FinishWorkoutInput } from "../services/member.workout.log.service";
import { logger } from "../config/logger";

const workoutLogService = new WorkoutLogService();

export class WorkoutLogController {

    // check active session
    async getActiveSession(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const memberId = req.user?.id;
            logger.info(`Member ID ${memberId} requesting active workout session`);

            const session = await workoutLogService.getActiveSession(memberId!);

            logger.info(`Successfully fetched active workout session for member ID: ${memberId}`);
            return res.status(200).json({ success: true, data: session });
        } catch (error) {
            logger.error("Error in getActiveSession controller", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    }

    //start session to today's day name 
    async startSession(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const memberId = req.user?.id;
            logger.info(`Member ID ${memberId} attempting to start a new workout session`);

            const session = await workoutLogService.startWorkoutSession(memberId!);

            logger.info(`Successfully started workout session for member ID: ${memberId}`);
            return res.status(201).json({
                success: true,
                message: "Antrenman oturumu başarıyla başlatıldı.",
                data: session
            });
        } catch (error) {
            logger.error("Error in startSession controller", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    }

    // collect data from states and wrıte db each of them
    async finishSession(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const memberId = req.user?.id;
            const body: FinishWorkoutInput = req.body;

            logger.info(`Member ID ${memberId} attempting to finish workout session ID ${body.workoutLogId} with bulk payload`);

            const finishedSession = await workoutLogService.finishWorkoutSession(memberId!, body);

            logger.info(`Successfully completed workout session ID ${body.workoutLogId} for member ID: ${memberId}`);
            return res.status(200).json({
                success: true,
                message: "Harika iş! Antrenman tamamlandı.",
                data: finishedSession
            });
        } catch (error) {
            logger.error("Error in finishSession controller", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    }
}