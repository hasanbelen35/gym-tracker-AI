import { Request, Response, NextFunction } from "express";
import { GymService } from "../services/gym.service";
import { AuthRequest } from "../middleware/auth.middleware";

const gymService = new GymService();

export class GymController {
        // ----------------------------------------GYM-----------------------------------------

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
    // ----------------------------------------MEMBER-----------------------------------------

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

    async removeMemberFromGymController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const memberPublicId: string = String(req.params.memberId);

            if (!memberPublicId || memberPublicId === "undefined") {
                res.status(400).json({ message: "Invalid member id" });
                return;
            }

            const deletedMember = await gymService.removeMemberFromGym(gymId, memberPublicId);

            res.status(200).json({
                message: "Member removed successfully",
                data: deletedMember
            });
        } catch (error) {
            next(error);
        }
    }

    async getMemberDetailController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const memberPublicId: string = String(req.params.memberId);

            if (!memberPublicId || memberPublicId === "undefined") {
                res.status(400).json({ message: "Invalid member id" });
                return;
            }

            const data = await gymService.getMemberDetail(gymId, memberPublicId);

            res.status(200).json({
                message: "success",
                data: data
            });
        } catch (error) {
            next(error);
        }
    }
    //----------------------------------------TRAINER----------------------------------------

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

    async removeTrainerFromGymController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const trainerPublicId: string = String(req.params.trainerId);

            if (!trainerPublicId || trainerPublicId === "undefined") {
                res.status(400).json({ message: "Invalid trainer id" });
                return;
            }

            const deletedTrainer = await gymService.removeTrainerFromGym(gymId, trainerPublicId);

            res.status(200).json({
                message: "Trainer removed successfully",
                data: deletedTrainer
            });
        } catch (error) {
            next(error);
        }
    }

    async getTrainerDetailController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const trainerPublicId: string = String(req.params.trainerId);

            if (!trainerPublicId || trainerPublicId === "undefined") {
                res.status(400).json({ message: "Invalid trainer id" });
                return;
            }

            const data = await gymService.getTrainerDetail(gymId, trainerPublicId);

            res.status(200).json({
                message: "success",
                data: data
            });
        } catch (error) {
            next(error);
        }
    }
}