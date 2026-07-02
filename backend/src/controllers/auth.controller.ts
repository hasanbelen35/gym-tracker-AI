import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

const COOKIE_MAX_AGE = Number(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: COOKIE_MAX_AGE,
  path: "/",
};

export class AuthController {
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