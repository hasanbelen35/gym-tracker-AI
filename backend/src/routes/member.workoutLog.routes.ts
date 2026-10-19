import { Router } from "express";
import { WorkoutLogController } from "../controllers/member.workoutLog.controller";
import { authenticate, authorizeMember } from "../middleware/auth.middleware";


const router = Router();
const workoutLog = new WorkoutLogController();

// GET ACTIVE WORKOUT SESSION 
router.get(
    "/active",
    authenticate,
    authorizeMember,
    (req, res, next) => workoutLog.getActiveSession(req, res, next)
);

// START WORKOUT SESSION 
router.post(
    "/start",
    authenticate,
    authorizeMember,
    (req, res, next) => workoutLog.startSession(req, res, next)
);

// LOG SINGLE SET 
router.post(
    "/set",
    authenticate,
    authorizeMember,
    (req, res, next) => workoutLog.logSet(req, res, next)
);

// FINISH WORKOUT SESSION 
router.post(
    "/finish",
    authenticate,
    authorizeMember,
    (req, res, next) => workoutLog.finishSession(req, res, next)
);

export default router;