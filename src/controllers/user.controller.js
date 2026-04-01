const userService = require('../services/user.service');
const { successResponse } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * List all users.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const listUsers = catchAsync(async (req, res) => {
  const users = await userService.listUsers();
  successResponse(res, 200, 'Users retrieved successfully.', users);
});

/**
 * Update a user's status (active/inactive).
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const updateUserStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updatedUser = await userService.updateUserStatus(id, status);
  successResponse(res, 200, 'User status updated successfully.', updatedUser);
});

/**
 * Update a user's role.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const updateUserRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const updatedUser = await userService.updateUserRole(id, role);
  successResponse(res, 200, 'User role updated successfully.', updatedUser);
});

module.exports = {
  listUsers,
  updateUserStatus,
  updateUserRole,
};
