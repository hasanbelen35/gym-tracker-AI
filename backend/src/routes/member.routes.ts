import { Router } from "express";
import { MemberController } from "../controllers/member.controller";
import { authenticate, authorizeMember } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { completeProfileSchema, updateMemberProfileSchema } from "../validations/MemberValidations";

const router = Router();
const member = new MemberController();

// GET MEMBER ASSIGNED TRAINER DATA
router.get(
  "/getMyTrainerData",
  authenticate,
  authorizeMember,
  (req, res, next) => member.getMyTrainerDataController(req, res, next)
);

// COMPLETE MEMBER PROFILE (INITIAL ONBOARDING)
router.put(
  "/profile/complete",
  authenticate,
  authorizeMember,
  validate(completeProfileSchema),
  (req, res, next) => member.updateProfileController(req, res, next)
);

// GET MEMBER CURRENT CORE PROFILE DATA
router.get(
  "/me",
  authenticate,
  authorizeMember,
  (req, res, next) => member.getCurrentMemberController(req, res, next)
);

// GET MEMBER SESSIONS (PAGINATED)
router.get(
  "/sessions",
  authenticate,
  authorizeMember,
  (req, res, next) => member.getMemberSessionsController(req, res, next)
);

// GET MEMBER MEASUREMENTS (PAGINATED)
router.get(
  "/measurements",
  authenticate,
  authorizeMember,
  (req, res, next) => member.getMemberMeasurementsController(req, res, next)
);

// GET MEMBER WORKOUT PROGRAMS (PAGINATED)
router.get(
  "/my-programs",
  authenticate,
  authorizeMember,
  (req, res, next) => member.getMyProgramsController(req, res, next)
);

// UPDATE MEMBER PROFILE DATA (SETTINGS / EDIT)
router.put(
  "/edit-profile",
  authenticate,
  authorizeMember,
  validate(updateMemberProfileSchema),
  (req, res, next) => member.updateMemberProfileController(req, res, next)
);

export default router;