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

    // APPROVE TRAINER'S MEMBER ASSIGNMENT
    async approveMemberAssignment(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const { memberPublicId } = req.body;

            const result = await gymService.approveMemberAssignment(memberPublicId, gymId);

            if (result.count === 0) {
                return res.status(404).json({ message: "Üye bulunamadı veya uygun durumda değil." });
            }

            res.status(200).json({ message: "Assignment approved", data: result });
        } catch (err) {
            next(err);
        }
    }

    // REJECT TRAINER'S MEMBER ASSIGNMENT
    async rejectMemberAssignment(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const { memberPublicId } = req.body;

            const result = await gymService.rejectMemberAssignment(memberPublicId, gymId);

            if (result.count === 0) {
                return res.status(404).json({ message: "Üye bulunamadı veya uygun durumda değil." });
            }

            res.status(200).json({ message: "Assignment rejected", data: result });
        } catch (err) {
            next(err);
        }
    }

    // GET MEMBERS BY STATUS
    async getMembersByStatus(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const { status } = req.query as { status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED' };

            const members = await gymService.getMembersByStatus(gymId, status);

            res.status(200).json({ message: "Members fetched", data: members });
        } catch (err) {
            next(err);
        }
    }
}