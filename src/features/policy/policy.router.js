const express = require('express');
const router = express.Router();
const policyController = require('./policy.controller');
const { authJwt } = require('../../middlewares');
const policyValidator = require('./policy.validator');
router.get(
  '/setting-post',
  authJwt.accessToken,
  policyValidator.fetchSettingPostPolicy,
  policyController.fetchSettingPostPolicy
);
router.patch(
  '/setting-post',
  authJwt.accessToken,
  policyValidator.updateSettingPostPolicy,
  policyController.updateSettingPostPolicy
);
router.patch(
  '/setting-post/default',
  authJwt.accessToken,
  policyValidator.updateDefaultSettingPostPolicy,
  policyController.updateDefaultSettingPostPolicy
);

module.exports = router;
