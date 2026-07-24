import { Router } from "express";
import { ExerciseController } from "../controllers/workout.controller";
import { authenticate, authorizeTrainer, AuthRequest } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createProgramSchema, getExercisesByQuerySchema } from "../validations/exercise.validation";
import { Response, NextFunction } from "express";

const router = Router();
const exerciseController = new ExerciseController();

router.get(
    "/getExercisesByQuery",
    authenticate,
    authorizeTrainer,
    validate(getExercisesByQuerySchema),
    (req: AuthRequest, res: Response, next: NextFunction) =>
        exerciseController.getExercisesByQueryController(req, res, next)
);

router.post(
    "/create-program",
    authenticate,
    authorizeTrainer,
    validate(createProgramSchema),
    (req: AuthRequest, res: Response, next: NextFunction) =>
        exerciseController.createProgramController(req, res, next)
);

export default router;