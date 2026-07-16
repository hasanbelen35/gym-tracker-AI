import { Router } from "express";
import { GymController } from '../controllers/gym.controller';

const router = Router();
const gym = new GymController();

router.get("/getAllGym", (req, res, next) => gym.getAllGymController(req, res, next));

export default router;