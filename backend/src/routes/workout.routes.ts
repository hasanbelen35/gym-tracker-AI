import { Router } from "express";
import { ExerciseController } from "../controllers/workout.controller";
import { authenticate, authorizeTrainer } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { getExercisesByQuerySchema } from "../validations/exercise.validation";
const router = Router();
const exerciseController = new ExerciseController();

router.get("/getExercisesByQuery", authenticate, authorizeTrainer, validate(getExercisesByQuerySchema), (req, res, next) => exerciseController.getExercisesByQueryController(req, res, next));

export default router;