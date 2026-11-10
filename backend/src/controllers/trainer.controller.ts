import { Response, NextFunction } from "express";
import { TrainerService } from "../services/trainer.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { logger } from "../config/logger";
import { CreateMeasurementType } from '../types/types';
import { AppError } from "../middleware/errorMiddleware";

const trainerService = new TrainerService();

export class TrainerController {
    // SEND REQUEST TO ASSIGN MEMBER 
    requestMemberAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user!.id;
            const { memberPublicId, gymId, gymPublicId } = req.body;

            const targetGym = gymPublicId || gymId;

            logger.info(`Trainer ID ${trainerId} requesting assignment for member publicId: ${memberPublicId}`);

            const updatedMember = await trainerService.requestMemberAssignment(memberPublicId, trainerId, targetGym);

            logger.info(`Assignment request successfully created for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(200).json({
                success: true,
                message: "Assignment request created successfully.",
                data: updatedMember,
            });
        } catch (error) {
            logger.error("Error in requestMemberAssignment controller", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    };

    // CANCEL REQUEST TO ASSIGN MEMBER 
    cancelMyAssignmentRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user!.id;
            const { memberPublicId, gymId, gymPublicId } = req.body;

            const targetGym = gymPublicId || gymId;

            logger.info(`Trainer ID ${trainerId} cancelling assignment request for member publicId: ${memberPublicId}`);

            const updatedMember = await trainerService.cancelMyAssignmentRequest(memberPublicId, trainerId, targetGym);

            logger.info(`Assignment request successfully cancelled for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(200).json({
                success: true,
                message: "Assignment request cancelled successfully.",
                data: updatedMember,
            });
        } catch (error) {
            logger.error("Error in cancelMyAssignmentRequest controller", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    };

    // GET MEMBER'S ASSIGNMENT STATUS 
    getMembersByStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user!.id;
            const gymId = req.params.gymId as string | undefined;
            const { status } = req.query as { status: 'PENDING' | 'ASSIGNED' | 'UNASSIGNED' };

            logger.info(`Trainer ID ${trainerId} fetching members with status '${status}'`);

            const members = await trainerService.getMembersByStatus(trainerId, gymId, status);

            logger.info(`Successfully fetched ${members.length} members with status '${status}' for trainer ID: ${trainerId}`);
            return res.status(200).json({
                success: true,
                data: members
            });
        } catch (error) {
            logger.error("Error in getMembersByStatus controller", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    };

    // GET MEMBER'S PROFILE DATA BY TRAINER CONTROLLER
    getAssignedMemberProfileController = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user!.id;
            const memberPublicId = String(req.params.memberPublicId || req.params.memberId || "");

            logger.info(`Trainer ID ${trainerId} fetching profile for member publicId: ${memberPublicId}`);

            const profile = await trainerService.getMemberProfile(trainerId, memberPublicId);

            logger.info(`Successfully fetched profile for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(200).json({
                success: true,
                data: profile
            });
        } catch (error) {
            logger.error("Error in getAssignedMemberProfileController controller", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    };

    // GET MEMBER'S MEASUREMENT PAGINATED DATA BY TRAINER CONTROLLER
    getAssignedMemberMeasurementsController = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user!.id;
            const memberPublicId = String(req.params.memberPublicId || req.params.memberId || "");
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            logger.info(`Trainer ID ${trainerId} fetching measurements (page: ${page}, limit: ${limit}) for member publicId: ${memberPublicId}`);

            const result = await trainerService.getMemberMeasurementsPaginated(trainerId, memberPublicId, page, limit);

            logger.info(`Successfully fetched measurements for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            logger.error("Error in getAssignedMemberMeasurementsController controller", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    };

    // GET MEMBER'S SESSION PAGINATED DATA BY TRAINER CONTROLLER
    getAssignedMemberSessionsController = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user!.id;
            const memberPublicId = String(req.params.memberPublicId || req.params.memberId || "");
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            logger.info(`Trainer ID ${trainerId} fetching sessions (page: ${page}, limit: ${limit}) for member publicId: ${memberPublicId}`);

            const result = await trainerService.getMemberSessionsPaginated(trainerId, memberPublicId, page, limit);

            logger.info(`Successfully fetched sessions for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            logger.error("Error in getAssignedMemberSessionsController controller", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    };

    // GET MEMBER'S PROGRAMS PAGINATED DATA BY TRAINER CONTROLLER
    getAssignedMemberProgramsController = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user!.id;
            const memberPublicId = String(req.params.memberPublicId || req.params.memberId || "");
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            logger.info(`Trainer ID ${trainerId} fetching programs (page: ${page}, limit: ${limit}) for member publicId: ${memberPublicId}`);

            const result = await trainerService.getMemberProgramsPaginated(trainerId, memberPublicId, page, limit);

            logger.info(`Successfully fetched programs for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            logger.error("Error in getAssignedMemberProgramsController controller", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    };

    // GET MEMBER'S WORKOUT LOGS PAGINATED DATA BY TRAINER CONTROLLER
    getAssignedMemberWorkoutLogsController = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user!.id;
            const memberPublicId = String(req.params.memberPublicId || req.params.memberId || "");
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            logger.info(`Trainer ID ${trainerId} fetching workout logs (page: ${page}, limit: ${limit}) for member publicId: ${memberPublicId}`);

            const result = await trainerService.getMemberWorkoutLogsPaginated(trainerId, memberPublicId, page, limit);

            logger.info(`Successfully fetched workout logs for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            logger.error("Error in getAssignedMemberWorkoutLogsController controller", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    };

    // ADD MEASUREMENT DATAS TO ASSIGNED MEMBERS
    addMemberMeasurement = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user!.id;
            const memberPublicId = String(req.params.memberPublicId || req.params.memberId || "");

            logger.info(`Trainer ID ${trainerId} adding measurement for member publicId: ${memberPublicId}`);

            const parseNumber = (val: any): number | undefined => {
                if (val === undefined || val === null || val === "") return undefined;
                const num = Number(val);
                return isNaN(num) ? undefined : num;
            };

            const {
                bodyFatRate,
                muscleMass,
                chest,
                waist,
                arm,
                hip,
                shoulder,
                photos,
                notes
            } = req.body;

            const measurementDto: CreateMeasurementType = {
                bodyFatRate: parseNumber(bodyFatRate),
                muscleMass: parseNumber(muscleMass),
                chest: parseNumber(chest),
                waist: parseNumber(waist),
                arm: parseNumber(arm),
                hip: parseNumber(hip),
                shoulder: parseNumber(shoulder),
                photos: Array.isArray(photos) ? photos : [],
                notes
            };

            const measurement = await trainerService.addMemberMeasurement(trainerId, memberPublicId, measurementDto);

            logger.info(`Measurement successfully added for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(201).json({
                success: true,
                message: "Measurement added successfully.",
                data: measurement
            });
        } catch (error) {
            logger.error("Error in addMemberMeasurement controller", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    };

    // GET MEASUREMENT DATAS FROM ASSIGNED MEMBERS
    getMemberMeasurements = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user!.id;
            const memberPublicId = String(req.params.memberPublicId || req.params.memberId || "");
            
            logger.info(`Trainer ID ${trainerId} fetching measurements for member publicId: ${memberPublicId}`);

            const measurements = await trainerService.getMemberMeasurements(trainerId, memberPublicId);

            logger.info(`Successfully fetched measurements for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(200).json({ success: true, data: measurements });
        } catch (error) {
            logger.error("Error in getMemberMeasurements controller", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    };

    // DELETE MEMBER'S MEASUREMENT BY PUBLIC ID
    deleteMemberMeasurement = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user!.id;
            const memberPublicId = String(req.params.memberPublicId || req.params.memberId || "");
            const measurementPublicId = String(req.params.measurementPublicId || "");

            if (!measurementPublicId) {
                logger.warn(`Delete member measurement failed: Measurement ID is required for member publicId: ${memberPublicId} and trainer ID: ${trainerId}`);
                throw new AppError(400, "Measurement ID is required.");
            }

            logger.info(`Trainer ID ${trainerId} deleting measurement publicId: ${measurementPublicId} for member publicId: ${memberPublicId}`);

            await trainerService.deleteMemberMeasurement(trainerId, memberPublicId, measurementPublicId);

            logger.info(`Measurement successfully deleted: ${measurementPublicId} for member publicId: ${memberPublicId} by trainer ID: ${trainerId}`);
            return res.status(200).json({ success: true, message: "Measurement deleted successfully." });
        } catch (error) {
            logger.error("Error in deleteMemberMeasurement controller", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    };

    // COMPLETE TRAINER PROFILE CONTROLLER
    completeTrainerProfileController = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user!.id;
            logger.info(`Trainer ID ${trainerId} attempting to complete profile`);

            const { phone, gender, age, height, weight, avatarUrl } = req.body;

            const updatedProfile = await trainerService.completeTrainerProfileService(trainerId, {
                phone,
                gender,
                age,
                height,
                weight,
                avatarUrl,
            });

            logger.info(`Successfully completed profile for trainer ID: ${trainerId}`);
            return res.status(200).json({
                success: true,
                message: "Profile successfully completed.",
                data: updatedProfile,
            });
        } catch (error) {
            logger.error("Error in completeTrainerProfileController", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    };

    // GET TRAINER'S DETAILED PROFILE DATA BY ID 
    getTrainerProfileController = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user!.id;
            logger.info(`Trainer ID ${trainerId} attempting to fetch profile`);

            const profile = await trainerService.getTrainerProfileWithGym(trainerId);

            logger.info(`Successfully fetched profile for trainer ID: ${trainerId}`);
            return res.status(200).json({
                success: true,
                message: "Profile successfully fetched.",
                data: profile,
            });
        } catch (error) {
            logger.error("Error in getTrainerProfileController", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    };

    // UPDATE TRAINER'S DETAILED PROFILE DATA
    updateTrainerProfileController = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user!.id;
            logger.info(`Trainer ID ${trainerId} attempting to update profile`);

            const updateData = {
                name: req.body.name,
                surname: req.body.surname,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                height: req.body.height,
                weight: req.body.weight,
            };

            const updatedProfile = await trainerService.updateTrainerProfileService(trainerId, updateData);

            logger.info(`Successfully updated profile for trainer ID: ${trainerId}`);

            return res.status(200).json({
                success: true,
                message: "Profile successfully updated.",
                data: updatedProfile,
            });
        } catch (error) {
            logger.error("Error in updateTrainerProfileController", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    };

    // ACTIVATE ARCHIVED MEMBER PROGRAM CONTROLLER
    activateProgramController = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const trainerId = req.user!.id;
            const { programPublicId } = req.params;

            AppError.assertTrainerId(trainerId);
            AppError.assertProgramPublicId(programPublicId);

            const activatedProgram = await trainerService.activateProgramService(trainerId, programPublicId);

            return res.status(200).json({
                success: true,
                message: "Program successfully activated.",
                data: activatedProgram,
            });
        } catch (error) {
            logger.error("Error in activateProgramController", {
                error: error instanceof Error ? error.message : error
            });
            next(error);
        }
    };
}