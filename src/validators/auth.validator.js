const Joi = require('joi');
const { USER_ROLES } = require('../utils/constants');

const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().min(3).max(100).required().messages({
      'string.empty': 'Name cannot be empty.',
      'string.min': 'Name must be at least 3 characters long.',
      'string.max': 'Name cannot exceed 100 characters.',
      'any.required': 'Name is required.',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email cannot be empty.',
      'string.email': 'Please enter a valid email address.',
      'any.required': 'Email is required.',
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password cannot be empty.',
      'string.min': 'Password must be at least 6 characters long.',
      'any.required': 'Password is required.',
    }),
    role: Joi.string().valid(...Object.values(USER_ROLES)).default(USER_ROLES.VIEWER).messages({
      'any.only': `Role must be one of: ${Object.values(USER_ROLES).join(', ')}.`,
    }),
  }),
});

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email cannot be empty.',
      'string.email': 'Please enter a valid email address.',
      'any.required': 'Email is required.',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password cannot be empty.',
      'any.required': 'Password is required.',
    }),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
