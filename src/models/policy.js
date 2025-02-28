const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const policySchema = new Schema(
  {
    _id: Number,
    limitPost: {
      type: Number,
      default: 0,
      required: [true, 'Limit post is required'],
    },
    limitVipPost: {
      type: Number,
      default: 0,
      required: [true, 'Limit vip post is required'],
    },
    timeExpired: {
      type: Number,
      default: 0,
      required: [true, 'Time expired is required'],
    },
    minImagePost: {
      type: Number,
      default: 0,
      required: [true, 'Min image post is required'],
    },
    maxImagePost: {
      type: Number,
      default: 0,
      required: [true, 'Max image post is required'],
    },
    spamMessageCount: {
      type: Number,
      default: 0,
      required: [true, 'Spam message count is required'],
    },
    moneyToCoin: {
      type: Number,
      default: 0,
      required: [true, 'Money to coin is required'],
    },
    coinToVip: {
      type: Number,
      default: 0,
      required: [true, 'Coin to vip is required'],
    },
  },
  { timestamps: true }
);
policySchema.plugin(mongoose_delete, { overrideMethods: 'all' });
applyAutoIncrement(mongoose, policySchema, 'policy');
const Policy = model('policy', policySchema);
module.exports = Policy;
