const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const reportSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'Account' },
    target: { type: Schema.Types.ObjectId, refPath: 'targetType' },
    targetType: {
      type: String,
      enum: ['Account', 'Product'], // Trùng khớp với tên mô hình
      default: 'Account',
    },
    title: String,
    reason: String,
    images: [String],
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);
reportSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Report = model('report', reportSchema);
module.exports = Report;
