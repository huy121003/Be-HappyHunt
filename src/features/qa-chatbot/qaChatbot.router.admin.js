const express = require('express');
const qaChatbotController = require('./qaChatBot.controller');
const router = express.Router();

const { authJwt, permissionApi } = require('../../middlewares');
const {
  PERMISSION_CODE_NAME,
  PERMISSION_TYPE,
} = require('../../constants/constant');
router.use(authJwt.accessToken);
router.get(
  '/',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.Q_A_CHATBOTS,
    PERMISSION_TYPE.VIEW
  ),
  qaChatbotController.getAllPagination
);
router.post(
  '/',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.Q_A_CHATBOTS,
    PERMISSION_TYPE.CREATE
  ),

  authJwt.accessToken,
  qaChatbotController.create
);
router.get(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.Q_A_CHATBOTS,
    PERMISSION_TYPE.VIEW
  ),
  qaChatbotController.getById
);
router.patch(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.Q_A_CHATBOTS,
    PERMISSION_TYPE.UPDATE
  ),
  qaChatbotController.update
);
router.delete(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.Q_A_CHATBOTS,
    PERMISSION_TYPE.DELETE
  ),
  qaChatbotController.remove
);

module.exports = router;
