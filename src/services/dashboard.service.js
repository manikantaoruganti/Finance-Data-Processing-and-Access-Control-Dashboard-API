const FinancialRecord = require('../models/FinancialRecord');
const { RECORD_TYPES } = require('../utils/constants');

/**
 * Calculates the total income, total expenses, and net balance.
 * @returns {Object} An object containing totalIncome, totalExpenses, and netBalance.
 */
const getFinancialSummary = async () => {
  const summary = await FinancialRecord.aggregate([
    {
      $group: {
        _id: null, // Group all documents
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ['$type', RECORD_TYPES.INCOME] }, '$amount', 0],
          },
        },
        totalExpenses: {
          $sum: {
            $cond: [{ $eq: ['$type', RECORD_TYPES.EXPENSE] }, '$amount', 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalIncome: 1,
        totalExpenses: 1,
        netBalance: { $subtract: ['$totalIncome', '$totalExpenses'] },
      },
    },
  ]);

  // If no records, return default 0 values
  return summary.length > 0 ? summary[0] : { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
};

/**
 * Provides a breakdown of income and expenses by category.
 * @returns {Array<Object>} An array of objects, each with category, totalIncome, and totalExpenses.
 */
const getCategoryBreakdown = async () => {
  const breakdown = await FinancialRecord.aggregate([
    {
      $group: {
        _id: '$category',
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ['$type', RECORD_TYPES.INCOME] }, '$amount', 0],
          },
        },
        totalExpenses: {
          $sum: {
            $cond: [{ $eq: ['$type', RECORD_TYPES.EXPENSE] }, '$amount', 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        totalIncome: 1,
        totalExpenses: 1,
      },
    },
    {
      $sort: { category: 1 },
    },
  ]);
  return breakdown;
};

/**
 * Aggregates monthly income and expense trends.
 * @returns {Array<Object>} An array of objects, each with year, month, totalIncome, and totalExpenses.
 */
const getMonthlyTrends = async () => {
  const trends = await FinancialRecord.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ['$type', RECORD_TYPES.INCOME] }, '$amount', 0],
          },
        },
        totalExpenses: {
          $sum: {
            $cond: [{ $eq: ['$type', RECORD_TYPES.EXPENSE] }, '$amount', 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        totalIncome: 1,
        totalExpenses: 1,
      },
    },
    {
      $sort: { year: 1, month: 1 },
    },
  ]);
  return trends;
};

/**
 * Retrieves a paginated list of recent financial transactions.
 * @param {number} page - The current page number.
 * @param {number} limit - The number of records per page.
 * @returns {Object} An object containing the recent transactions and pagination info.
 */
const getRecentTransactions = async (page, limit) => {
  const skip = (page - 1) * limit;

  const records = await FinancialRecord.find({})
    .sort({ date: -1, createdAt: -1 }) // Sort by most recent date, then creation time
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'name email'); // Populate creator info

  const totalRecords = await FinancialRecord.countDocuments({});

  return {
    records,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
    totalRecords,
  };
};

module.exports = {
  getFinancialSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentTransactions,
};
