import { Request, Response, NextFunction } from "express";
import { GymService } from "../services/gym.service";

const gymService = new GymService();

export class GymController {
    async getAllGymController(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await gymService.getAllGymData();
            res.status(200).json({
                message: "success",
                data: data
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllMembersController(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await gymService.getAllMembers();
            res.status(200).json({
                message: "success",
                data: data
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllTrainersController(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await gymService.getAllTrainers();
            res.status(200).json({
                message: "success",
                data: data
            });
        } catch (error) {
            next(error);
        }
    }
}