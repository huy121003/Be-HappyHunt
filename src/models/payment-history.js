const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const paymentHistorySchema = new Schema(
  {
    _id: Number,
    bin: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountName: { type: String, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ['SUCCESS', 'PENDING', 'CANCELLED', 'EXPIRED', 'FAILED'],
      required: true,
      default: 'PENDING',
    },

    transactionDateTime: { type: Date, default: null },
    checkoutUrl: { type: String, required: true },
    qrCode: { type: String, required: true },
    paymentLinkId: { type: String, required: true },
    orderCode: { type: Number, required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, paymentHistorySchema, 'paymentHistory');
paymentHistorySchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const PaymentHistory = model('paymentHistory', paymentHistorySchema);
module.exports = PaymentHistory;
