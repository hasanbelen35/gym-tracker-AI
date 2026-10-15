import { Request, Response, NextFunction } from "express";
import { GymService } from "../services/gym.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { logger } from "../config/logger";
import { getOrCalculateGymRiskAnalytics } from "../services/ai/GymAIService";
import { AppError } from "../middleware/errorMiddleware";

const gymService = new GymService();

export class GymController {
    // GET ALL GYM CONTROLLER
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
    // GET ALL MEMBETS FROM GYM BY GYM ID 
    async getAllMembersController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;

            logger.info("Fetching all members data via controller");
            const data = await gymService.getAllMembers(gymId);
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
    // REMOVE MEMBER FROM GYM BY GYM ID
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
    // GET MEMBER DETAIL CONTROLLER
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
    // GET ALL TRAINER FROM GYM CONTROLLER
    async getAllTrainersController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            logger.info(`Fetching all trainers data via controller for gymId: ${gymId}`);

            const data = await gymService.getAllTrainers(gymId);

            logger.info(`Successfully fetched all trainers data for gymId: ${gymId}`);
            return res.status(200).json({
                message: "success",
                data: data
            });
        } catch (error) {
            logger.error("Error in getAllTrainersController", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    }

    // REMOVE TRAINER FROM GYM CONTROLLER
    async removeTrainerFromGymController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const trainerPublicId = String(req.params.trainerId || "");

            logger.info(`Gym ID ${gymId} attempting to remove trainer publicId: ${trainerPublicId}`);

            const deletedTrainer = await gymService.removeTrainerFromGym(gymId, trainerPublicId);

            logger.info(`Successfully removed trainer publicId: ${trainerPublicId} from gym ID: ${gymId}`);

            return res.status(200).json({
                message: "Trainer removed successfully",
                data: {
                    id: deletedTrainer.id,
                    publicId: deletedTrainer.publicId,
                    name: deletedTrainer.name,
                    surname: deletedTrainer.surname
                }
            });
        } catch (error) {
            logger.error("Error in removeTrainerFromGymController", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    }

    // GET TRAINER DETAILED DATA CONTROLLER
    async getTrainerDetailController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const trainerPublicId = String(req.params.trainerId || "");

            logger.info(`Gym ID ${gymId} fetching details for trainer publicId: ${trainerPublicId}`);

            const data = await gymService.getTrainerDetail(gymId, trainerPublicId);

            logger.info(`Successfully fetched detail for trainer publicId: ${trainerPublicId} by gym ID: ${gymId}`);
            return res.status(200).json({
                message: "success",
                data: data
            });
        } catch (error) {
            logger.error("Error in getTrainerDetailController", {
                error: error instanceof Error ? error.message : error
            });
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

            logger.info(`Assignment successfully approved for member publicId: ${memberPublicId} by gym ID: ${gymId}`);
            return res.status(200).json({ message: "Assignment approved", data: result });
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

            logger.info(`Assignment successfully rejected for member publicId: ${memberPublicId} by gym ID: ${gymId}`);
            return res.status(200).json({ message: "Assignment rejected", data: result });
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
            return res.status(200).json({ message: "Members fetched", data: members });
        } catch (err) {
            logger.error("Error in getMembersByStatus controller", { error: err instanceof Error ? err.message : err });
            next(err);
        }
    }

    // GET GYM RISK ANALYTICS
    async getRiskAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const gymId = req.user!.id;
            const forceRefresh = req.query.refresh === 'true';

            logger.info(`Gym ID ${gymId} fetching risk analytics (refresh: ${forceRefresh})`);

            const analyticsData = await getOrCalculateGymRiskAnalytics(Number(gymId), forceRefresh);

            logger.info(`Successfully fetched risk analytics for gym ID: ${gymId} (Source: ${analyticsData.source})`);

            res.status(200).json({
                message: "Risk analytics fetched successfully",
                data: analyticsData
            });
        } catch (err) {
            logger.error("Error in getRiskAnalytics controller", {
                error: err instanceof Error ? err.message : err
            });
            next(err);
        }
    }


}