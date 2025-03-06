const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const {
  Schema,
  model
} = mongoose;
const policySchema = new Schema({
  limitPost: Number,
  limitVipPost: Number,
  timeExpired: Number,
  minImagePost: Number,
  maxImagePost: Number,
  spamMessageCount: Number,
  moneyToCoin: Number,
  coinToVip: Number
}, {
  timestamps: true
});
policySchema.plugin(mongoose_delete, {
  overrideMethods: 'all'
});
const Policy = model('policy', policySchema);
module.exports = Policy;