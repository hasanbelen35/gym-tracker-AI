import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();
// GYM
router.post("/gym/register", (req, res, next) => authController.registerGym(req, res, next));
router.post("/gym/login", (req, res, next) => authController.loginGym(req, res, next));
// MEMBER
router.post("/member/register", (req, res, next) => authController.registerMember(req, res, next));
router.post("/member/login", (req, res, next) => authController.loginMember(req, res, next));
//  TRAINER
router.post("/trainer/register", (req, res, next) => authController.registerTrainer(req, res, next));
router.post("/trainer/login", (req, res, next) => authController.loginTrainer(req, res, next));

router.post("/logout", authController.logout);
export default router;