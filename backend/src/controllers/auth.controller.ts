import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { COOKIE_MAX_AGE, cookieOptions } from '../lib/cookie';
import { logger } from "../config/logger";

const authService = new AuthService();

export class AuthController {
  // ----------------------------------------------------- GYM METHODS -----------------------------------------------------

  // REGISTER GYM
  async registerGym(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("Received request to register a new gym");
      const data = req.body;
      const result = await authService.registerGym(data);
      logger.info("Gym successfully registered via controller");
      res.status(201).json(result);
    } catch (err) {
      logger.error("Error in registerGym controller", { error: err instanceof Error ? err.message : err });
      next(err);
    }
  }

  // LOGIN GYM
  async loginGym(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("Received request for gym login");
      const data = req.body;
      const { token, gym } = await authService.loginGym(data);

      res.cookie("auth_token", token, cookieOptions);
      logger.info("Gym successfully logged in, cookie set");
      res.json({ success: true, gym });
    } catch (err) {
      logger.error("Error in loginGym controller", { error: err instanceof Error ? err.message : err });
      next(err);
    }
  }

  // ----------------------------------------------------- MEMBER METHODS -----------------------------------------------------

  // REGISTER MEMBER
  async registerMember(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("Received request to register a new member");
      const data = req.body;
      const result = await authService.registerMember(data);
      
      logger.info("Member successfully registered via controller");
      res.status(201).json(result);
    } catch (err) {
      logger.error("Error in registerMember controller", { error: err instanceof Error ? err.message : err });
      console.log(err)
      next(err);
    }
  }

  // LOGIN MEMBER
  async loginMember(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("Received request for member login");
      const data = req.body;
      const { token, member } = await authService.loginMember(data);

      res.cookie("auth_token", token, cookieOptions);
      logger.info("Member successfully logged in, cookie set");
      res.json({ success: true, member });
    } catch (err) {
      logger.error("Error in loginMember controller", { error: err instanceof Error ? err.message : err });
      next(err);
    }
  }

  // ----------------------------------------------------- TRAINER METHODS -----------------------------------------------------

  // REGISTER TRAINER
  async registerTrainer(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("Received request to register a new trainer");
      const data = req.body;
      const result = await authService.registerTrainer(data);
      logger.info("Trainer successfully registered via controller");
      res.status(201).json(result);
    } catch (err) {
      logger.error("Error in registerTrainer controller", { error: err instanceof Error ? err.message : err });
      next(err);
    }
  }

  // LOGIN TRAINER
  async loginTrainer(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("Received request for trainer login");
      const data = req.body;
      const { token, trainer } = await authService.loginTrainer(data);

      res.cookie("auth_token", token, cookieOptions);
      logger.info("Trainer successfully logged in, cookie set");
      res.json({ success: true, trainer });
    } catch (err) {
      logger.error("Error in loginTrainer controller", { error: err instanceof Error ? err.message : err });
      next(err);
    }
  }

  // ------------------------------------------------------------------------------------------------------------------------------ 
  // LOGOUT 
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("Received request for user logout");
      // clear token from cookie
      res.clearCookie("auth_token", {
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      });

      logger.info("User successfully logged out, auth_token cookie cleared");
      return res.status(200).json({ success: true, message: "Successfully logout!" });
    } catch (err) {
      logger.error("Error in logout controller", { error: err instanceof Error ? err.message : err });
      next(err);
    }
  }
}