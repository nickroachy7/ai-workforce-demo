const express = require('express');

// Middleware for JSON parsing
const jsonParser = express.json();

// Middleware for URL-encoded parsing
const urlEncodedParser = express.urlencoded({ extended: true });

// Email validation middleware
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// User validation middleware for POST/PUT requests
const validateUser = (req, res, next) => {
  const { name, email } = req.body;
  
  // Check if required fields are present
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required',
      errors: {
        name: !name ? 'Name is required' : null,
        email: !email ? 'Email is required' : null
      }
    });
  }
  
  // Validate name length
  if (name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters long'
    });
  }
  
  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }
  
  // Sanitize input
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  
  next();
};

// ID parameter validation middleware
const validateUserId = (req, res, next) => {
  const userId = req.params.id;
  
  if (!userId || isNaN(parseInt(userId))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    });
  }
  
  next();
};

// Error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error('API Error:', error);
  
  // Handle JSON parsing errors
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format'
    });
  }
  
  // Default error response
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

module.exports = {
  jsonParser,
  urlEncodedParser,
  validateUser,
  validateUserId,
  errorHandler
};