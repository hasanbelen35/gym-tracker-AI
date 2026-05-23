import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();

router.post("/gym/register", (req, res, next) => authController.registerGym(req, res, next));
router.post("/gym/login", (req, res, next) => authController.loginGym(req, res, next));
router.post("/member/register", (req, res, next) => authController.registerMember(req, res, next));
router.post("/member/login", (req, res, next) => authController.loginMember(req, res, next));

export default router;