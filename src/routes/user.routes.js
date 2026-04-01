const express = require('express');
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { userIdSchema, updateUserStatusSchema, updateUserRoleSchema } = require('../validators/user.validator');
const { USER_ROLES } = require('../utils/constants');

const router = express.Router();

// Admin only: List all users
router.get('/', authenticate, authorize([USER_ROLES.ADMIN]), userController.listUsers);

// Admin only: Update user status
router.patch('/:id/status', authenticate, authorize([USER_ROLES.ADMIN]), validate(updateUserStatusSchema), userController.updateUserStatus);

// Admin only: Update user role
router.patch('/:id/role', authenticate, authorize([USER_ROLES.ADMIN]), validate(updateUserRoleSchema), userController.updateUserRole);

module.exports = router;
