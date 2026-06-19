/**
 * Error Handler Utility
 * Centralized error handling for the application
 * Follows MVC pattern: Utils = Helper Functions
 */

// Custom error classes
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class DatabaseError extends AppError {
  constructor(message) {
    super(message, 500);
    this.name = 'DatabaseError';
  }
}

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Default error
  let error = { ...err };
  error.message = err.message;

  // Handle specific error types
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  if (err instanceof DatabaseError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  // Handle PostgreSQL specific errors
  if (err.code === '23502') { // Not null violation
    return res.status(400).json({
      success: false,
      error: 'Required field is missing'
    });
  }

  if (err.code === '23505') { // Unique violation
    return res.status(400).json({
      success: false,
      error: 'Duplicate entry found'
    });
  }

  if (err.code === '22P02') { // Invalid input syntax
    return res.status(400).json({
      success: false,
      error: 'Invalid data type provided'
    });
  }

  if (err.code === '42703') { // Undefined column
    return res.status(400).json({
      success: false,
      error: 'Invalid field name'
    });
  }

  // Handle unknown errors
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({
    success: false,
    error: message
  });
};

// Async wrapper to avoid try-catch blocks
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};