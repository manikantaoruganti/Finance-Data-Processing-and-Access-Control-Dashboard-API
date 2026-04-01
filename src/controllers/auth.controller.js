const authService = require('../services/auth.service');
const { successResponse } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * Register a new user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const register = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await authService.registerUser(name, email, password, role);
  successResponse(res, 201, 'User registered successfully.', user);
});

/**
 * Log in a user and generate a JWT token.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser(email, password);
  successResponse(res, 200, 'Logged in successfully.', { user, token });
});

module.exports = {
  register,
  login,
};
