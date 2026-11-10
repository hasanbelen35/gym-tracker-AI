import { Router } from "express";
import { WorkoutLogController } from "../controllers/member.workoutLog.controller";
import { authenticate, authorizeMember } from "../middleware/auth.middleware";

const router = Router();
const workoutLogController = new WorkoutLogController();

// GET ACTIVE WORKOUT SESSION 
router.get(
    "/active",
    authenticate,
    authorizeMember,
    (req, res, next) => workoutLogController.getActiveSession(req, res, next)
);

// CHECK IF A SPECIFIC DAY IS COMPLETED TODAY 
router.get(
    "/check-day/:workoutDayId",
    authenticate,
    authorizeMember,
    (req, res, next) => workoutLogController.checkDayCompletedToday(req, res, next)
);

// START WORKOUT SESSION 
router.post(
    "/start",
    authenticate,
    authorizeMember,
    (req, res, next) => workoutLogController.startSession(req, res, next)
);

// FINISH WORKOUT SESSION 
router.post(
    "/finish",
    authenticate,
    authorizeMember,
    (req, res, next) => workoutLogController.finishSession(req, res, next)
);

export default router;