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
      enum: ['PAID', 'PENDING', 'CANCEL'],
      required: true,
      default: 'PEDING',
    },

    checkoutUrl: { type: String, required: true },
    qrCode: { type: String, required: true },
    paymentLinkId: { type: String, required: true, ref: 'paymentLink' },
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
