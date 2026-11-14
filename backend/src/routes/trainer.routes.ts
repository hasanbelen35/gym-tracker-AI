import { Router } from "express";
import { TrainerController } from "../controllers/trainer.controller";
import { authenticate, authorizeTrainer } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
    requestAssignmentSchema,
    getTrainerMembersByStatusQuerySchema,
    trainerMemberParamSchema,
    createMeasurementSchema,
    completeTrainerProfileSchema,
    updateTrainerProfileSchema,
    activateProgramSchema
} from "../validations/trainer.validations";

const router = Router();
const trainer = new TrainerController();

// ==========================================
// ASSIGNMENT & MEMBER LISTING
// ==========================================

// CREATE ASSIGNMENT REQUEST
router.post(
    "/requestAssignment",
    authenticate,
    authorizeTrainer,
    validate(requestAssignmentSchema),
    (req, res, next) => trainer.requestMemberAssignment(req, res, next)
);

// CANCEL ASSIGNMENT REQUEST
router.delete(
    "/cancelAssignment",
    authenticate,
    authorizeTrainer,
    validate(requestAssignmentSchema),
    (req, res, next) => trainer.cancelMyAssignmentRequest(req, res, next)
);

// LIST MEMBERS BY ASSIGNMENT STATUS IN GYM
router.get(
    "/getMembers/:gymId",
    authenticate,
    authorizeTrainer,
    validate(getTrainerMembersByStatusQuerySchema),
    (req, res, next) => trainer.getMembersByStatus(req, res, next)
);

// ==========================================
// ASSIGNED MEMBER DASHBOARD & DETAILS
// ==========================================

// GET MEMBER DETAILED PROFILE (API.get(`/trainer/my-members/${memberPublicId}`))
router.get(
    "/my-members/:memberPublicId",
    authenticate,
    authorizeTrainer,
    validate(trainerMemberParamSchema),
    (req, res, next) => trainer.getAssignedMemberProfileController(req, res, next)
);

// GET MEMBER PROFILE ALIAS (/profile)
router.get(
    "/my-members/:memberPublicId/profile",
    authenticate,
    authorizeTrainer,
    validate(trainerMemberParamSchema),
    (req, res, next) => trainer.getAssignedMemberProfileController(req, res, next)
);

// GET MEMBER MEASUREMENTS (PAGINATED)
router.get(
    "/my-members/:memberPublicId/measurements",
    authenticate,
    authorizeTrainer,
    validate(trainerMemberParamSchema),
    (req, res, next) => trainer.getAssignedMemberMeasurementsController(req, res, next)
);

// GET MEMBER SESSIONS (PAGINATED)
router.get(
    "/my-members/:memberPublicId/sessions",
    authenticate,
    authorizeTrainer,
    validate(trainerMemberParamSchema),
    (req, res, next) => trainer.getAssignedMemberSessionsController(req, res, next)
);

// GET MEMBER PROGRAMS (PAGINATED)
router.get(
    "/my-members/:memberPublicId/programs",
    authenticate,
    authorizeTrainer,
    validate(trainerMemberParamSchema),
    (req, res, next) => trainer.getAssignedMemberProgramsController(req, res, next)
);

// GET MEMBER WORKOUT LOGS (PAGINATED - NEW)
router.get(
    "/my-members/:memberPublicId/workout-logs",
    authenticate,
    authorizeTrainer,
    validate(trainerMemberParamSchema),
    (req, res, next) => trainer.getAssignedMemberWorkoutLogsController(req, res, next)
);

// ==========================================
// MEMBER MEASUREMENT ACTIONS
// ==========================================

// ADD MEASUREMENT TO ASSIGNED MEMBER
router.post(
    "/my-members/addMeasurement/:memberPublicId",
    authenticate,
    authorizeTrainer,
    validate(createMeasurementSchema),
    (req, res, next) => trainer.addMemberMeasurement(req, res, next)
);

// GET ALL MEASUREMENTS HISTORY OF ASSIGNED MEMBER
router.get(
    "/my-members/getMembersMeasurements/:memberPublicId",
    authenticate,
    authorizeTrainer,
    validate(trainerMemberParamSchema),
    (req, res, next) => trainer.getMemberMeasurements(req, res, next)
);

// DELETE MEASUREMENT OF ASSIGNED MEMBER
router.delete(
    "/my-members/deleteMemberMeasurement/:memberPublicId/:measurementPublicId",
    authenticate,
    authorizeTrainer,
    (req, res, next) => trainer.deleteMemberMeasurement(req, res, next)
);

// ==========================================
// TRAINER PROFILE & PROGRAM MANAGEMENT
// ==========================================

// GET TRAINER PROFILE
router.get(
    "/profile",
    authenticate,
    authorizeTrainer,
    (req, res, next) => trainer.getTrainerProfileController(req, res, next)
);

// COMPLETE TRAINER PROFILE
router.put(
    "/complete-profile",
    authenticate,
    authorizeTrainer,
    validate(completeTrainerProfileSchema),
    (req, res, next) => trainer.completeTrainerProfileController(req, res, next)
);

// UPDATE TRAINER PROFILE
router.put(
    "/update-profile",
    authenticate,
    authorizeTrainer,
    validate(updateTrainerProfileSchema),
    (req, res, next) => trainer.updateTrainerProfileController(req, res, next)
);

// ACTIVATE ARCHIVED MEMBER PROGRAM
router.put(
    "/programs/:programPublicId/activate",
    authenticate,
    authorizeTrainer,
    validate(activateProgramSchema),
    (req, res, next) => trainer.activateProgramController(req, res, next)
);

// GET TRAINER MEMBER PERFORMANCE DASHBOARD 
router.get(
    "/performance/dashboard",
    authenticate,
    authorizeTrainer,
    (req, res, next) => trainer.getPerformanceDashboardController(req, res, next)
);

export default router;