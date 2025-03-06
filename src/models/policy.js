const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const policySchema = new Schema(
  {
    _id: Number,
    limitPost: { type: Number, default: 0, required: true },
    limitVipPost: { type: Number, default: 0, required: true },
    timeExpired: { type: Number, default: 0, required: true },
    minImagePost: { type: Number, default: 0, required: true },
    maxImagePost: { type: Number, default: 0, required: true },
    spamMessageCount: { type: Number, default: 0, required: true },
    moneyToCoin: { type: Number, default: 0, required: true },
    coinToVip: { type: Number, default: 0, required: true },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);
policySchema.plugin(mongoose_delete, { overrideMethods: 'all' });
applyAutoIncrement(mongoose, policySchema, 'policy');
const Policy = model('policy', policySchema);
module.exports = Policy;
