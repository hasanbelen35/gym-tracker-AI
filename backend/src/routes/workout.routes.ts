import { Router } from "express";
import { ExerciseController } from "../controllers/workout.controller";
import { authenticate, authorizeTrainer } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createProgramSchema, getExercisesByQuerySchema } from "../validations/exercise.validation";

const router = Router();
const exerciseController = new ExerciseController();
// get all exercises from db route
router.get(
    "/getExercisesByQuery",
    authenticate,
    authorizeTrainer,
    validate(getExercisesByQuerySchema),
    (req, res, next) => exerciseController.getExercisesByQueryController(req, res, next)
);
// create workout program route
router.post(
    "/create-program",
    authenticate,
    authorizeTrainer,
    validate(createProgramSchema),
    (req, res, next) => exerciseController.createProgramController(req, res, next)
);
export default router;