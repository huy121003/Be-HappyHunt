const { apiHandler } = require('../../helpers');

const fetchSettingPostPolicy = async (req, res, next) => {
  next();
};
const updateSettingPostPolicy = async (req, res, next) => {
  const { limitPost, timeExpired, minImagePost, maxImagePost, limitVipPost } =
    req.body;
  if (
    !limitPost ||
    !timeExpired ||
    !minImagePost ||
    !maxImagePost ||
    !limitVipPost
  ) {
    return apiHandler.sendValidationError(res, 'Missing required fields');
  }
  next();
};
const updateDefaultSettingPostPolicy = async (req, res, next) => {
  next();
};

module.exports = {
  fetchSettingPostPolicy,
  updateSettingPostPolicy,
  updateDefaultSettingPostPolicy,
};
