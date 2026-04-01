const Joi = require('joi');
const mongoose = require('mongoose');
const { RECORD_TYPES } = require('../utils/constants');

// Custom Joi extension for ObjectId validation
const JoiObjectId = Joi.extend((joi) => ({
  type: 'objectId',
  base: joi.string(),
  messages: {
    'objectId.invalid': '{{#label}} must be a valid MongoDB ObjectId',
  },
  validate(value, helpers) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return { value, errors: helpers.error('objectId.invalid') };
    }
    return { value };
  },
}));

const createRecordSchema = Joi.object({
  body: Joi.object({
    amount: Joi.number().positive().required().messages({
      'number.base': 'Amount must be a number.',
      'number.positive': 'Amount must be greater than 0.',
      'any.required': 'Amount is required.',
    }),
    type: Joi.string().valid(...Object.values(RECORD_TYPES)).required().messages({
      'any.only': `Type must be one of: ${Object.values(RECORD_TYPES).join(', ')}.`,
      'any.required': 'Record type is required.',
    }),
    category: Joi.string().trim().min(1).max(50).required().messages({
      'string.empty': 'Category cannot be empty.',
      'string.min': 'Category must be at least 1 character long.',
      'string.max': 'Category cannot exceed 50 characters.',
      'any.required': 'Category is required.',
    }),
    date: Joi.date().iso().required().messages({
      'date.base': 'Date must be a valid date.',
      'date.iso': 'Date must be in ISO 8601 format (e.g., YYYY-MM-DD).',
      'any.required': 'Date is required.',
    }),
    note: Joi.string().trim().max(200).allow('').default('').messages({
      'string.max': 'Note cannot exceed 200 characters.',
    }),
  }),
});

const updateRecordSchema = Joi.object({
  params: Joi.object({
    id: JoiObjectId.objectId().required().messages({
      'any.required': 'Record ID is required.',
    }),
  }),
  body: Joi.object({
    amount: Joi.number().positive().messages({
      'number.base': 'Amount must be a number.',
      'number.positive': 'Amount must be greater than 0.',
    }),
    type: Joi.string().valid(...Object.values(RECORD_TYPES)).messages({
      'any.only': `Type must be one of: ${Object.values(RECORD_TYPES).join(', ')}.`,
    }),
    category: Joi.string().trim().min(1).max(50).messages({
      'string.empty': 'Category cannot be empty.',
      'string.min': 'Category must be at least 1 character long.',
      'string.max': 'Category cannot exceed 50 characters.',
    }),
    date: Joi.date().iso().messages({
      'date.base': 'Date must be a valid date.',
      'date.iso': 'Date must be in ISO 8601 format (e.g., YYYY-MM-DD).',
    }),
    note: Joi.string().trim().max(200).allow('').messages({
      'string.max': 'Note cannot exceed 200 characters.',
    }),
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update.',
  }),
});

const getRecordsSchema = Joi.object({
  query: Joi.object({
    category: Joi.string().trim().max(50).messages({
      'string.max': 'Category filter cannot exceed 50 characters.',
    }),
    type: Joi.string().valid(...Object.values(RECORD_TYPES)).messages({
      'any.only': `Type filter must be one of: ${Object.values(RECORD_TYPES).join(', ')}.`,
    }),
    startDate: Joi.date().iso().messages({
      'date.base': 'Start date filter must be a valid date.',
      'date.iso': 'Start date filter must be in ISO 8601 format (e.g., YYYY-MM-DD).',
    }),
    endDate: Joi.date().iso().messages({
      'date.base': 'End date filter must be a valid date.',
      'date.iso': 'End date filter must be in ISO 8601 format (e.g., YYYY-MM-DD).',
    }),
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number.',
      'number.integer': 'Page must be an integer.',
      'number.min': 'Page must be at least 1.',
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      'number.base': 'Limit must be a number.',
      'number.integer': 'Limit must be an integer.',
      'number.min': 'Limit must be at least 1.',
      'number.max': 'Limit cannot exceed 100.',
    }),
  }),
});

const recordIdSchema = Joi.object({
  params: Joi.object({
    id: JoiObjectId.objectId().required().messages({
      'any.required': 'Record ID is required.',
    }),
  }),
});

module.exports = {
  createRecordSchema,
  updateRecordSchema,
  getRecordsSchema,
  recordIdSchema,
};
