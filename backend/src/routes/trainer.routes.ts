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
// -------------------------------------------------------------------------------------------- MEMBER PROFILE ------------------------------------------------------------------------------------
// GET MEMBER'S PROFILE DATA BY TRAINER ROUTE
router.get("/my-members/:memberPublicId/profile", authenticate, authorizeTrainer, validate(trainerMemberParamSchema), (req, res, next) =>
    trainer.getAssignedMemberProfileController(req, res, next)
);

// GET MEMBER'S MEASUREMENTS PAGINATED DATA BY TRAINER ROUTE
router.get("/my-members/:memberPublicId/measurements", authenticate, authorizeTrainer, validate(trainerMemberParamSchema), (req, res, next) =>
    trainer.getAssignedMemberMeasurementsController(req, res, next)
);

// GET MEMBER'S SESSIONS PAGINATED DATA BY TRAINER ROUTE
router.get("/my-members/:memberPublicId/sessions", authenticate, authorizeTrainer, validate(trainerMemberParamSchema), (req, res, next) =>
    trainer.getAssignedMemberSessionsController(req, res, next)
);

// GET MEMBER'S PROGRAMS PAGINATED DATA BY TRAINER ROUTE
router.get("/my-members/:memberPublicId/programs", authenticate, authorizeTrainer, validate(trainerMemberParamSchema), (req, res, next) =>
    trainer.getAssignedMemberProgramsController(req, res, next)
);
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// add measurement to assigned member
router.post("/my-members/addMeasurement/:memberPublicId", authenticate, authorizeTrainer, validate(createMeasurementSchema), (req, res, next) =>
    trainer.addMemberMeasurement(req, res, next)
);

// get measurement history of assigned member
router.get("/my-members/getMembersMeasurements/:memberPublicId", authenticate, authorizeTrainer, validate(trainerMemberParamSchema), (req, res, next) =>
    trainer.getMemberMeasurements(req, res, next)
);

// delete measurement of assigned member
router.delete("/my-members/deleteMemberMeasurement/:memberPublicId/:measurementPublicId", authenticate, authorizeTrainer, (req, res, next) =>
    trainer.deleteMemberMeasurement(req, res, next)
);

// complete trainer profile
router.put("/complete-profile", authenticate, authorizeTrainer, validate(completeTrainerProfileSchema), (req, res, next) =>
    trainer.completeTrainerProfileController(req, res, next)
);

// get trainer profile
router.get("/profile", authenticate, authorizeTrainer, (req, res, next) =>
    trainer.getTrainerProfileController(req, res, next)
);

// update trainer profile
router.put("/update-profile", authenticate, authorizeTrainer, validate(updateTrainerProfileSchema), (req, res, next) =>
    trainer.updateTrainerProfileController(req, res, next)
);

// activate archived member program
router.put("/programs/:programPublicId/activate", authenticate, authorizeTrainer, validate(activateProgramSchema), (req, res, next) =>
    trainer.activateProgramController(req, res, next)
);

export default router;

//             const response = await API.get(`/trainer/my-members/${memberPublicId}`);
