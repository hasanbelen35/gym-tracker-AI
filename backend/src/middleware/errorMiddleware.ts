import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

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