const ApiError = require('../utils/apiError');

/**
 * Middleware to authorize requests based on user roles.
 * @param {Array<string>} allowedRoles - An array of roles that are permitted to access the route.
 */
const authorize = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    // This should ideally be caught by the authentication middleware first
    throw new ApiError('User not authenticated.', 401);
  }

  if (!allowedRoles.includes(req.user.role)) {
    throw new ApiError('You do not have permission to perform this action.', 403);
  }

  next();
};

module.exports = authorize;
