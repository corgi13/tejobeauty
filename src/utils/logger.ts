// utils/logger.ts - Utility za napredno logiranje
import fs from "fs";
import fs from "fs";
import path from "path";
import path from "path";
import { fileURLToPath } from "url";
// utils/logger.ts - Utility za konzistentno logiranje
import { fileURLToPath } from "url";

// Dohvati trenutni direktorij za ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log levels
export enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

class Logger {
  private logDir: string;
  private env: string;

  constructor() {
    this.env = process.env.NODE_ENV || "development";
    this.logDir = path.join(__dirname, "../../logs");

    // Osiguraj da logs direktorij postoji
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Log error message
   */
  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  /**
   * Log warning message
   */
  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }

  /**
   * Log info message
   */
  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }

  /**
   * Log debug message
   */
  debug(message: string, meta?: any): void {
    // Debug logove uključi samo u development modu
    if (this.env === "development") {
      this.log(LogLevel.DEBUG, message, meta);
    }
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] ${level}: ${message}`;

    if (meta) {
      logMessage += ` ${JSON.stringify(meta)}`;
    }

    // Log u konzolu
    this.consoleLog(level, logMessage);

    // Log u datoteku
    this.fileLog(level, logMessage);
  }

  /**
   * Console logger with colors
   */
  private consoleLog(level: LogLevel, message: string): void {
    switch (level) {
      case LogLevel.ERROR:
        console.error(`\x1b[31m${message}\x1b[0m`); // Red
        break;
      case LogLevel.WARN:
        console.warn(`\x1b[33m${message}\x1b[0m`); // Yellow
        break;
      case LogLevel.INFO:
        console.info(`\x1b[36m${message}\x1b[0m`); // Cyan
        break;
      case LogLevel.DEBUG:
        console.debug(`\x1b[90m${message}\x1b[0m`); // Grey
        break;
      default:
        console.log(message);
    }
  }

  /**
   * File logger
   */
  private fileLog(level: LogLevel, message: string): void {
    const date = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const logFile = path.join(this.logDir, `${date}.log`);

    fs.appendFileSync(logFile, `${message}\n`);

    // Za errore, logiraj i u posebnu datoteku
    if (level === LogLevel.ERROR) {
      const errorLogFile = path.join(this.logDir, "errors.log");
      fs.appendFileSync(errorLogFile, `${message}\n`);
    }
  }
}

export const logger = new Logger();
export default logger;
// Dohvati trenutni direktorij za ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log levels
export enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

class Logger {
  private logDir: string;
  private env: string;

  constructor() {
    this.env = process.env.NODE_ENV || "development";
    this.logDir = path.join(__dirname, "../../logs");

    // Osiguraj da logs direktorij postoji
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Log error message
   */
  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  /**
   * Log warning message
   */
  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }

  /**
   * Log info message
   */
  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }

  /**
   * Log debug message
   */
  debug(message: string, meta?: any): void {
    // Debug logove uključi samo u development modu
    if (this.env === "development") {
      this.log(LogLevel.DEBUG, message, meta);
    }
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] ${level}: ${message}`;

    if (meta) {
      logMessage += ` ${JSON.stringify(meta)}`;
    }

    // Log u konzolu
    this.consoleLog(level, logMessage);

    // Log u datoteku
    this.fileLog(level, logMessage);
  }

  /**
   * Console logger with colors
   */
  private consoleLog(level: LogLevel, message: string): void {
    switch (level) {
      case LogLevel.ERROR:
        console.error(`\x1b[31m${message}\x1b[0m`); // Red
        break;
      case LogLevel.WARN:
        console.warn(`\x1b[33m${message}\x1b[0m`); // Yellow
        break;
      case LogLevel.INFO:
        console.info(`\x1b[36m${message}\x1b[0m`); // Cyan
        break;
      case LogLevel.DEBUG:
        console.debug(`\x1b[90m${message}\x1b[0m`); // Grey
        break;
      default:
        console.log(message);
    }
  }

  /**
   * File logger
   */
  private fileLog(level: LogLevel, message: string): void {
    const date = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const logFile = path.join(this.logDir, `${date}.log`);

    fs.appendFileSync(logFile, `${message}\n`);

    // Za errore, logiraj i u posebnu datoteku
    if (level === LogLevel.ERROR) {
      const errorLogFile = path.join(this.logDir, "errors.log");
      fs.appendFileSync(errorLogFile, `${message}\n`);
    }
  }
}

export const logger = new Logger();
export default logger;
