const { apiHandler } = require('../../helpers');
const policyService = require('./policy.service');

const autoCreatePolicy = async () => {
  try {
    const policy = await Policy.find({});
    if (policy.length === 0) {
      await policyService.autoCreatePolicy();
      return true;
    }
  } catch (err) {
    console.log(err);
  }
};
const fetchSettingPostPolicy = async (req, res) => {
  try {
    const result = await policyService.fetchSettingPostPolicy();
    return apiHandler.sendSuccessWithData(
      res,
      'Policy fetched successfully',
      result
    );
  } catch (err) {
    return apiHandler.sendNotFound(res, err.message);
  }
};
const updateSettingPostPolicy = async (req, res) => {
  const { limitPost, timeExpired, minImagePost, maxImagePost, limitVipPost } =
    req.body;

  try {
    const policy = await policyService.updateSettingPostPolicy({
      limitPost,
      limitVipPost,
      timeExpired,
      minImagePost,
      maxImagePost,
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Policy updated successfully',
      policy
    );
  } catch (err) {
    return apiHandler.sendNotFound(res, err.message);
  }
};
const updateDefaultSettingPostPolicy = async (req, res) => {
  try {
    const result = await policyService.updateDefaultSettingPostPolicy();
    return apiHandler.sendSuccessWithData(
      res,
      'Policy updated successfully',
      result
    );
  } catch (err) {
    return apiHandler.sendNotFound(res, err.message);
  }
};

module.exports = {
  autoCreatePolicy,
  fetchSettingPostPolicy,
  updateSettingPostPolicy,
  updateDefaultSettingPostPolicy,
};
