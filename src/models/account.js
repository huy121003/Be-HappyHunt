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
      trim: [true, 'Username is required'],
    },
    username: {
      type: String,
      unique: [true, 'Username already exists'],
      trim: [true, 'Username is required'],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: [true, 'Phone number already'],
      trim: [true, 'Phone number is required'],
    },

    password: { type: String, required: [true, 'Password is required'] },
    isBanned: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
    isVip: { type: Boolean, default: false },
    address: {
      provinceId: { type: Number, ref: 'province', default: null },
      districtId: { type: Number, ref: 'district', default: null },
      wardId: { type: Number, ref: 'ward', default: null },
      specificAddress: { type: String, default: '' },
    },
    role: { type: Number, ref: 'role', default: null },
    description: { type: String, default: '' },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, accountSchema, 'account');
accountSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Account = model('account', accountSchema);

module.exports = Account;
