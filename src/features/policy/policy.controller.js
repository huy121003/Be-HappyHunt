const { apiHandler } = require('../../helpers');
const policyService = require('./policy.service');

const getSettingPost = async (req, res) => {
  try {
    const result = await policyService.getSettingPost();
    return apiHandler.sendSuccessWithData(
      res,
      'Policy fetched successfully',
      result
    );
  } catch (err) {
    return apiHandler.sendNotFound(res, err.message);
  }
};
const getVipActivation = async (req, res) => {
  try {
    const result = await policyService.getVipActivation();
    return apiHandler.sendSuccessWithData(
      res,
      'Policy fetched successfully',
      result
    );
  } catch (err) {
    return apiHandler.sendNotFound(res, err.message);
  }
};
const updateSettingPost = async (req, res) => {
  try {
    const policy = await policyService.updateSettingPost({
      ...req.body,
      updatedBy: req.userAccess._id,
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
const updateVipActivation = async (req, res) => {
  try {
    const policy = await policyService.updateVipActivation({
      ...req.body,
      updatedBy: req.userAccess._id,
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

const updateDefaultSettingPost = async (req, res) => {
  try {
    const result = await policyService.updateDefaultSettingPost(
      req.userAccess._id
    );
    return apiHandler.sendSuccessWithData(
      res,
      'Policy updated successfully',
      result
    );
  } catch (err) {
    return apiHandler.sendNotFound(res, err.message);
  }
};
const updateDefaultVipActivation = async (req, res) => {
  try {
    const result = await policyService.updateDefaultVipActivation(
      req.userAccess._id
    );
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
  getSettingPost,
  updateSettingPost,
  updateDefaultSettingPost,
  getVipActivation,
  updateVipActivation,
  updateDefaultVipActivation,
};
