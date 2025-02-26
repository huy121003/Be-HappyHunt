const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const {
  Schema,
  model
} = mongoose;
const reportSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'account'
  },
  target: {
    type: Schema.Types.ObjectId,
    refPath: 'targetType'
  },
  targetType: {
    type: String,
    enum: ['account', 'post'],
    // Trùng khớp với tên mô hình
    default: 'account'
  },
  title: String,
  reason: String,
  images: [String],
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});
reportSchema.plugin(mongoose_delete, {
  overrideMethods: 'all'
});
const Report = model('report', reportSchema);
module.exports = Report;