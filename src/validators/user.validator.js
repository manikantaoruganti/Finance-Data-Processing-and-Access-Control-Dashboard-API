const Joi = require('joi');
const mongoose = require('mongoose');
const { USER_ROLES, USER_STATUSES } = require('../utils/constants');

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

const userIdSchema = Joi.object({
  params: Joi.object({
    id: JoiObjectId.objectId().required().messages({
      'any.required': 'User ID is required.',
    }),
  }),
});

const updateUserStatusSchema = Joi.object({
  params: Joi.object({
    id: JoiObjectId.objectId().required().messages({
      'any.required': 'User ID is required.',
    }),
  }),
  body: Joi.object({
    status: Joi.string().valid(...Object.values(USER_STATUSES)).required().messages({
      'any.only': `Status must be one of: ${Object.values(USER_STATUSES).join(', ')}.`,
      'any.required': 'Status is required.',
    }),
  }),
});

const updateUserRoleSchema = Joi.object({
  params: Joi.object({
    id: JoiObjectId.objectId().required().messages({
      'any.required': 'User ID is required.',
    }),
  }),
  body: Joi.object({
    role: Joi.string().valid(...Object.values(USER_ROLES)).required().messages({
      'any.only': `Role must be one of: ${Object.values(USER_ROLES).join(', ')}.`,
      'any.required': 'Role is required.',
    }),
  }),
});

module.exports = {
  userIdSchema,
  updateUserStatusSchema,
  updateUserRoleSchema,
};
