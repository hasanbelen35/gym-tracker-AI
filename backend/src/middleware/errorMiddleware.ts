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

  private static isValidString(value: unknown): value is string {
    return typeof value === 'string' && value.trim() !== '' && value !== 'undefined';
  }

  // GYM ID CONTROL (JWT'den gelir)
  static assertGym(gymId: unknown): asserts gymId is number {
    if (!gymId || typeof gymId !== 'number') {
      throw new AppError(401, 'Kimlik doğrulama hatası: Geçerli bir salon oturumu bulunamadı.');
    }
  }

  // TRAINER ID CONTROL (JWT'den gelir)
  static assertTrainerId(trainerId: unknown): asserts trainerId is number {
    if (!trainerId || typeof trainerId !== 'number') {
      throw new AppError(401, 'Kimlik doğrulama hatası: Geçerli bir eğitmen oturumu bulunamadı.');
    }
  }

  // MEMBER ID CONTROL
  static assertMemberId(memberId: unknown): asserts memberId is number {
    if (!memberId || typeof memberId !== 'number') {
      throw new AppError(400, 'Geçersiz istek: Üye kimlik bilgisi sağlanmadı.');
    }
  }

  // MEMBER PUBLIC ID CONTROL
  static assertMemberPublicId(memberPublicId: unknown): asserts memberPublicId is string {
    if (!AppError.isValidString(memberPublicId)) {
      throw new AppError(400, 'Geçersiz istek: Üye kimlik bilgisi sağlanmadı.');
    }
  }

  // TRAINER PUBLIC ID CONTROL
  static assertTrainerPublicId(trainerPublicId: unknown): asserts trainerPublicId is string {
    if (!AppError.isValidString(trainerPublicId)) {
      throw new AppError(400, 'Geçersiz istek: Eğitmen kimlik bilgisi sağlanmadı.');
    }
  }

  // PROGRAM PUBLIC ID CONTROL
  static assertProgramPublicId(programPublicId: unknown): asserts programPublicId is string {
    if (!AppError.isValidString(programPublicId)) {
      throw new AppError(400, 'Geçersiz istek: Program kimlik bilgisi sağlanmadı.');
    }
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;

  const logMessage = `${err.message} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`;
  const logMeta = {
    stack: err.stack,
    params: req.params,
    query: req.query,
  };

  if (statusCode >= 500) {
    logger.error(logMessage, logMeta);
  } else {
    logger.warn(logMessage, logMeta);
  }

  res.status(statusCode).json({
    success: false,
    message: isAppError
      ? err.message
      : 'Sunucu tarafında beklenmeyen bir hata oluştu.',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};