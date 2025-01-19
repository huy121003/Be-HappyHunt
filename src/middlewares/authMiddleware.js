const jwt = require('jsonwebtoken');

require('dotenv').config();

const {
  sendUnauthorizedError,
  sendValidationError,
} = require('../helpers/apiHelper');
const { i18next } = require('../i18n');

const { t } = i18next;
const authMiddlewareAccessToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      if (!res.headersSent)
        return sendUnauthorizedError(res, t('token.expireToken'));
      return; // Dừng middleware ngay lập tức
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.userAccess = {
      _id: decode?._id,
      phoneNumber: decode?.phoneNumber,
    };

    return next(); // Chỉ gọi next() khi xác thực thành công
  } catch (error) {
    if (!res.headersSent)
      return sendUnauthorizedError(res, t('token.expireToken'));
  }
};

const authMiddlewareRefreshToken = (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;

    // Kiểm tra token có trong cookie không
    if (!token) {
      return sendValidationError(res, t('token.expireToken'));
    }

    // Giải mã token
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.userRefresh = {
      _id: decode?._id,
      phoneNumber: decode?.phoneNumber,
    };

    next(); // Tiếp tục xử lý nếu token hợp lệ
  } catch (error) {
    console.error('Error in refresh token verification:', error); // Ghi lại lỗi để dễ dàng debug
    return sendValidationError(res, t('token.expireToken'));
  }
};

module.exports = { authMiddlewareAccessToken, authMiddlewareRefreshToken }; //export default
