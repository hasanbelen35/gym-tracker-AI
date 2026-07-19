import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { COOKIE_MAX_AGE, cookieOptions } from '../lib/cookie'
const authService = new AuthService();


export class AuthController {
  // ----------------------------------------------------- GYM METHODS -----------------------------------------------------

  // REGISTER GYM
  async registerGym(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const result = await authService.registerGym(data);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
  // LOGIN GYM
  async loginGym(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const { token, gym } = await authService.loginGym(data);

      res.cookie("auth_token", token, cookieOptions);
      res.json({ success: true, gym });
    } catch (err) {
      next(err);
    }
  }
  // ----------------------------------------------------- MEMBER METHODS -----------------------------------------------------

  // REGISTER MEMBER
  async registerMember(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const result = await authService.registerMember(data);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
  // LOGIN MEMBER
  async loginMember(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const { token, member } = await authService.loginMember(data);

      res.cookie("auth_token", token, cookieOptions);
      res.json({ success: true, member });
    } catch (err) {
      next(err);
    }
  }
  // ----------------------------------------------------- TRAINER METHODS -----------------------------------------------------

  // REGISTER TRAINER
  async registerTrainer(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const result = await authService.registerTrainer(data);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  // LOGIN TRAINER
  async loginTrainer(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const { token, trainer } = await authService.loginTrainer(data);

      res.cookie("auth_token", token, cookieOptions);
      res.json({ success: true, trainer });
    } catch (err) {
      next(err);
    }
  }
  // ------------------------------------------------------------------------------------------------------------------------------ 
  // LOGOUT 
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // clear token from cookie
      res.clearCookie("auth_token", {
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      });

      return res.status(200).json({ success: true, message: "Succesfully logout!" });
    } catch (err) {
      next(err);
    }
  }
}