const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');

const feedbackSchema = new Schema(
  {
    _id: Number,
    type: {
      type: String,
      enum: ['CONTRIBUTION', 'ERROR_REPORT', 'FEEDBACK', 'OTHER'],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, feedbackSchema, 'feedback');
feedbackSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Feedback = model('feedback', feedbackSchema);

module.exports = Feedback;
