const express = require('express');
const router = express.Router();
const { authMiddlewareAccessToken } = require('../middlewares/authMiddleware');
const policyController = require('../controllers/policyController');
router.get(
  '/setting-post',
  authMiddlewareAccessToken,
  policyController.fetchSettingPostPolicy
);
router.patch(
  '/setting-post',
  authMiddlewareAccessToken,
  policyController.updateSettingPostPolicy
);
router.patch(
  '/setting-post/default',
  authMiddlewareAccessToken,
  policyController.updateDefaultSettingPostPolicy
);

module.exports = router;
