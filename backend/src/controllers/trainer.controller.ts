import { Response, NextFunction } from "express";
import { TrainerService } from "../services/trainer.service";
import { AuthRequest } from "../middleware/auth.middleware";

const trainerService = new TrainerService();

export class TrainerController {
    // send request to gym for assıgn member to trainer controller
    async requestMemberAssignment(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const trainerId = req.user!.id;
            const { memberPublicId, gymId } = req.body;

            const result = await trainerService.requestMemberAssignment(memberPublicId, trainerId, gymId);

            if (result.count === 0) {
                return res.status(404).json({ message: "Üye bulunamadı veya uygun durumda değil." });
            }

            res.status(200).json({ message: "Assignment request created", data: result });
        } catch (err) {
            next(err);
        }
    }
    // cancel assignment reqauest
    async cancelMyAssignmentRequest(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const trainerId = req.user!.id;
            const { memberPublicId, gymId } = req.body;

            await trainerService.cancelMyAssignmentRequest(memberPublicId, trainerId, gymId);

            res.status(200).json({ message: "Assignment request cancelled" });
        } catch (err) {
            next(err);
        }
    }

    // get members by status in exist gym
    async getMembersByStatus(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const trainerId = req.user!.id;
            const gymId = req.params.gymId as string;

            const { status } = req.query as { status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED' };

            const members = await trainerService.getMembersByStatus(trainerId, gymId, status);

            res.status(200).json(members);
        } catch (err) {
            console.log(err)
            next(err);
        }
    }
}