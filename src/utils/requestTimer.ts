import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Middleware to log each API's start and end time
export const requestTimer = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint(); // High precision timer
  const startTime = new Date().toISOString();
  const requestId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  
  (req as any).requestId = requestId;

  logger.info(`[${requestId}] -  ${req.method} ${req.originalUrl} - Started at ${startTime}`);

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const endTime = new Date().toISOString();
    const durationMs = Number(end - start) / 1_000_000; // Convert nanoseconds to ms
    logger.info(`[${requestId}] - ${req.method} ${req.originalUrl} - Completed at ${endTime} - Duration: ${durationMs.toFixed(2)} ms`);
  });

  next();
};
