const express = require('express');
const router = express.Router();
const policyController = require('./policy.controller');
const { authJwt } = require('../../middlewares');
router.get(
  '/setting-post',
  authJwt.accessToken,
  policyController.getSettingPost
);
router.get(
  '/vip-activation',
  authJwt.accessToken,
  policyController.getVipActivation
);
router.patch(
  '/setting-post',
  authJwt.accessToken,
  policyController.updateSettingPost
);
router.patch(
  '/vip-activation',
  authJwt.accessToken,
  policyController.updateVipActivation
);
router.patch(
  '/setting-post/default',
  authJwt.accessToken,
  policyController.updateDefaultSettingPost
);
router.patch(
  '/vip-activation/default',
  authJwt.accessToken,
  policyController.updateDefaultVipActivation
);

module.exports = router;
