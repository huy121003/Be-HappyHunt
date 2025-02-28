const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const blockedSchema = new Schema(
  {
    _id: Number,
    accountId: {
      type: Number,
      ref: 'account',
      required: [true, 'Account ID is required'],
    },
    blockedId: {
      type: Number,
      ref: 'account',
      required: [true, 'Blocked ID is required'],
    },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, blockedSchema, 'blocked');
blockedSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Blocked = model('blocked', blockedSchema);
module.exports = Blocked;
