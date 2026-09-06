import { Request, Response, NextFunction } from "express";
import { GymService } from "../services/gym.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { logger } from "../config/logger";

const gymService = new GymService();

export class GymController {
    // ----------------------------------------GYM-----------------------------------------

    async getAllGymController(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info("Fetching all gym data via controller");
            const data = await gymService.getAllGymData();
            logger.info("Successfully fetched all gym data");
            res.status(200).json({
                message: "success",
                data: data
            });
        } catch (error) {
            logger.error("Error in getAllGymController", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    }
    // ----------------------------------------MEMBER-----------------------------------------

    async getAllMembersController(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info("Fetching all members data via controller");
            const data = await gymService.getAllMembers();
            logger.info("Successfully fetched all members data");
            res.status(200).json({
                message: "success",
                data: data
            });
        } catch (error) {
            logger.error("Error in getAllMembersController", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    }

    async removeMemberFromGymController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const memberPublicId: string = String(req.params.memberId);
            logger.info(`Gym ID ${gymId} attempting to remove member publicId: ${memberPublicId}`);

            if (!memberPublicId || memberPublicId === "undefined") {
                logger.warn(`Remove member failed: Invalid member id provided (${memberPublicId}) for gym ID: ${gymId}`);
                res.status(400).json({ message: "Invalid member id" });
                return;
            }

            const deletedMember = await gymService.removeMemberFromGym(gymId, memberPublicId);

            logger.info(`Successfully removed member publicId: ${memberPublicId} from gym ID: ${gymId}`);
            res.status(200).json({
                message: "Member removed successfully",
                data: deletedMember
            });
        } catch (error) {
            logger.error("Error in removeMemberFromGymController", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    }

    async getMemberDetailController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const memberPublicId: string = String(req.params.memberId);
            logger.info(`Gym ID ${gymId} fetching details for member publicId: ${memberPublicId}`);

            if (!memberPublicId || memberPublicId === "undefined") {
                logger.warn(`Get member detail failed: Invalid member id provided (${memberPublicId}) for gym ID: ${gymId}`);
                res.status(400).json({ message: "Invalid member id" });
                return;
            }

            const data = await gymService.getMemberDetail(gymId, memberPublicId);

            logger.info(`Successfully fetched detail for member publicId: ${memberPublicId} by gym ID: ${gymId}`);
            res.status(200).json({
                message: "success",
                data: data
            });
        } catch (error) {
            logger.error("Error in getMemberDetailController", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    }
    //----------------------------------------TRAINER----------------------------------------

    async getAllTrainersController(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info("Fetching all trainers data via controller");
            const data = await gymService.getAllTrainers();
            logger.info("Successfully fetched all trainers data");
            res.status(200).json({
                message: "success",
                data: data
            });
        } catch (error) {
            logger.error("Error in getAllTrainersController", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    }

    async removeTrainerFromGymController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const trainerPublicId: string = String(req.params.trainerId);
            logger.info(`Gym ID ${gymId} attempting to remove trainer publicId: ${trainerPublicId}`);

            if (!trainerPublicId || trainerPublicId === "undefined") {
                logger.warn(`Remove trainer failed: Invalid trainer id provided (${trainerPublicId}) for gym ID: ${gymId}`);
                res.status(400).json({ message: "Invalid trainer id" });
                return;
            }

            const deletedTrainer = await gymService.removeTrainerFromGym(gymId, trainerPublicId);

            logger.info(`Successfully removed trainer publicId: ${trainerPublicId} from gym ID: ${gymId}`);
            res.status(200).json({
                message: "Trainer removed successfully",
                data: deletedTrainer
            });
        } catch (error) {
            logger.error("Error in removeTrainerFromGymController", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    }

    async getTrainerDetailController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const trainerPublicId: string = String(req.params.trainerId);
            logger.info(`Gym ID ${gymId} fetching details for trainer publicId: ${trainerPublicId}`);

            if (!trainerPublicId || trainerPublicId === "undefined") {
                logger.warn(`Get trainer detail failed: Invalid trainer id provided (${trainerPublicId}) for gym ID: ${gymId}`);
                res.status(400).json({ message: "Invalid trainer id" });
                return;
            }

            const data = await gymService.getTrainerDetail(gymId, trainerPublicId);

            logger.info(`Successfully fetched detail for trainer publicId: ${trainerPublicId} by gym ID: ${gymId}`);
            res.status(200).json({
                message: "success",
                data: data
            });
        } catch (error) {
            logger.error("Error in getTrainerDetailController", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    }

    // APPROVE TRAINER'S MEMBER ASSIGNMENT
    async approveMemberAssignment(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const { memberPublicId } = req.body;
            logger.info(`Gym ID ${gymId} attempting to approve assignment for member publicId: ${memberPublicId}`);

            const result = await gymService.approveMemberAssignment(memberPublicId, gymId);

            if (result.count === 0) {
                logger.warn(`Approve member assignment failed: Member not found or invalid state for member publicId: ${memberPublicId} in gym ID: ${gymId}`);
                return res.status(404).json({ message: "Üye bulunamadı veya uygun durumda değil." });
            }

            logger.info(`Assignment successfully approved for member publicId: ${memberPublicId} by gym ID: ${gymId}`);
            res.status(200).json({ message: "Assignment approved", data: result });
        } catch (err) {
            logger.error("Error in approveMemberAssignment controller", { error: err instanceof Error ? err.message : err });
            next(err);
        }
    }

    // REJECT TRAINER'S MEMBER ASSIGNMENT
    async rejectMemberAssignment(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const { memberPublicId } = req.body;
            logger.info(`Gym ID ${gymId} attempting to reject assignment for member publicId: ${memberPublicId}`);

            const result = await gymService.rejectMemberAssignment(memberPublicId, gymId);

            if (result.count === 0) {
                logger.warn(`Reject member assignment failed: Member not found or invalid state for member publicId: ${memberPublicId} in gym ID: ${gymId}`);
                return res.status(404).json({ message: "Üye bulunamadı veya uygun durumda değil." });
            }

            logger.info(`Assignment successfully rejected for member publicId: ${memberPublicId} by gym ID: ${gymId}`);
            res.status(200).json({ message: "Assignment rejected", data: result });
        } catch (err) {
            logger.error("Error in rejectMemberAssignment controller", { error: err instanceof Error ? err.message : err });
            next(err);
        }
    }

    // GET MEMBERS BY STATUS
    async getMembersByStatus(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const { status } = req.query as { status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED' };
            logger.info(`Gym ID ${gymId} fetching members by status: ${status}`);

            const members = await gymService.getMembersByStatus(gymId, status);

            logger.info(`Successfully fetched ${members.length} members with status '${status}' for gym ID: ${gymId}`);
            res.status(200).json({ message: "Members fetched", data: members });
        } catch (err) {
            logger.error("Error in getMembersByStatus controller", { error: err instanceof Error ? err.message : err });
            next(err);
        }
    }
}