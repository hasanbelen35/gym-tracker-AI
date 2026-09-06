import { Router } from "express";
import { GymController } from "../controllers/gym.controller";
import { authenticate, authorizeGym } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  memberParamSchema,
  trainerParamSchema,
  assignmentSchema,
  getMembersByStatusQuerySchema,
} from "../validations/gym.validations";

const router = Router();
const gym = new GymController();

// GET
router.get("/getAllGym", (req, res, next) => gym.getAllGymController(req, res, next));
router.get("/getAllMembers", authenticate, authorizeGym, (req, res, next) => gym.getAllMembersController(req, res, next));
router.get("/getAllTrainers", authenticate, authorizeGym, (req, res, next) => gym.getAllTrainersController(req, res, next));

// DELETE ROUTES
router.delete("/deleteMemberFromGym/:memberId", authenticate, authorizeGym, validate(memberParamSchema), (req, res, next) => gym.removeMemberFromGymController(req, res, next));
router.delete("/deleteTrainerFromGym/:trainerId", authenticate, authorizeGym, validate(trainerParamSchema), (req, res, next) => gym.removeTrainerFromGymController(req, res, next));

// DETAILED PAGES ROUTES
router.get("/getMemberDetail/:memberId", authenticate, authorizeGym, validate(memberParamSchema), (req, res, next) => gym.getMemberDetailController(req, res, next));
router.get("/getTrainerDetail/:trainerId", authenticate, authorizeGym, validate(trainerParamSchema), (req, res, next) => gym.getTrainerDetailController(req, res, next));

// TRAINER PROCESSES
router.post("/approveAssignment", authenticate, authorizeGym, validate(assignmentSchema), (req, res, next) => gym.approveMemberAssignment(req, res, next));
router.post("/rejectAssignment", authenticate, authorizeGym, validate(assignmentSchema), (req, res, next) => gym.rejectMemberAssignment(req, res, next));
router.get("/getMembers", authenticate, authorizeGym, validate(getMembersByStatusQuerySchema), (req, res, next) => gym.getMembersByStatus(req, res, next));

export default router;