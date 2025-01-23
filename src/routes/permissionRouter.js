const express = require('express');
const router = express.Router();

const permissionController = require('../controllers/permissionController');
const { authMiddlewareAccessToken } = require('../middlewares/authMiddleware');

router.get(
  '/',
  authMiddlewareAccessToken,
  permissionController.getAllPermission
);
router.get(
  '/pagination',
  authMiddlewareAccessToken,
  permissionController.getAllPermissionWithPagination
);
router.get(
  '/:id',
  authMiddlewareAccessToken,
  permissionController.getPermissionById
);
router.post(
  '/',
  authMiddlewareAccessToken,
  permissionController.createAPermission
);
router.patch(
  '/:id',
  authMiddlewareAccessToken,
  permissionController.updateAPermisson
);
router.delete(
  '/:id',
  authMiddlewareAccessToken,
  permissionController.deleteAPermission
);

module.exports = router;
