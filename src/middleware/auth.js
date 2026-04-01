const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

/**
 * Middleware to authenticate requests using JWT.
 * Attaches the authenticated user to `req.user`.
 */
const authenticate = catchAsync(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError('Authentication required. No token provided.', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Find user by ID from token payload
    const user = await User.findById(decoded.id).select('-password'); // Exclude password
    if (!user) {
      throw new ApiError('User not found or token is invalid.', 401);
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError('Invalid token. Please log in again.', 401);
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError('Token expired. Please log in again.', 401);
    }
    throw error; // Re-throw other errors
  }
});

module.exports = authenticate;
