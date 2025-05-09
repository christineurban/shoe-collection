// Log levels enum
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

// Current log level - can be set via environment variable
const currentLogLevel = (process.env.LOG_LEVEL || 'INFO') as keyof typeof LogLevel;

// ANSI color codes for different log levels
const colors = {
  error: '\x1b[31m', // red
  warn: '\x1b[33m',  // yellow
  info: '\x1b[36m',  // cyan
  debug: '\x1b[90m', // gray
  reset: '\x1b[0m',  // reset
};

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor() {
    this.logLevel = LogLevel[currentLogLevel] || LogLevel.INFO;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private formatMessage(level: string, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : '';
    return `${timestamp} [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  public error(message: string, context?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(colors.error + this.formatMessage('ERROR', message, context) + colors.reset);
    }
  }

  public warn(message: string, context?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(colors.warn + this.formatMessage('WARN', message, context) + colors.reset);
    }
  }

  public info(message: string, context?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(colors.info + this.formatMessage('INFO', message, context) + colors.reset);
    }
  }

  public debug(message: string, context?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(colors.debug + this.formatMessage('DEBUG', message, context) + colors.reset);
    }
  }

  public group(label: string): void {
    console.group(colors.info + label + colors.reset);
  }

  public groupEnd(): void {
    console.groupEnd();
  }
}

export const logger = Logger.getInstance();
