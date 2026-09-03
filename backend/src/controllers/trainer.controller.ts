import { Response, NextFunction } from "express";
import { TrainerService } from "../services/trainer.service";
import { AuthRequest } from "../middleware/auth.middleware";

const trainerService = new TrainerService();

export class TrainerController {

    // SEND REQUEST TO ASSIGN MEMBER 
    requestMemberAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.id;

            if (!trainerId) {
                return res.status(401).json({ success: false, message: "Unauthorized access." });
            }

            const { memberPublicId, gymId } = req.body;
            const result = await trainerService.requestMemberAssignment(memberPublicId, trainerId, gymId);

            if (result.count === 0) {
                return res.status(404).json({ success: false, message: "Member not found or not in a valid state." });
            }

            return res.status(200).json({ success: true, message: "Assignment request created successfully.", data: result });
        } catch (error) {
            next(error);
        }
    };

    // CANCEL REQUEST TO ASSIGN MEMBER 
    cancelMyAssignmentRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.id;

            if (!trainerId) {
                return res.status(401).json({ success: false, message: "Unauthorized access." });
            }

            const { memberPublicId, gymId } = req.body;
            await trainerService.cancelMyAssignmentRequest(memberPublicId, trainerId, gymId);

            return res.status(200).json({ success: true, message: "Assignment request cancelled successfully." });
        } catch (error) {
            next(error);
        }
    };

    // GET MEMBER'S ASSIGNMENT STATUS 
    getMembersByStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.id;

            if (!trainerId) {
                return res.status(401).json({ success: false, message: "Unauthorized access." });
            }

            const gymId = req.params.gymId as string;
            const { status } = req.query as { status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED' };

            const members = await trainerService.getMembersByStatus(trainerId, gymId, status);

            return res.status(200).json({ success: true, data: members });
        } catch (error) {
            next(error);
        }
    };
    // GET MEMBER'S DETAIL ASSIGNED
    getAssignedMemberDetailController = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.id;

            if (!trainerId) {
                return res.status(401).json({ success: false, message: "Unauthorized access." });
            }

            const memberPublicId = req.params.memberPublicId as string;
            const member = await trainerService.getMemberDetail(trainerId, memberPublicId);

            if (!member) {
                return res.status(404).json({ success: false, message: "Member not found or you do not have permission to access this member." });
            }

            return res.status(200).json({ success: true, data: member });
        } catch (error) {
            next(error);
        }
    };
    // ADD MEASUREMENT DATAS TO ASSIGNED MEMBERS
    addMemberMeasurement = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.id;

            if (!trainerId) {
                return res.status(401).json({ success: false, message: "Unauthorized access." });
            }

            const memberPublicId = req.params.memberPublicId as string;
            const measurementDto = req.body;

            const measurement = await trainerService.addMemberMeasurement(trainerId, memberPublicId, measurementDto);

            return res.status(201).json({ success: true, message: "Measurement added successfully.", data: measurement });
        } catch (error) {
            next(error);
        }
    };
    
    // GET MEASUREMENT DATAS FROM ASSIGNED MEMBERS
    getMemberMeasurements = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user?.id;

            if (!trainerId) {
                return res.status(401).json({ success: false, message: "Unauthorized access." });
            }

            const memberPublicId = req.params.memberPublicId as string;
            const measurements = await trainerService.getMemberMeasurements(trainerId, memberPublicId);

            return res.status(200).json({ success: true, data: measurements });
        } catch (error) {
            next(error);
        }
    };
}