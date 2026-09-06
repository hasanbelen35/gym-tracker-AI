import { Router } from "express";
import { DietController } from "../controllers/nutrition.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeTrainer } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
    createDietProgramSchema,
    programParamSchema,
    memberParamSchema,
} from "../validations/nutrition.validations";

const router = Router();
const dietController = new DietController();

router.post(
    "/createNutritionProgram/:memberPublicId",
    authenticate,
    authorizeTrainer,
    validate(createDietProgramSchema),
    (req, res, next) => dietController.createDietProgramController(req, res, next)
);
router.delete(
    "/deleteNutritionProgram/:programPublicId",
    authenticate,
    authorizeTrainer,
    validate(programParamSchema),
    (req, res, next) => dietController.deleteDietProgramController(req, res, next)
);

router.get(
    "/getProgramDetail/:programPublicId",
    authenticate,
    authorizeTrainer,
    validate(programParamSchema),
    (req, res, next) => dietController.getDietProgramDetailController(req, res, next)
);

router.get(
    "/getMembersNutritionPrograms/:memberPublicId",
    authenticate,
    authorizeTrainer,
    validate(memberParamSchema),
    (req, res, next) => dietController.getMemberDietProgramsController(req, res, next)
);

export default router;