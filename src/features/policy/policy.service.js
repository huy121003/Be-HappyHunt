const { Policy } = require('../../models');
const policyData = require('./policy.data');
require('dotenv').config();

const getSettingPost = async () => {
  const policy = await Policy.findOne({}).select(
    'limitPost limitVipPost timeExpired minImagePost maxImagePost '
  );
  if (!policy) throw new Error('Setting post not found');

  return policy;
};
const getVipActivation = async () => {
  const policy = await Policy.findOne({}).select('coinToVip moneyToCoin');
  if (!policy) throw new Error('Vip Activation not found');

  return policy;
};
const updateSettingPost = async (data) => {
  const policy = await Policy.findOneAndUpdate({}, data, { new: true });
  if (!policy) throw new Error('Update setting post failed');
  return policy;
};
const updateVipActivation = async (data) => {
  const policy = await Policy.findOneAndUpdate({}, data, { new: true });
  if (!policy) throw new Error('Update vip activation failed');

  return policy;
};
const updateDefaultSettingPost = async (id) => {
  const policy = await Policy.findOneAndUpdate(
    {},
    {
      limitPost: process.env.LIMIT_POST_DEFAULT,
      limitVipPost: process.env.LIMIT_POST_VIP,
      timeExpired: process.env.TIME_EXPIRED,
      minImagePost: process.env.MIN_IMAGE_POST,
      maxImagePost: process.env.MAX_IMAGE_POST,
      updateBy: id,
    },
    { new: true }
  );
  if (!policy) throw new Error('Set default setting post failed');

  return policy;
};
const updateDefaultVipActivation = async (id) => {
  const policy = await Policy.findOneAndUpdate(
    {},
    {
      coinToVip: process.env.COIN_TO_VIP,
      moneyToCoin: process.env.MONEY_TO_COIN,
      updateBy: id,
    },
    { new: true }
  );
  if (!policy) throw new Error('Set default vip activation failed');
  return policy;
};

module.exports = {
  getSettingPost,
  updateSettingPost,
  updateDefaultSettingPost,
  getVipActivation,
  updateVipActivation,
  updateDefaultVipActivation,
};
