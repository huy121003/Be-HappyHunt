const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const accountSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      default: '',
      trim: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: { type: String, required: true },
    isBanned: { type: Boolean, default: true },
    avatar: { type: String, default: '' },
    background: { type: String, default: '' },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], default: null },
    dateOfBirth: { type: String, default: '' },
    isVip: { type: Boolean, default: false },
    dateVipExpired: { type: Date, default: null },
    address: {
      province: { type: Number, ref: 'province', default: null },
      district: { type: Number, ref: 'district', default: null },
      ward: { type: Number, ref: 'ward', default: null },
      specificAddress: { type: String, default: '' },
    },
    balance: { type: Number, default: 0 },
    slug: { type: String, unique: true, default: '', trim: true },
    role: { type: Number, ref: 'role', default: null },
    description: { type: String, default: '' },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
    banAmount: { type: Number, default: 0 },
    reportAmount: { type: Number, default: 0 },
    accountBlock: { type: [Number], default: [] },
    blockAccount: { type: [Number], default: [] },
    postBlock: { type: [Number], default: [] },
    reportBlock: { type: [Number], default: [] },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, accountSchema, 'account');
accountSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Account = model('account', accountSchema);

module.exports = Account;
