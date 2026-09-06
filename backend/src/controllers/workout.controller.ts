import { Request, Response, NextFunction } from "express";
import { ExerciseService } from "../services/workout.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { logger } from "../config/logger";

const exerciseService = new ExerciseService();

export class ExerciseController {
    // get all exercises from exercises table wıth query fılter controller
    async getExercisesByQueryController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            logger.info("Fetching exercises by query parameters");
            const query = req.query;

            const exercises = await exerciseService.getExercisesByQuery(query);

            logger.info(`Successfully fetched ${exercises.length} exercises based on query`);
            res.status(200).json({
                success: true,
                count: exercises.length,
                data: exercises,
            });
        } catch (error) {
            logger.error("Error in getExercisesByQueryController", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    }

    // create workout program controller
    async createProgramController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const trainerId = req.user!.id;
            logger.info(`Trainer ID ${trainerId} attempting to create workout program`);

            const { memberPublicId, title, type, splitType, days } = req.body;

            if (!memberPublicId || !title || !days || !Array.isArray(days)) {
                logger.warn(`Create program failed: Missing or invalid fields for trainer ID: ${trainerId}`);
                return res.status(400).json({
                    success: false,
                    error: "Eksik veya geçersiz alanlar girdiniz."
                });
            }

            logger.info(`Trainer ID ${trainerId} creating program '${title}' for member publicId: ${memberPublicId}`);
            const newProgram = await exerciseService.createWorkoutProgram({
                trainerId,
                memberPublicId,
                title,
                type,
                splitType,
                days,
            });

            logger.info(`Workout program successfully created for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            res.status(201).json({
                success: true,
                message: "Antrenman programı başarıyla oluşturuldu.",
                data: newProgram,
            });
        } catch (error) {
            logger.error("Error in createProgramController", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    }

    // DELETE WORKOUT PROGRAM BY USER CONTROLLER
    async deleteProgramController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const trainerId = req.user!.id;
            logger.info(`Trainer ID ${trainerId} attempting to delete workout program`);

            const programPublicId = req.params.programPublicId as string;
            if (!programPublicId) {
                logger.warn(`Delete program failed: Program public ID was not provided for trainer ID: ${trainerId}`);
                return res.status(400).json({
                    success: false,
                    error: "Program public ID was not provided."
                });
            }

            logger.info(`Trainer ID ${trainerId} deleting program publicId: ${programPublicId}`);
            const result = await exerciseService.deleteWorkoutProgram(programPublicId, trainerId);

            logger.info(`Workout program successfully deleted: ${programPublicId} by trainer ID: ${trainerId}`);
            res.status(200).json({
                success: true,
                message: "The program and all associated content have been successfully deleted.",
                data: result,
            });
        } catch (error) {
            logger.error("Error in deleteProgramController", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    }

    // GET WORKOUT PROGRAM DETAIL BY USER CONTROLLER
    async getProgramDetailController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const trainerId = req.user!.id;
            logger.info(`Trainer ID ${trainerId} attempting to fetch workout program detail`);

            const programPublicId = req.params.programPublicId as string;

            if (!programPublicId) {
                logger.warn(`Get program detail failed: Program public ID was not provided for trainer ID: ${trainerId}`);
                return res.status(400).json({
                    success: false,
                    error: "Program public ID was not provided.",
                });
            }

            logger.info(`Trainer ID ${trainerId} fetching detail for program publicId: ${programPublicId}`);
            const result = await exerciseService.getProgramDetail(programPublicId, trainerId);

            logger.info(`Successfully fetched detail for program publicId: ${programPublicId} by trainer ID: ${trainerId}`);
            res.status(200).json(result);
        } catch (error) {
            logger.error("Error in getProgramDetailController", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    }
}