const policyData = require('../data/policyData');
const { sendSuccessWithData } = require('../helpers/apiHelper');
const Policy = require('../models/policy');
const {
  fetchSettingPostPolicyService,
  updateSettingPostPolicyService,
  updateDefaultSettingPostPolicyService,
} = require('../services/policyService');

const autoCreatePolicy = async () => {
  try {
    const policy = await Policy.find({});
    if (policy.length === 0) {
      const result = await Policy.create(policyData);
      return true;
    }
  } catch (err) {
    console.log(err);
  }
};
const fetchSettingPostPolicy = async (req, res) => {
  try {
    const result = await fetchSettingPostPolicyService();
    return sendSuccessWithData(res, 'Policy fetched successfully', result);
  } catch (err) {
    console.log(err);
  }
};
const updateSettingPostPolicy = async (req, res) => {
  const { limitPost, timeExpired, minImagePost, maxImagePost, limitVipPost } =
    req.body;
  if (
    !limitPost ||
    !timeExpired ||
    !minImagePost ||
    !maxImagePost ||
    !limitVipPost
  ) {
    return sendValidationError(res, 'Missing required fields');
  }
  try {
    const policy = await updateSettingPostPolicyService({
      limitPost,
      limitVipPost,
      timeExpired,
      minImagePost,
      maxImagePost,
    });
    return sendSuccessWithData(res, 'Policy updated successfully', policy);
  } catch (err) {
    console.log(err);
  }
};
const updateDefaultSettingPostPolicy = async (req, res) => {
  try {
    const result = await updateDefaultSettingPostPolicyService();
    return sendSuccessWithData(res, 'Policy updated successfully', result);
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  autoCreatePolicy,
  fetchSettingPostPolicy,
  updateSettingPostPolicy,
  updateDefaultSettingPostPolicy,
};
