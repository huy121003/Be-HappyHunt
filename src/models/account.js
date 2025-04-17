const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const bcrypt = require('bcrypt');
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

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: { type: String, required: true },
    isBanned: { type: Boolean, default: true },
    avatar: { type: String, default: '' },
    background: { type: String, default: '' },
    sex: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], default: '' },
    dateOfBirth: { type: String, default: '' },
    isVip: { type: Boolean, default: false },
    dateVipExpired: { type: String, default: null },
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
    messageHidden: [{ type: Number, ref: 'message', default: null }],
    favoritePost: [{ type: Number, ref: 'post', default: null }],
    blockAccount: [{ type: Number, ref: 'account', default: null }],
    blockPost: [{ type: Number, ref: 'post', default: null }],
    onOff: {
      status: { type: String, enum: ['online', 'offline'], default: 'offline' },
      timeOff: { type: Date, default: null },
    },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, accountSchema, 'account');
accountSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Account = model('account', accountSchema);

module.exports = Account;
