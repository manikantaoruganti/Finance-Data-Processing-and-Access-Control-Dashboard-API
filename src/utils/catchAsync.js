/**
 * A higher-order function to wrap async Express route handlers.
 * It catches any errors thrown by the async function and passes them to the Express error handling middleware.
 * This avoids repetitive try-catch blocks in every async controller function.
 * @param {Function} fn - The async Express route handler function (req, res, next).
 * @returns {Function} An Express middleware function.
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
