import { Router } from "express";
import { analyzeMemberHandler } from "../../controllers/ai/ai.controller"; 
import { authenticate, authorizeTrainer } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { trainerMemberParamSchema } from "../../validations/ai/trainer.ai.validations"; 

const router = Router();

// AI member performance analysis
router.get("/my-members/analyze/:memberPublicId", authenticate, authorizeTrainer, validate(trainerMemberParamSchema), (req, res, next) =>
    analyzeMemberHandler(req, res, next)
);

export default router;