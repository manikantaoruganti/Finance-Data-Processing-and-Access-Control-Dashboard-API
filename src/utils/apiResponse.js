/**
 * Sends a standardized success JSON response.
 * @param {Object} res - Express response object.
 * @param {number} statusCode - HTTP status code (e.g., 200, 201).
 * @param {string} message - A descriptive success message.
 * @param {Object} [data] - Optional data payload to include in the response.
 */
const successResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standardized error JSON response.
 * @param {Object} res - Express response object.
 * @param {number} statusCode - HTTP status code (e.g., 400, 401, 500).
 * @param {string} message - A descriptive error message.
 */
const errorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
