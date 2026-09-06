import { Response, NextFunction } from "express";
import { SessionService } from "../services/session.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { logger } from "../config/logger";

const sessionService = new SessionService();

export class SessionController {
  // Member checks in to the gym by scanning QR code
  async checkIn(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Member id comes from JWT token, gymId comes from QR code scan
      const memberId = req.user!.id;
      const { gymId } = req.body;
      logger.info(`Member ID ${memberId} attempting check-in for gym ID: ${gymId}`);
      
      const session = await sessionService.checkIn(memberId, gymId);
      logger.info(`Session has started successfully for member ID: ${memberId}, session ID: ${session.id}`);
      
      res.status(201).json(session);
    } catch (err) {
      logger.error("Error in checkIn controller", { error: err instanceof Error ? err.message : err });
      next(err);
    }
  }

  // Member checks out from the gym by scanning QR code again
  async checkOut(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const memberId = req.user!.id;
      logger.info(`Member ID ${memberId} attempting check-out`);

      const session = await sessionService.checkOut(memberId);
      logger.info(`Session has ended successfully for member ID: ${memberId}, session ID: ${session.id}`);

      res.json(session);
    } catch (err) {
      logger.error("Error in checkOut controller", { error: err instanceof Error ? err.message : err });
      next(err);
    }
  }

  // Get all sessions belonging to the authenticated member
  async getMemberSessions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const memberId = req.user!.id;
      logger.info(`Fetching sessions for authenticated member ID: ${memberId}`);

      const sessions = await sessionService.getMemberSessions(memberId);
      logger.info(`Successfully fetched ${sessions.length} sessions for member ID: ${memberId}`);

      res.json(sessions);
    } catch (err) {
      logger.error("Error in getMemberSessions controller", { error: err instanceof Error ? err.message : err });
      next(err);
    }
  }

  // Get all sessions for the authenticated gym (gym owner only)
  async getGymSessions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const gymId = req.user!.id;
      logger.info(`Fetching all sessions for authenticated gym ID: ${gymId}`);

      const sessions = await sessionService.getGymSessions(gymId);
      logger.info(`Successfully fetched ${sessions.length} sessions for gym ID: ${gymId}`);

      res.json(sessions);
    } catch (err) {
      logger.error("Error in getGymSessions controller", { error: err instanceof Error ? err.message : err });
      next(err);
    }
  }

  // Get only active (currently working out) sessions for the gym
  async getActiveGymSessions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const gymId = req.user!.id;
      logger.info(`Fetching active sessions for authenticated gym ID: ${gymId}`);

      const sessions = await sessionService.getActiveGymSessions(gymId);
      logger.info(`Successfully fetched ${sessions.length} active sessions for gym ID: ${gymId}`);

      res.json(sessions);
    } catch (err) {
      logger.error("Error in getActiveGymSessions controller", { error: err instanceof Error ? err.message : err });
      next(err);
    }
  }
}