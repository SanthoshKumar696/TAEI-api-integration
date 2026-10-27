import dotenv from 'dotenv';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Load log directory from env or fallback to /logs folder at project root
const logDir = process.env.LOG_DIR || path.join(__dirname, '..', '..', 'logs');

// Ensure the log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Setup daily rotating log transport
const dailyRotateTransport = new transports.DailyRotateFile({
  filename: path.join(logDir, 'app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    dailyRotateTransport
  ]
});

export default logger;
