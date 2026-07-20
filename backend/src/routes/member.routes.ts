import { Router } from "express";
import { MemberController } from '../controllers/member.controller';
import { authenticate, authorizeMember } from "../middleware/auth.middleware";

const router = Router();
const member = new MemberController();
// get 
router.get("/getMyTrainerData", authenticate, authorizeMember, (req, res, next) => member.getMyTrainerDataController(req, res, next));

export default router;
