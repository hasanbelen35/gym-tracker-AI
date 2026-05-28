import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined = undefined;

  if (req.cookies?.auth_token) {
    token = req.cookies.auth_token;
  } 
  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ error: "No token provided or invalid format" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; role: string };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Only allow gym owners to access the route
export const authorizeGym = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "gym") {
    res.status(403).json({ error: "Access denied" });
    return;
  }
  next();
};

// Only allow members to access the route
export const authorizeMember = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "member") {
    res.status(403).json({ error: "Access denied" });
    return;
  }
  next();
};