const ApiError = require('../utils/apiError');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Global error handling middleware.
 * @param {Error} err - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // If it's not an instance of ApiError, convert it to one
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong.';
    error = new ApiError(message, statusCode);
  }

  // Handle Mongoose CastError (e.g., invalid ID format)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    error = new ApiError(`Resource not found with ID of ${err.value}`, 404);
  }

  // Handle Mongoose duplicate key error (e.g., unique email)
  if (err.code === 11000) {
    const value = Object.keys(err.keyValue);
    error = new ApiError(`Duplicate field value: ${value}. Please use another value.`, 400);
  }

  // Handle Joi validation errors (if not caught by validate middleware)
  if (err.isJoi) {
    error = new ApiError(`Validation failed: ${err.details.map(d => d.message).join(', ')}`, 400);
  }

  // Log the error in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  errorResponse(res, error.statusCode, error.message);
};

module.exports = {
  errorHandler,
};
