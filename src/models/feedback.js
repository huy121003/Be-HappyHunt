const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
// Định nghĩa các loại feedback
const typeFeedback = {
  CONTRIBUTION: 'CONTRIBUTION',
  ERROR_REPORT: 'ERROR_REPORT',
  FEEDBACK: 'FEEDBACK',
  OTHER: 'OTHER',
};

// Định nghĩa schema cho feedback
const feedbackSchema = new Schema(
  {
    _id: Number,
    type: {
      type: String,
      enum: Object.values(typeFeedback),
      required: [true, 'Type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: [true, 'Title is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: [true, 'Content is required'],
    },
    images: { type: [String], default: [] },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, feedbackSchema, 'feedback');
feedbackSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

// Tạo mô hình Feedback
const Feedback = model('feedback', feedbackSchema);

module.exports = Feedback;
