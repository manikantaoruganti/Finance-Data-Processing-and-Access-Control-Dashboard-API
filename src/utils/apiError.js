/**
 * Custom error class for API-specific errors.
 * Extends Error to include a status code for HTTP responses.
 */
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Mark as operational error (expected errors)

    // Capture stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
