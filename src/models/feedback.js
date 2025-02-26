const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
// Định nghĩa các loại feedback
const typeFeedback = {
  CONTRIBUTION: 'contribute',
  ERROR_REPORT: 'errorReport',
  FEEDBACK: 'feedback',
  OTHER: 'other',
};

// Định nghĩa schema cho feedback
const feedbackSchema = new Schema(
  {
    _id: Number,
    type: { type: String, enum: Object.values(typeFeedback), required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, feedbackSchema, 'feedback');
feedbackSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

// Tạo mô hình Feedback
const Feedback = model('feedback', feedbackSchema);

module.exports = Feedback;
