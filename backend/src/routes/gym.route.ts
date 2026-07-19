import { Router } from "express";
import { GymController } from '../controllers/gym.controller';
import { authenticate, authorizeGym } from "../middleware/auth.middleware";

const router = Router();
const gym = new GymController();
// get 
router.get("/getAllGym", (req, res, next) => gym.getAllGymController(req, res, next));
router.get("/getAllMembers", authenticate, authorizeGym, (req, res, next) => gym.getAllMembersController(req, res, next));
router.get("/getAllTrainers", authenticate, authorizeGym, (req, res, next) => gym.getAllTrainersController(req, res, next));
// delete routes 
router.delete("/deleteMemberFromGym/:memberId", authenticate, authorizeGym, (req, res, next) => gym.removeMemberFromGymController(req, res, next));
router.delete("/deleteTrainerFromGym/:trainerId", authenticate, authorizeGym, (req, res, next) => gym.removeTrainerFromGymController(req, res, next));
// detailed pages routes
router.get("/getMemberDetail/:memberId", authenticate, authorizeGym, (req, res, next) => gym.getMemberDetailController(req, res, next));
router.get("/getTrainerDetail/:trainerId", authenticate, authorizeGym, (req, res, next) => gym.getTrainerDetailController(req, res, next));
// trainer processes
router.post("/approveAssignment", authenticate, authorizeGym, (req, res, next) => gym.approveMemberAssignment(req, res, next));
router.post("/rejectAssignment", authenticate, authorizeGym, (req, res, next) => gym.rejectMemberAssignment(req, res, next));
router.get("/getMembers", authenticate, authorizeGym, (req, res, next) => gym.getMembersByStatus(req, res, next));

export default router;
