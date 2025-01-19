const express = require('express');
const { authMiddlewareAccessToken } = require('../middlewares/authMiddleware');
const fileController = require('../controllers/fileController');
const router = express.Router();
router.post('/single', authMiddlewareAccessToken, fileController.uploadSingle);
router.post(
  '/multiple',
  authMiddlewareAccessToken,
  fileController.uploadMultiple
);
module.exports = router;
