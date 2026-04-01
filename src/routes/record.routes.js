const express = require('express');
const recordController = require('../controllers/record.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createRecordSchema, updateRecordSchema, getRecordsSchema, recordIdSchema } = require('../validators/record.validator');
const { USER_ROLES } = require('../utils/constants');

const router = express.Router();

// Admin only: Create record
router.post('/', authenticate, authorize([USER_ROLES.ADMIN]), validate(createRecordSchema), recordController.createRecord);

// Analyst and Admin: List records with filters and pagination
router.get('/', authenticate, authorize([USER_ROLES.ANALYST, USER_ROLES.ADMIN]), validate(getRecordsSchema), recordController.listRecords);

// Analyst and Admin: Get single record
router.get('/:id', authenticate, authorize([USER_ROLES.ANALYST, USER_ROLES.ADMIN]), validate(recordIdSchema), recordController.getRecord);

// Admin only: Update record
router.patch('/:id', authenticate, authorize([USER_ROLES.ADMIN]), validate(updateRecordSchema), recordController.updateRecord);

// Admin only: Soft delete record
router.delete('/:id', authenticate, authorize([USER_ROLES.ADMIN]), validate(recordIdSchema), recordController.deleteRecord);

module.exports = router;
