const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { USER_ROLES, USER_STATUSES } = require('../utils/constants');

/**
 * Lists all users in the system.
 * @returns {Array<Object>} An array of user objects (without passwords).
 */
const listUsers = async () => {
  const users = await User.find().select('-password'); // Exclude password
  return users;
};

/**
 * Updates the status of a user.
 * @param {string} userId - The ID of the user to update.
 * @param {string} status - The new status ('active' or 'inactive').
 * @returns {Object} The updated user object (without password).
 * @throws {ApiError} If user not found or invalid status.
 */
const updateUserStatus = async (userId, status) => {
  if (!Object.values(USER_STATUSES).includes(status)) {
    throw new ApiError(`Invalid status: ${status}. Must be 'active' or 'inactive'.`, 400);
  }

  const user = await User.findByIdAndUpdate(userId, { status }, { new: true, runValidators: true }).select('-password');
  if (!user) {
    throw new ApiError('User not found.', 404);
  }
  return user;
};

/**
 * Updates the role of a user.
 * @param {string} userId - The ID of the user to update.
 * @param {string} role - The new role ('viewer', 'analyst', 'admin').
 * @returns {Object} The updated user object (without password).
 * @throws {ApiError} If user not found or invalid role.
 */
const updateUserRole = async (userId, role) => {
  if (!Object.values(USER_ROLES).includes(role)) {
    throw new ApiError(`Invalid role: ${role}. Must be 'viewer', 'analyst', or 'admin'.`, 400);
  }

  const user = await User.findByIdAndUpdate(userId, { role }, { new: true, runValidators: true }).select('-password');
  if (!user) {
    throw new ApiError('User not found.', 404);
  }
  return user;
};

module.exports = {
  listUsers,
  updateUserStatus,
  updateUserRole,
};
