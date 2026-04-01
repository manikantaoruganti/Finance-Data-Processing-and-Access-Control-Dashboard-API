const Joi = require('joi');
const ApiError = require('../utils/apiError');

/**
 * Middleware to validate request body, params, or query against a Joi schema.
 * @param {Object} schema - Joi schema object with keys for body, params, query.
 */
const validate = (schema) => (req, res, next) => {
  const validationOptions = {
    abortEarly: false, // Include all errors
    allowUnknown: true, // Allow unknown keys that are not in the schema
    stripUnknown: true, // Remove unknown keys from the validated data
  };

  const { error, value } = Joi.compile(schema).validate(req, validationOptions);

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return next(new ApiError(`Validation failed: ${errorMessage}`, 400));
  }

  // Replace req.body, req.params, req.query with validated values
  Object.assign(req, value);
  return next();
};

module.exports = validate;
