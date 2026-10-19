import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { WorkoutLogService, LogSingleSetInput } from "../services/member.workout.log.service";
import { logger } from "../config/logger";

const workoutLogService = new WorkoutLogService();

export class WorkoutLogController {

    // 1. Aktif oturumu sorgula (Dashboard açıldığında kontrol için)
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

    // 2. Bugünün gününe göre otomatik oturum başlat
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

    // 3. Set bazlı anlık loglama (OK, Skip, Modify durumlarında tetiklenir)
    async logSet(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const memberId = req.user?.id;
            const body: LogSingleSetInput = req.body;
            
            logger.info(`Member ID ${memberId} logging set ${body.setNumber} for exerciseLog ID ${body.exerciseLogId}`);

            const updatedSet = await workoutLogService.logSingleSet(memberId!, body);

            logger.info(`Successfully logged set ${body.setNumber} for member ID: ${memberId}`);
            return res.status(200).json({ success: true, data: updatedSet });
        } catch (error) {
            logger.error("Error in logSet controller", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    }

    // 4. Antrenmanı tamamlama (Bitir butonu)
    async finishSession(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const memberId = req.user?.id;
            const { workoutLogId, memberNote } = req.body;

            logger.info(`Member ID ${memberId} attempting to finish workout session ID ${workoutLogId}`);

            const finishedSession = await workoutLogService.finishWorkoutSession(memberId!, Number(workoutLogId), memberNote);

            logger.info(`Successfully completed workout session ID ${workoutLogId} for member ID: ${memberId}`);
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