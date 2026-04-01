const FinancialRecord = require('../models/FinancialRecord');
const ApiError = require('../utils/apiError');

/**
 * Creates a new financial record.
 * @param {Object} recordData - Data for the new record.
 * @returns {Object} The created financial record.
 */
const createRecord = async (recordData) => {
  const record = await FinancialRecord.create(recordData);
  return record;
};

/**
 * Retrieves a single financial record by its ID.
 * @param {string} recordId - The ID of the record to retrieve.
 * @returns {Object} The financial record.
 * @throws {ApiError} If the record is not found.
 */
const getRecordById = async (recordId) => {
  const record = await FinancialRecord.findById(recordId).populate('createdBy', 'name email');
  if (!record) {
    throw new ApiError('Financial record not found.', 404);
  }
  return record;
};

/**
 * Lists financial records with optional filtering and pagination.
 * @param {Object} filters - Object containing filter criteria (category, type, startDate, endDate).
 * @param {number} page - Current page number.
 * @param {number} limit - Number of records per page.
 * @returns {Object} An object containing records, current page, total pages, and total records.
 */
const listRecords = async (filters, page, limit) => {
  const query = {};

  if (filters.category) {
    query.category = { $regex: filters.category, $options: 'i' }; // Case-insensitive search
  }
  if (filters.type) {
    query.type = filters.type;
  }
  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.date.$lte = new Date(filters.endDate);
    }
  }

  const skip = (page - 1) * limit;

  const records = await FinancialRecord.find(query)
    .sort({ date: -1, createdAt: -1 }) // Sort by most recent date, then creation time
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'name email'); // Populate creator info

  const totalRecords = await FinancialRecord.countDocuments(query);

  return {
    records,
    currentPage: page,
    totalPages: Math.ceil(totalRecords / limit),
    totalRecords,
  };
};

/**
 * Updates an existing financial record.
 * @param {string} recordId - The ID of the record to update.
 * @param {Object} updateData - Data to update the record with.
 * @returns {Object} The updated financial record.
 * @throws {ApiError} If the record is not found.
 */
const updateRecord = async (recordId, updateData) => {
  const record = await FinancialRecord.findByIdAndUpdate(recordId, updateData, {
    new: true, // Return the updated document
    runValidators: true, // Run Mongoose validators on update
  });
  if (!record) {
    throw new ApiError('Financial record not found.', 404);
  }
  return record;
};

/**
 * Soft deletes a financial record by setting `isDeleted` to true.
 * @param {string} recordId - The ID of the record to soft delete.
 * @throws {ApiError} If the record is not found.
 */
const softDeleteRecord = async (recordId) => {
  const record = await FinancialRecord.findByIdAndUpdate(recordId, { isDeleted: true }, { new: true });
  if (!record) {
    throw new ApiError('Financial record not found.', 404);
  }
  // No need to return the record, just confirm deletion
};

module.exports = {
  createRecord,
  getRecordById,
  listRecords,
  updateRecord,
  softDeleteRecord,
};
