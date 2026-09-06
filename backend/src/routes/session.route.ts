import { Router } from "express";
import { SessionController } from "../controllers/session.controller";
import { authenticate, authorizeGym, authorizeMember } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { checkInSchema } from "../validations/session.validation";

const router = Router();
const session = new SessionController();

// Member scans QR and starts workout session
router.post("/checkin", authenticate, authorizeMember, validate(checkInSchema), (req, res, next) => session.checkIn(req, res, next));

// Member scans QR again and ends workout session
router.post("/checkout", authenticate, authorizeMember, (req, res, next) => session.checkOut(req, res, next));

// Member views their own session history
router.get("/my", authenticate, authorizeMember, (req, res, next) => session.getMemberSessions(req, res, next)); 

//----------------------------------------------------------------------------------------------------------------------------------------
/// GYM ///
// Gym owner views all sessions in their gym
router.get("/gym", authenticate, authorizeGym, (req, res, next) => session.getGymSessions(req, res, next));

// Gym owner views members currently working out (NOT CHECKED OUT MEMBERS)
router.get("/gym/active", authenticate, authorizeGym, (req, res, next) => session.getActiveGymSessions(req, res, next));

export default router;