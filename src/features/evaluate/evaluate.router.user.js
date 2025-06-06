const express = require('express');
const router = express.Router();
const evaluateController = require('./evaluate.controller');

const { authJwt, permissionApi } = require('../../middlewares');
router.use(authJwt.accessToken);
router.post('/', permissionApi.permissionUser, evaluateController.create);
router.get(
  '/detail',
  permissionApi.permissionUser,
  evaluateController.getDetail
);
router.get(
  '/countEvaluate/:id',
  permissionApi.permissionUser,
  evaluateController.countEvaluate
);
router.get(
  '/:id',
  permissionApi.permissionUser,
  evaluateController.getByIdUser
);
router.get(
  '/count/:id',
  permissionApi.permissionUser,
  evaluateController.countByUserId
);

module.exports = router;
