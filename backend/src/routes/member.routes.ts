import { Router } from "express";
import { MemberController } from '../controllers/member.controller';
import { authenticate, authorizeMember } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { complateMemberProfileSchema, updateMemberProfileSchema } from "../validations/MemberValidations";

const router = Router();
const member = new MemberController();

// get trainer data
router.get("/getMyTrainerData", authenticate, authorizeMember, (req, res, next) => member.getMyTrainerDataController(req, res, next));

// put - update profile / complete profile 
router.put(
  "/profile/complete",
  authenticate,
  authorizeMember,
  validate(complateMemberProfileSchema),
  (req, res, next) => member.updateProfileController(req, res, next)
);
// GET MEMBER CURRENT PROFILE DATA
router.get("/me", authenticate, authorizeMember, (req, res, next) => member.getCurrentMemberController(req, res, next));
// GET MEMBER WORKOUTS PROGRAMS  
router.get('/my-programs', authenticate, authorizeMember, (req, res, next) => member.getMyPrograms(req, res, next));
// UPDATE MEMBER PROFILE DATA
router.put(
  '/edit-profile',
  authenticate,
  authorizeMember,
  validate(updateMemberProfileSchema),
  (req, res, next) => member.updateMemberProfile(req, res, next) 
);

export default router;