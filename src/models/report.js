const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const reportSchema = new Schema(
  {
    _id: Number,
    sender: {
      type: Number,
      ref: 'account',
      required: [true, 'Sender is required'],
    },
    target: {
      type: Number,
      ref: 'account',
      required: [true, 'Target is required'],
    },
    targetType: { type: String, enum: ['account', 'post'], default: 'account' },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: [true, 'Title is required '],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: [true, 'Reason is required'],
    },
    images: [{ type: String, default: [] }],
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      required: [true, 'Status is required'],
    },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, reportSchema, 'report');
reportSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Report = model('report', reportSchema);
module.exports = Report;
