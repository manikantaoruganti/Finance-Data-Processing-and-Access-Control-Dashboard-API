const recordService = require('../services/record.service');
const { successResponse } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * Create a new financial record.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const createRecord = catchAsync(async (req, res) => {
  const recordData = { ...req.body, createdBy: req.user.id };
  const record = await recordService.createRecord(recordData);
  successResponse(res, 201, 'Financial record created successfully.', record);
});

/**
 * Get a single financial record by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getRecord = catchAsync(async (req, res) => {
  const { id } = req.params;
  const record = await recordService.getRecordById(id);
  successResponse(res, 200, 'Financial record retrieved successfully.', record);
});

/**
 * List financial records with filtering and pagination.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const listRecords = catchAsync(async (req, res) => {
  const { category, type, startDate, endDate, page = 1, limit = 10 } = req.query;
  const filters = { category, type, startDate, endDate };
  const records = await recordService.listRecords(filters, parseInt(page), parseInt(limit));
  successResponse(res, 200, 'Financial records retrieved successfully.', records);
});

/**
 * Update a financial record by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const updateRecord = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedRecord = await recordService.updateRecord(id, req.body);
  successResponse(res, 200, 'Financial record updated successfully.', updatedRecord);
});

/**
 * Soft delete a financial record by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deleteRecord = catchAsync(async (req, res) => {
  const { id } = req.params;
  await recordService.softDeleteRecord(id);
  successResponse(res, 200, 'Financial record soft-deleted successfully.');
});

module.exports = {
  createRecord,
  getRecord,
  listRecords,
  updateRecord,
  deleteRecord,
};
