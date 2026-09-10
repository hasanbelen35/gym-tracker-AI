import { Router } from "express";
import { TrainerController } from "../controllers/trainer.controller";
import { authenticate, authorizeTrainer } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  requestAssignmentSchema,
  getTrainerMembersByStatusQuerySchema,
  trainerMemberParamSchema,
  createMeasurementSchema,
  deleteMeasurementSchema,
  completeTrainerProfileSchema
} from "../validations/trainer.validations";

const router = Router();
const trainer = new TrainerController();

// create assignment
router.post("/requestAssignment", authenticate, authorizeTrainer, validate(requestAssignmentSchema), (req, res, next) =>
    trainer.requestMemberAssignment(req, res, next)
);

// draw back assignment
router.delete("/cancelAssignment", authenticate, authorizeTrainer, validate(requestAssignmentSchema), (req, res, next) =>
    trainer.cancelMyAssignmentRequest(req, res, next)
);

// list members as assignment status 
router.get("/getMembers/:gymId", authenticate, authorizeTrainer, validate(getTrainerMembersByStatusQuerySchema), (req, res, next) =>
    trainer.getMembersByStatus(req, res, next)
);

// get member's detailed data
router.get("/my-members/:memberPublicId", authenticate, authorizeTrainer, validate(trainerMemberParamSchema), (req, res, next) =>
    trainer.getAssignedMemberDetailController(req, res, next)
);

// add measurement to assigned member
router.post("/my-members/addMeasurement/:memberPublicId", authenticate, authorizeTrainer, validate(createMeasurementSchema), (req, res, next) =>
    trainer.addMemberMeasurement(req, res, next)
);

// get measurement history of assigned member
router.get("/my-members/getMembersMeasurements/:memberPublicId", authenticate, authorizeTrainer, validate(trainerMemberParamSchema), (req, res, next) =>
    trainer.getMemberMeasurements(req, res, next)
);

// delete measurement of assigned member
router.delete("/my-members/deleteMemberMeasurement/:memberPublicId/:measurementPublicId", authenticate, authorizeTrainer, validate(deleteMeasurementSchema), (req, res, next) =>
    trainer.deleteMemberMeasurement(req, res, next)
);

// complete trainer profile
router.put("/complete-profile", authenticate, authorizeTrainer, validate(completeTrainerProfileSchema), (req, res, next) =>
    trainer.completeTrainerProfileController(req, res, next)
);

export default router;