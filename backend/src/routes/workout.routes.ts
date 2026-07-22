import { Router } from "express";
import { ExerciseController } from "../controllers/workout.controller";
import { authenticate, authorizeTrainer } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { getExercisesByQuerySchema } from "../validations/exercise.validation";
import prisma from "../lib/db";

const router = Router();
const exerciseController = new ExerciseController();

router.get("/getExercisesByQuery", authenticate, authorizeTrainer, validate(getExercisesByQuerySchema), (req, res, next) => exerciseController.getExercisesByQueryController(req, res, next));

/*
router.get("/filter-options", async (req, res) => {
    try {
        // Promise.all ile 4 sorguyu aynı anda (paralel) atarak performansı uçuruyoruz
        const [categories, equipments, targetMuscles] = await Promise.all([
            prisma.exercise.findMany({
                select: { category: true },
                distinct: ["category"],
            }),
            prisma.exercise.findMany({
                select: { equipment: true },
                distinct: ["equipment"],
            }),
            prisma.exercise.findMany({
                select: { targetMuscle: true },
                distinct: ["targetMuscle"],
            }),
            
        ]);

        // Gelen objeleri düz diziye çevirip null/boş olanları temizliyoruz
        return res.status(200).json({
            success: true,
            data: {
                categories: categories.map((item) => item.category).filter(Boolean),
                equipments: equipments.map((item) => item.equipment).filter(Boolean),
                targetMuscles: targetMuscles.map((item) => item.targetMuscle).filter(Boolean),
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: String(error),
        });
    }
});
*/
export default router;