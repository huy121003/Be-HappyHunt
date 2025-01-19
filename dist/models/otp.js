const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const {
  Schema,
  model
} = mongoose;
const otpSchema = new Schema({
  phoneNumber: String,
  otp: String
}, {
  timestamps: true
});
otpSchema.plugin(mongoose_delete, {
  overrideMethods: 'all'
});
const Otp = model('otp', otpSchema);
module.exports = Otp;