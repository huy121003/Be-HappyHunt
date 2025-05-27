const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const reportSchema = new Schema(
  {
    _id: Number,
    target: {
      type: Number,
      required: true,
    },
    targetType: {
      type: String,
      required: true,
      enum: ['account', 'post', 'review'],
    },

    title: { type: String, required: true, trim: true },
    reason: { type: String, required: true, trim: true },

    images: [{ type: String, default: [] }],
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SPAM'],
      required: true,
      default: 'PENDING',
    },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
    url: { type: String, default: '' },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, reportSchema, 'report');
reportSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Report = model('report', reportSchema);
module.exports = Report;
