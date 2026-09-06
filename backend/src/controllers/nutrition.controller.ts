import { Response, NextFunction } from "express";
import { DietService } from "../services/nutrition.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { logger } from "../config/logger";

const dietService = new DietService();

export class DietController {
    // CREATE DIET PROGRAM CONTROLLER
    async createDietProgramController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const trainerId = req.user?.id;
            if (!trainerId) {
                logger.warn("Unauthorized diet program creation attempt: Missing trainer ID in request");
                return res.status(401).json({ success: false, message: "Unauthorized." });
            }
            const memberPublicId = req.params.memberPublicId as string;
            
            const { title, days } = req.body;
            logger.info(`Trainer ID ${trainerId} requesting diet program creation for member publicId: ${memberPublicId}`);

            const newProgram = await dietService.createDietProgram({
                trainerId,
                memberPublicId,
                title,
                days,
            });

            logger.info(`Diet program controller successfully created program ID: ${newProgram.id}`);
            return res.status(201).json({
                success: true,
                message: "Diet program successfully created.",
                data: newProgram,
            });
        } catch (error: any) {
            logger.error(`Error in createDietProgramController: ${error.message}`);
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    // DELETE DIET PROGRAM CONTROLLER
    async deleteDietProgramController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const trainerId = req.user?.id;
            if (!trainerId) {
                logger.warn("Unauthorized diet program deletion attempt: Missing trainer ID in request");
                return res.status(401).json({ success: false, message: "Unauthorized." });
            }

            const programPublicId = req.params.programPublicId as string;
            logger.info(`Trainer ID ${trainerId} requesting deletion of diet program with publicId: ${programPublicId}`);

            const result = await dietService.deleteDietProgram(programPublicId, trainerId);

            logger.info(`Diet program controller successfully deleted program publicId: ${programPublicId}`);
            return res.status(200).json(result);
        } catch (error: any) {
            logger.error(`Error in deleteDietProgramController: ${error.message}`);
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    // GET DIET PROGRAM DETAIL CONTROLLER
    async getDietProgramDetailController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const trainerId = req.user?.id;
            if (!trainerId) {
                logger.warn("Unauthorized diet program detail fetch attempt: Missing trainer ID in request");
                return res.status(401).json({ success: false, message: "Unauthorized." });
            }

            const programPublicId = req.params.programPublicId as string;
            logger.info(`Trainer ID ${trainerId} requesting detail for diet program publicId: ${programPublicId}`);

            const result = await dietService.getDietProgramDetail(programPublicId, trainerId);

            logger.info(`Diet program controller successfully fetched details for publicId: ${programPublicId}`);
            return res.status(200).json(result);
        } catch (error: any) {
            logger.error(`Error in getDietProgramDetailController: ${error.message}`);
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    // LIST MEMBER DIET PROGRAMS CONTROLLER
    async getMemberDietProgramsController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const trainerId = req.user?.id;
            if (!trainerId) {
                logger.warn("Unauthorized member diet programs fetch attempt: Missing trainer ID in request");
                return res.status(401).json({ success: false, message: "Unauthorized." });
            }

            const memberPublicId = req.params.memberPublicId as string;
            logger.info(`Trainer ID ${trainerId} requesting diet programs list for member publicId: ${memberPublicId}`);

            const programs = await dietService.getMemberDietPrograms(memberPublicId, trainerId);

            logger.info(`Diet program controller successfully fetched ${programs.length} programs for member publicId: ${memberPublicId}`);
            return res.status(200).json({
                success: true,
                count: programs.length,
                data: programs,
            });
        } catch (error: any) {
            logger.error(`Error in getMemberDietProgramsController: ${error.message}`);
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}