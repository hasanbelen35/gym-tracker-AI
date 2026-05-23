import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
  async registerGym(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.registerGym(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async loginGym(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.loginGym(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async registerMember(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.registerMember(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async loginMember(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.loginMember(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}