import { Router } from "express";
import { MemberController } from '../controllers/member.controller';
import { authenticate, authorizeMember } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { updateMemberProfileSchema } from "../validations/MemberValidations";

const router = Router();
const member = new MemberController();

// get trainer data
router.get("/getMyTrainerData", authenticate, authorizeMember, (req, res, next) => member.getMyTrainerDataController(req, res, next));

// put - update profile / complete profile 
router.put(
  "/profile/complete",
  authenticate,
  authorizeMember,
  validate(updateMemberProfileSchema),
  (req, res, next) => member.updateProfileController(req, res, next)
);

// get current member profile
router.get("/me", authenticate, authorizeMember, (req, res, next) => member.getCurrentMemberController(req, res, next));
export default router;