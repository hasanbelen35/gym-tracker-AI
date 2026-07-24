import { Request, Response, NextFunction } from "express";
import { ExerciseService } from "../services/workout.service";

const exerciseService = new ExerciseService();

export class ExerciseController {
 // get all exercises from exercises table wıth query fılter controller
  async getExercisesByQueryController(req: Request, res: Response, next: NextFunction) {
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
    async createProgramController(req: Request, res: Response, next: NextFunction) {
        try {
            const { memberId, trainerId, title, days } = req.body;

            if (!memberId || !trainerId || !title || !days || !Array.isArray(days)) {
                return res.status(400).json({ 
                    success: false, 
                    error: "Eksik veya geçersiz alanlar girdiniz." 
                });
            }

            const newProgram = await exerciseService.createWorkoutProgram(req.body);

            res.status(201).json({
                success: true,
                message: "Antrenman programı başarıyla oluşturuldu.",
                data: newProgram,
            });
        } catch (error) {
            next(error);
        }
    }
}