const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { USER_ROLES } = require('../utils/constants');

const router = express.Router();

// Viewer can access summary
router.get('/summary', authenticate, authorize([USER_ROLES.VIEWER, USER_ROLES.ANALYST, USER_ROLES.ADMIN]), dashboardController.getSummary);

// Analyst and Admin can access detailed analytics
router.get('/category-breakdown', authenticate, authorize([USER_ROLES.ANALYST, USER_ROLES.ADMIN]), dashboardController.getCategoryBreakdown);
router.get('/monthly-trends', authenticate, authorize([USER_ROLES.ANALYST, USER_ROLES.ADMIN]), dashboardController.getMonthlyTrends);
router.get('/recent-transactions', authenticate, authorize([USER_ROLES.ANALYST, USER_ROLES.ADMIN]), dashboardController.getRecentTransactions);

module.exports = router;
