import { Request, Response, NextFunction } from "express";
import { ExerciseService } from "../services/workout.service";
import { AuthRequest } from "../middleware/auth.middleware";

const exerciseService = new ExerciseService();

export class ExerciseController {
    // get all exercises from exercises table wıth query fılter controller
    async getExercisesByQueryController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const query = req.query;

            const exercises = await exerciseService.getExercisesByQuery(query);

            res.status(200).json({
                success: true,
                count: exercises.length,
                data: exercises,
            });
        } catch (error) {
            next(error);
        }
    }

    // create workout program controller
    async createProgramController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const trainerId = req.user!.id;
            const { memberPublicId, title, type, splitType, days } = req.body;

            if (!memberPublicId || !title || !days || !Array.isArray(days)) {
                return res.status(400).json({
                    success: false,
                    error: "Eksik veya geçersiz alanlar girdiniz."
                });
            }

            const newProgram = await exerciseService.createWorkoutProgram({
                trainerId,
                memberPublicId,
                title,
                type,
                splitType,
                days,
            });

            res.status(201).json({
                success: true,
                message: "Antrenman programı başarıyla oluşturuldu.",
                data: newProgram,
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE WORKOUT PROGRAM BY USER CONTROLLER
    async deleteProgramController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const trainerId = req.user!.id;
            const programPublicId = req.params.programPublicId as string;
            if (!programPublicId) {
                return res.status(400).json({
                    success: false,
                    error: "Program public ID was not provided."
                });
            }

            const result = await exerciseService.deleteWorkoutProgram(programPublicId, trainerId);

            res.status(200).json({
                success: true,
                message: "The program and all associated content have been successfully deleted.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET WORKOUT PROGRAM DETAIL BY USER CONTROLLER
    async getProgramDetailController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const trainerId = req.user!.id;
            const programPublicId = req.params.programPublicId as string;

            if (!programPublicId) {
                return res.status(400).json({
                    success: false,
                    error: "Program public ID was not provided.",
                });
            }

            const result = await exerciseService.getProgramDetail(programPublicId, trainerId);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}