const dashboardService = require('../services/dashboard.service');
const { successResponse } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * Get a summary of financial data (total income, expenses, net balance).
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getSummary = catchAsync(async (req, res) => {
  const summary = await dashboardService.getFinancialSummary();
  successResponse(res, 200, 'Financial summary retrieved successfully.', summary);
});

/**
 * Get a breakdown of income and expenses by category.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getCategoryBreakdown = catchAsync(async (req, res) => {
  const breakdown = await dashboardService.getCategoryBreakdown();
  successResponse(res, 200, 'Category breakdown retrieved successfully.', breakdown);
});

/**
 * Get monthly income and expense trends.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getMonthlyTrends = catchAsync(async (req, res) => {
  const trends = await dashboardService.getMonthlyTrends();
  successResponse(res, 200, 'Monthly trends retrieved successfully.', trends);
});

/**
 * Get a list of recent financial transactions.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getRecentTransactions = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const recentTransactions = await dashboardService.getRecentTransactions(parseInt(page), parseInt(limit));
  successResponse(res, 200, 'Recent transactions retrieved successfully.', recentTransactions);
});

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentTransactions,
};
