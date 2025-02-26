const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const accountSchema = new Schema(
  {
    _id: Number,
    fullName: { type: String, required: true },
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBanned: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
    isVip: { type: Boolean, default: false },
    address: { type: String, default: '' },
    role: { type: Number, ref: 'role', required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, accountSchema, 'account');
accountSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Account = model('account', accountSchema);

module.exports = Account;
