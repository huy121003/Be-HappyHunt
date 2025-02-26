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
    title: { type: String, required: true },
    reason: { type: String, required: true },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, reportSchema, 'report');
reportSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Report = model('report', reportSchema);
module.exports = Report;
