import { Request, Response, NextFunction } from "express";
import { GymService } from "../services/gym.service";
import { AuthRequest } from "../middleware/auth.middleware";

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

    // remove member from gym
    async removeMemberFromGymController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id; // token gym'e ait olmalı
            const memberId = Number(req.params.memberId);

            if (!memberId || isNaN(memberId)) {
                res.status(400).json({ message: "Invalid member id" });
                return;
            }

            const deletedMember = await gymService.removeMemberFromGym(gymId, memberId);

            res.status(200).json({
                message: "Member removed successfully",
                data: deletedMember
            });
        } catch (error) {
            next(error);
        }
    }

    // Get full detail of a member 
    async getMemberDetailController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const memberId = Number(req.params.memberId);

            if (!memberId || isNaN(memberId)) {
                res.status(400).json({ message: "Invalid member id" });
                return;
            }

            const data = await gymService.getMemberDetail(gymId, memberId);

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
    // remove trainer from gym
    async removeTrainerFromGymController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id; // token gym'e ait olmalı
            const trainerId = Number(req.params.trainerId);

            if (!trainerId || isNaN(trainerId)) {
                res.status(400).json({ message: "Invalid trainer id" });
                return;
            }

            const deletedTrainer = await gymService.removeTrainerFromGym(gymId, trainerId);

            res.status(200).json({
                message: "Trainer removed successfully",
                data: deletedTrainer
            });
        } catch (error) {
            next(error);
        }
    }


    // Get full detail of a trainer (gym owner only)
    async getTrainerDetailController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const trainerId = Number(req.params.trainerId);

            if (!trainerId || isNaN(trainerId)) {
                res.status(400).json({ message: "Invalid trainer id" });
                return;
            }

            const data = await gymService.getTrainerDetail(gymId, trainerId);

            res.status(200).json({
                message: "success",
                data: data
            });
        } catch (error) {
            next(error);
        }
    }
}

// removeTrainerFromGym
// removeMemberFromGym