import { Router } from "express";
import { TrainerController } from "../controllers/trainer.controller";
import { authenticate, authorizeTrainer } from "../middleware/auth.middleware";

const router = Router();
const trainer = new TrainerController();

// crete assıgnment
router.post("/requestAssignment", authenticate, authorizeTrainer, (req, res, next) =>
    trainer.requestMemberAssignment(req, res, next)
);

// draw back assıngment
router.delete("/cancelAssignment", authenticate, authorizeTrainer, (req, res, next) =>
    trainer.cancelMyAssignmentRequest(req, res, next)
);

// list members as assıngment status 
router.get("/getMembers/:gymId", authenticate, authorizeTrainer, (req, res, next) =>
    trainer.getMembersByStatus(req, res, next)
);
// get member's detailed data
router.get("/my-members/:memberPublicId", authenticate, authorizeTrainer, (req, res, next) =>
    trainer.getAssignedMemberDetailController(req, res, next)
);
// add measurement to assigned member
router.post("/my-members/addMeasurement/:memberPublicId", authenticate, authorizeTrainer, (req, res, next) =>
    trainer.addMemberMeasurement(req, res, next)
);

// get measurement history of assigned member
router.get("/my-members/getMembersMeasurements/:memberPublicId", authenticate, authorizeTrainer, (req, res, next) =>
    trainer.getMemberMeasurements(req, res, next)
);
export default router;