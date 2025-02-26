const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const policySchema = new Schema(
  {
    _id: Number,
    limitPost: { type: Number, default: 0 },
    limitVipPost: { type: Number, default: 0 },
    timeExpired: { type: Number, default: 0 },
    minImagePost: { type: Number, default: 0 },
    maxImagePost: { type: Number, default: 0 },
    spamMessageCount: { type: Number, default: 0 },
    moneyToCoin: { type: Number, default: 0 },
    coinToVip: { type: Number, default: 0 },
  },
  { timestamps: true }
);
policySchema.plugin(mongoose_delete, { overrideMethods: 'all' });
applyAutoIncrement(mongoose, policySchema, 'policy');
const Policy = model('policy', policySchema);
module.exports = Policy;
