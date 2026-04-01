const mongoose = require('mongoose');
const { RECORD_TYPES } = require('../utils/constants');

const financialRecordSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required.'],
    min: [0.01, 'Amount must be greater than 0.'],
  },
  type: {
    type: String,
    enum: {
      values: Object.values(RECORD_TYPES),
      message: `Type must be one of: ${Object.values(RECORD_TYPES).join(', ')}`,
    },
    required: [true, 'Record type is required.'],
  },
  category: {
    type: String,
    required: [true, 'Category is required.'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Date is required.'],
  },
  note: {
    type: String,
    trim: true,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required.'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Ensure that soft-deleted records are generally excluded from queries
financialRecordSchema.pre(/^find/, function(next) {
  if (this.options.includeDeleted) {
    // If includeDeleted is true, don't filter
    return next();
  }
  this.where({ isDeleted: false });
  next();
});

const FinancialRecord = mongoose.model('FinancialRecord', financialRecordSchema);

module.exports = FinancialRecord;
