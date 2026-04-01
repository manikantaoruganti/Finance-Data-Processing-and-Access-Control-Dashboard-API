const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const config = require('../config');
const { USER_ROLES } = require('../utils/constants');

/**
 * Generates a JWT token for a given user ID.
 * @param {string} userId - The ID of the user.
 * @returns {string} The generated JWT token.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

/**
 * Registers a new user.
 * @param {string} name - User's name.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @param {string} [role=USER_ROLES.VIEWER] - User's role. Defaults to 'viewer'.
 * @returns {Object} The created user object (without password).
 * @throws {ApiError} If email already exists.
 */
const registerUser = async (name, email, password, role = USER_ROLES.VIEWER) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError('Email already registered.', 400);
  }

  const user = await User.create({ name, email, password, role });

  // Return user without password
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

/**
 * Logs in a user.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Object} An object containing the user and a JWT token.
 * @throws {ApiError} If invalid credentials.
 */
const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password'); // Select password for comparison

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError('Invalid email or password.', 401);
  }

  if (user.status === 'inactive') {
    throw new ApiError('Your account is inactive. Please contact an administrator.', 403);
  }

  const token = generateToken(user._id);

  // Return user without password
  const userObject = user.toObject();
  delete userObject.password;
  return { user: userObject, token };
};

module.exports = {
  registerUser,
  loginUser,
  generateToken,
};
