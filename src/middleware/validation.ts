import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/appError';

// User validation schemas
const createUserSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required'
    }),
  
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  phone: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  
  status: Joi.string()
    .valid('active', 'inactive')
    .default('active')
    .messages({
      'any.only': 'Status must be either active or inactive'
    })
});

const updateUserSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters'
    }),
  
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters'
    }),
  
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  
  phone: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  
  status: Joi.string()
    .valid('active', 'inactive')
    .optional()
    .messages({
      'any.only': 'Status must be either active or inactive'
    })
});

/**
 * Middleware to validate user creation data
 */
export const validateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { error, value } = createUserSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const validationErrors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validationErrors
    });
    return;
  }

  req.body = value;
  next();
};

/**
 * Middleware to validate user update data
 */
export const validateUserUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { error, value } = updateUserSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const validationErrors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validationErrors
    });
    return;
  }

  // Check if at least one field is provided for update
  if (Object.keys(value).length === 0) {
    res.status(400).json({
      success: false,
      error: 'At least one field must be provided for update'
    });
    return;
  }

  req.body = value;
  next();
};

/**
 * Middleware to validate user ID parameter
 */
export const validateUserId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  
  if (!id || id.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: 'User ID is required'
    });
    return;
  }

  next();
};