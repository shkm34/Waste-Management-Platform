import { Request, Response, NextFunction } from "express";

/**
 * Custom Error Class
 * Extends built-in Error with statusCode property
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes operational errors from programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handler Middleware
 * Catches all errors and sends consistent JSON response
 */

export const errorHandler = (
  err: AppError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default to 500 Internal Server Error if statusCode not set
  let statusCode = 500;
  let message = "Internal Server Error";

  // Check if it is our custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ValidatetionError") {
    // Handle Mongoose validation errors
    statusCode = 400;
    message = err.message;
  } else if (err.name === "CastError") {
    // Invalid MongoDB ObjectId
    statusCode = 400;
    message = "Invalid ID format";
  } else if ((err as any).code === 11000) {
    // Mongodb duplicate key error
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  //send error json response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors
 * Usage: asyncHandler(async (req, res) => { ... })
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
