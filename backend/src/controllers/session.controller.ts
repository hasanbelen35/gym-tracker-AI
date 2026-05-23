import { Response, NextFunction } from "express";
import { SessionService } from "../services/session.service";
import { AuthRequest } from "../middleware/auth.middleware";

const sessionService = new SessionService();

export class SessionController {
  // Member checks in to the gym by scanning QR code
  async checkIn(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Member id comes from JWT token, gymId comes from QR code scan
      const memberId = req.user!.id;
      const { gymId } = req.body;
      const session = await sessionService.checkIn(memberId, gymId);
      res.status(201).json(session);
    } catch (err) {
      next(err);
    }
  }

  // Member checks out from the gym by scanning QR code again
  async checkOut(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const memberId = req.user!.id;
      const { gymId } = req.body;
      const session = await sessionService.checkOut(memberId, gymId);
      res.json(session);
    } catch (err) {
      next(err);
    }
  }

  // Get all sessions belonging to the authenticated member
  async getMemberSessions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const memberId = req.user!.id;
      const sessions = await sessionService.getMemberSessions(memberId);
      res.json(sessions);
    } catch (err) {
      next(err);
    }
  }

  // Get all sessions for the authenticated gym (gym owner only)
  async getGymSessions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const gymId = req.user!.id;
      const sessions = await sessionService.getGymSessions(gymId);
      res.json(sessions);
    } catch (err) {
      next(err);
    }
  }

  // Get only active (currently working out) sessions for the gym
  async getActiveGymSessions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const gymId = req.user!.id;
      const sessions = await sessionService.getActiveGymSessions(gymId);
      res.json(sessions);
    } catch (err) {
      next(err);
    }
  }
}