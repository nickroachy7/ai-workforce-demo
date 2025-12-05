import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { config } from '../config';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let apiError: ApiError;

  // Convert different error types to ApiError
  if (error instanceof ApiError) {
    apiError = error;
  } else if (error.name === 'ValidationError') {
    // Mongoose validation error
    apiError = ApiError.badRequest('Validation failed', error.message);
  } else if (error.name === 'CastError') {
    // Mongoose cast error (invalid ObjectId)
    apiError = ApiError.badRequest('Invalid ID format');
  } else if (error.name === 'MongoError' && (error as any).code === 11000) {
    // MongoDB duplicate key error
    apiError = ApiError.conflict('Resource already exists');
  } else if (error.name === 'JsonWebTokenError') {
    apiError = ApiError.unauthorized('Invalid token');
  } else if (error.name === 'TokenExpiredError') {
    apiError = ApiError.unauthorized('Token expired');
  } else if (error.name === 'SyntaxError' && 'body' in error) {
    // JSON parsing error
    apiError = ApiError.badRequest('Invalid JSON format');
  } else {
    // Generic server error
    apiError = ApiError.internal('Something went wrong');
  }

  // Log error details (in production, use proper logging service)
  if (config.NODE_ENV === 'development') {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  } else {
    // In production, log without sensitive information
    console.error('Production error:', {
      message: apiError.message,
      statusCode: apiError.statusCode,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
      ...(apiError.isOperational && { operational: true })
    });
  }

  // Send error response
  res.status(apiError.statusCode).json(apiError.toJSON());
};

/**
 * 404 handler for unmatched routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const error = ApiError.notFound(`Route ${req.method} ${req.path} not found`);
  res.status(error.statusCode).json(error.toJSON());
};

/**
 * Async error wrapper to handle async route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};