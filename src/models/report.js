const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const reportSchema = new Schema(
  {
    _id: Number,
    sender: { type: Number, ref: 'account', required: true },
    target: { type: Number, ref: 'account', required: true },
    targetType: { type: String, enum: ['account', 'post'], default: 'account' },
    title: { type: String, required: true, trim: true },
    reason: { type: String, required: true, trim: true },
    images: [{ type: String, default: [] }],
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      required: true,
    },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, reportSchema, 'report');
reportSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Report = model('report', reportSchema);
module.exports = Report;
