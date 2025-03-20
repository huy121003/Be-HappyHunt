const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const paymentHistorySchema = new Schema(
  {
    _id: Number,
    pricePayment: { type: Number, required: true },
    type: {
      type: String,
      enum: ['TOPUP', 'PAYMENT_POST', 'ACTIVE_VIP'],
      default: 'TOPUP',
    },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, paymentHistorySchema, 'paymentHistory');
paymentHistorySchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const PaymentHistory = model('paymentHistory', paymentHistorySchema);
module.exports = PaymentHistory;
