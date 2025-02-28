const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const accountSchema = new Schema(
  {
    _id: Number,
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: [true, 'Full name is required'],
    },
    username: {
      type: String,
      default: '',
      unique: [true, 'Username already exists'],
      trim: [true, 'Username is required'],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: [true, 'Phone number already'],
      trim: [true, 'Phone number is required'],
    },
    email: {
      type: String,
      unique: [true, 'Email already exists'],
      default: '',
    },
    password: { type: String, required: [true, 'Password is required'] },
    isBanned: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
    isVip: { type: Boolean, default: false },
    address: { type: String, default: '' },
    role: { type: Number, ref: 'role', required: [true, 'Role is required'] },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, accountSchema, 'account');
accountSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Account = model('account', accountSchema);

module.exports = Account;
