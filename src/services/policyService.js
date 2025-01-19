const Policy = require('../models/policy');
require('dotenv').config();
const fetchSettingPostPolicyService = async () => {
  const policy = await Policy.findOne({}).select(
    'limitPost limitVipPost timeExpired minImagePost maxImagePost '
  );
  if (!policy) {
    throw new Error('Policy not found');
  }
  return policy;
};
const updateSettingPostPolicyService = async (data) => {
  const policy = await Policy.findOneAndUpdate({}, data, { new: true });
  if (!policy) {
    throw new Error('Update policy failed');
  }
  return policy;
};
const updateDefaultSettingPostPolicyService = async () => {
  const policy = await Policy.findOneAndUpdate(
    {},
    {
      limitPost: process.env.LIMIT_POST_DEFAULT,
      limitVipPost: process.env.LIMIT_POST_VIP,
      timeExpired: process.env.TIME_EXPIRED,
      minImagePost: process.env.MIN_IMAGE_POST,
      maxImagePost: process.env.MAX_IMAGE_POST,
    },
    { new: true }
  );
  if (!policy) {
    throw new Error('Update policy failed');
  }
  return policy;
};
module.exports = {
  fetchSettingPostPolicyService,
  updateSettingPostPolicyService,
  updateDefaultSettingPostPolicyService,
};
