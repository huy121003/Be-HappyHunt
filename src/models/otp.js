const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const otpSchema = new Schema(
  {
    _id: Number,
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: [true, 'Phone number is required'],
    },
    otp: {
      type: String,
      required: [true, 'OTP is required'],
      trim: [true, 'OTP is required'],
    },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, otpSchema, 'otp');
otpSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Otp = model('otp', otpSchema);
module.exports = Otp;
