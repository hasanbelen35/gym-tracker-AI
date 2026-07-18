import { Router } from "express";
import { GymController } from '../controllers/gym.controller';
import { authenticate, authorizeGym } from "../middleware/auth.middleware";

const router = Router();
const gym = new GymController();

router.get("/getAllGym", (req, res, next) => gym.getAllGymController(req, res, next));
router.get("/getAllMembers", authenticate, authorizeGym, (req, res, next) => gym.getAllMembersController(req, res, next));
router.get("/getAllTrainers", authenticate, authorizeGym, (req, res, next) => gym.getAllTrainersController(req, res, next));

router.delete("/deleteMemberFromGym/:memberId", authenticate, authorizeGym, (req, res, next) => gym.removeMemberFromGymController(req, res, next));
router.delete("/deleteTrainerFromGym/:trainerId", authenticate, authorizeGym, (req, res, next) => gym.removeTrainerFromGymController(req, res, next));

export default router;
