import { Request, Response, NextFunction } from "express";
import { ExerciseService } from "../services/workout.service";

const exerciseService = new ExerciseService();

export class ExerciseController {
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
}