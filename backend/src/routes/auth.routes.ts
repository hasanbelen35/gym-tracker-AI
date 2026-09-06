import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import {
  registerGymSchema,
  loginGymSchema,
  registerMemberSchema,
  loginMemberSchema,
  registerTrainerSchema,
  loginTrainerSchema,
} from "../validations/auth.validations";

const router = Router();
const authController = new AuthController();

// GYM
router.post("/gym/register", validate(registerGymSchema), (req, res, next) => authController.registerGym(req, res, next));
router.post("/gym/login", validate(loginGymSchema), (req, res, next) => authController.loginGym(req, res, next));

// MEMBER
router.post("/member/register", validate(registerMemberSchema), (req, res, next) => authController.registerMember(req, res, next));
router.post("/member/login", validate(loginMemberSchema), (req, res, next) => authController.loginMember(req, res, next));

// TRAINER
router.post("/trainer/register", validate(registerTrainerSchema), (req, res, next) => authController.registerTrainer(req, res, next));
router.post("/trainer/login", validate(loginTrainerSchema), (req, res, next) => authController.loginTrainer(req, res, next));

router.post("/logout", (req, res, next) => authController.logout(req, res, next));

export default router;