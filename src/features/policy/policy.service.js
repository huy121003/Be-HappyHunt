const { Policy } = require('../../models');
const policyData = require('./policy.data');
require('dotenv').config();

const autoCreatePolicy = async () => {
  const result = await Policy.create(policyData);
  if (!result) {
    throw new Error('Create policy failed');
  }
  return true;
};

const fetchSettingPostPolicy = async () => {
  const policy = await Policy.findOne({}).select(
    'limitPost limitVipPost timeExpired minImagePost maxImagePost '
  );
  if (!policy) {
    throw new Error('Policy not found');
  }
  return policy;
};
const updateSettingPostPolicy = async (data) => {
  const policy = await Policy.findOneAndUpdate({}, data, { new: true });
  if (!policy) {
    throw new Error('Update policy failed');
  }
  return policy;
};
const updateDefaultSettingPostPolicy = async () => {
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
  autoCreatePolicy,
  fetchSettingPostPolicy,
  updateSettingPostPolicy,
  updateDefaultSettingPostPolicy,
};
