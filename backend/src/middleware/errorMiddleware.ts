import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';


export class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;

    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // GYM ID CONTROL
  static assertGym(gymId: number | undefined | null): void {
    if (!gymId) {
      throw new AppError(401, 'Kimlik doğrulama hatası: Geçerli bir salon oturumu bulunamadı.');
    }
  }

  // MEMBER PUBLIC ID CONTROL
  static assertMemberPublicId(memberPublicId: string | undefined | null): void {
    if (!memberPublicId) {
      throw new AppError(400, 'Geçersiz istek: Üye kimlik bilgisi sağlanmadı.');
    }
  }
  // MEMBER  ID CONTROL
  static assertMemberId(memberId: number | undefined | null): void {
    if (!memberId) {
      throw new AppError(400, 'Geçersiz istek: Üye kimlik bilgisi sağlanmadı.');
    }
  }

  // TRAINER PUBLIC ID CONTROL
  static assertTrainerPublicId(trainerPublicId: string | undefined | null): asserts trainerPublicId is string {
    if (!trainerPublicId || typeof trainerPublicId !== "string" || trainerPublicId.trim() === "" || trainerPublicId === "undefined") {
      throw new AppError(400, "Geçersiz istek: Eğitmen kimlik bilgisi sağlanmadı.");
    }
  }

  // TRAINER  ID CONTROL
  static assertTrainerId(trainerId: number | undefined | null): void {
    if (!trainerId) {
      throw new AppError(400, 'Geçersiz istek: Üye kimlik bilgisi sağlanmadı.');
    }
  }
}





export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  logger.error(`${err.message} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`, {
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Sunucu tarafında beklenmeyen bir hata oluştu.',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};