import { Response, NextFunction } from "express";
import { TrainerService } from "../services/trainer.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { logger } from "../config/logger";

const trainerService = new TrainerService();

export class TrainerController {

    // SEND REQUEST TO ASSIGN MEMBER 
    requestMemberAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.id;
            logger.info(`Trainer ID ${trainerId} attempting to request member assignment`);

            if (!trainerId) {
                logger.warn("Request member assignment failed: Unauthorized access, missing trainer ID");
                return res.status(401).json({ success: false, message: "Unauthorized access." });
            }

            const { memberPublicId, gymId } = req.body;
            logger.info(`Trainer ID ${trainerId} requesting assignment for member publicId: ${memberPublicId} in gym ID: ${gymId}`);

            const result = await trainerService.requestMemberAssignment(memberPublicId, trainerId, gymId);

            if (result.count === 0) {
                logger.warn(`Request member assignment failed: Member not found or invalid state for member publicId: ${memberPublicId} and trainer ID: ${trainerId}`);
                return res.status(404).json({ success: false, message: "Member not found or not in a valid state." });
            }

            logger.info(`Assignment request successfully created for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(200).json({ success: true, message: "Assignment request created successfully.", data: result });
        } catch (error) {
            logger.error("Error in requestMemberAssignment controller", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    };

    // CANCEL REQUEST TO ASSIGN MEMBER 
    cancelMyAssignmentRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.id;
            logger.info(`Trainer ID ${trainerId} attempting to cancel assignment request`);

            if (!trainerId) {
                logger.warn("Cancel assignment request failed: Unauthorized access, missing trainer ID");
                return res.status(401).json({ success: false, message: "Unauthorized access." });
            }

            const { memberPublicId, gymId } = req.body;
            logger.info(`Trainer ID ${trainerId} cancelling assignment request for member publicId: ${memberPublicId} in gym ID: ${gymId}`);

            await trainerService.cancelMyAssignmentRequest(memberPublicId, trainerId, gymId);

            logger.info(`Assignment request successfully cancelled for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(200).json({ success: true, message: "Assignment request cancelled successfully." });
        } catch (error) {
            logger.error("Error in cancelMyAssignmentRequest controller", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    };

    // GET MEMBER'S ASSIGNMENT STATUS 
    getMembersByStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.id;
            logger.info(`Trainer ID ${trainerId} fetching members by assignment status`);

            if (!trainerId) {
                logger.warn("Get members by status failed: Unauthorized access, missing trainer ID");
                return res.status(401).json({ success: false, message: "Unauthorized access." });
            }

            const gymId = req.params.gymId as string;
            const { status } = req.query as { status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED' };
            logger.info(`Trainer ID ${trainerId} fetching members with status '${status}' for gym ID: ${gymId}`);

            const members = await trainerService.getMembersByStatus(trainerId, gymId, status);

            logger.info(`Successfully fetched ${members.length} members with status '${status}' for trainer ID: ${trainerId}`);
            return res.status(200).json({ success: true, data: members });
        } catch (error) {
            logger.error("Error in getMembersByStatus controller", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    };

    // GET MEMBER'S DETAIL ASSIGNED
    getAssignedMemberDetailController = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.id;
            logger.info(`Trainer ID ${trainerId} fetching assigned member details`);

            if (!trainerId) {
                logger.warn("Get assigned member detail failed: Unauthorized access, missing trainer ID");
                return res.status(401).json({ success: false, message: "Unauthorized access." });
            }

            const memberPublicId = req.params.memberPublicId as string;
            logger.info(`Trainer ID ${trainerId} fetching details for member publicId: ${memberPublicId}`);

            const member = await trainerService.getMemberDetail(trainerId, memberPublicId);

            if (!member) {
                logger.warn(`Get assigned member detail failed: Member not found or unauthorized access for member publicId: ${memberPublicId} and trainer ID: ${trainerId}`);
                return res.status(404).json({ success: false, message: "Member not found or you do not have permission to access this member." });
            }

            logger.info(`Successfully fetched details for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(200).json({ success: true, data: member });
        } catch (error) {
            logger.error("Error in getAssignedMemberDetailController controller", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    };

    // ADD MEASUREMENT DATAS TO ASSIGNED MEMBERS
    addMemberMeasurement = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.id;
            logger.info(`Trainer ID ${trainerId} attempting to add measurement for member`);

            if (!trainerId) {
                logger.warn("Add member measurement failed: Unauthorized access, missing trainer ID");
                return res.status(401).json({ success: false, message: "Unauthorized access." });
            }

            const memberPublicId = req.params.memberPublicId as string;
            const measurementDto = req.body;
            logger.info(`Trainer ID ${trainerId} adding measurement for member publicId: ${memberPublicId}`);

            const measurement = await trainerService.addMemberMeasurement(trainerId, memberPublicId, measurementDto);

            logger.info(`Measurement successfully added for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(201).json({ success: true, message: "Measurement added successfully.", data: measurement });
        } catch (error) {
            logger.error("Error in addMemberMeasurement controller", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    };

    // GET MEASUREMENT DATAS FROM ASSIGNED MEMBERS
    getMemberMeasurements = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.id;
            logger.info(`Trainer ID ${trainerId} fetching measurements for member`);

            if (!trainerId) {
                logger.warn("Get member measurements failed: Unauthorized access, missing trainer ID");
                return res.status(401).json({ success: false, message: "Unauthorized access." });
            }

            const memberPublicId = req.params.memberPublicId as string;
            logger.info(`Trainer ID ${trainerId} fetching measurements for member publicId: ${memberPublicId}`);

            const measurements = await trainerService.getMemberMeasurements(trainerId, memberPublicId);

            logger.info(`Successfully fetched measurements for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(200).json({ success: true, data: measurements });
        } catch (error) {
            logger.error("Error in getMemberMeasurements controller", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    };

    // DELETE MEMBER'S MEASUREMENT BY PUBLIC ID
    deleteMemberMeasurement = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.id;
            logger.info(`Trainer ID ${trainerId} attempting to delete member measurement`);

            if (!trainerId) {
                logger.warn("Delete member measurement failed: Unauthorized access, missing trainer ID");
                return res.status(401).json({ success: false, message: "Unauthorized access." });
            }

            const memberPublicId = req.params.memberPublicId as string;
            const measurementPublicId = req.params.measurementPublicId as string;

            if (!measurementPublicId) {
                logger.warn(`Delete member measurement failed: Measurement ID is required for member publicId: ${memberPublicId} and trainer ID: ${trainerId}`);
                return res.status(400).json({ success: false, message: "Measurement ID is required." });
            }

            logger.info(`Trainer ID ${trainerId} deleting measurement publicId: ${measurementPublicId} for member publicId: ${memberPublicId}`);

            await trainerService.deleteMemberMeasurement(trainerId, memberPublicId, measurementPublicId);

            logger.info(`Measurement successfully deleted: ${measurementPublicId} for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(200).json({ success: true, message: "Measurement deleted successfully." });
        } catch (error) {
            logger.error("Error in deleteMemberMeasurement controller", { error: error instanceof Error ? error.message : error });
            next(error);
        }
    };
}