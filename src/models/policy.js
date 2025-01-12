const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const policySchema = new Schema(
  {
    limitProduct: Number,
    timeExpired: Number,
    minImageProduct: Number,
    maxImageProduct: Number,
    timeLogout: Number,
    spamMessageCount: Number,
  },
  { timestamps: true }
);
settingAdminSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Policy = model('policy', policySchema);
module.exports = Policy;
