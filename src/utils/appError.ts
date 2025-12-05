/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Creates a new AppError for bad requests
 */
export const createBadRequestError = (message: string = 'Bad Request'): AppError => {
  return new AppError(message, 400);
};

/**
 * Creates a new AppError for unauthorized requests
 */
export const createUnauthorizedError = (message: string = 'Unauthorized'): AppError => {
  return new AppError(message, 401);
};

/**
 * Creates a new AppError for forbidden requests
 */
export const createForbiddenError = (message: string = 'Forbidden'): AppError => {
  return new AppError(message, 403);
};

/**
 * Creates a new AppError for not found errors
 */
export const createNotFoundError = (message: string = 'Resource not found'): AppError => {
  return new AppError(message, 404);
};

/**
 * Creates a new AppError for conflict errors
 */
export const createConflictError = (message: string = 'Conflict'): AppError => {
  return new AppError(message, 409);
};

/**
 * Creates a new AppError for validation errors
 */
export const createValidationError = (message: string = 'Validation failed'): AppError => {
  return new AppError(message, 422);
};

/**
 * Creates a new AppError for internal server errors
 */
export const createInternalServerError = (message: string = 'Internal Server Error'): AppError => {
  return new AppError(message, 500);
};