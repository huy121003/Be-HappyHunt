const jwt = require('jsonwebtoken');

require('dotenv').config();

const { apiHandler } = require('../helpers');
const { i18next } = require('../configs').translateConfig;

const authJwt = {
  accessToken: (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        if (!res.headersSent)
          return apiHandler.sendUnauthorizedError(
            res,
            i18next.t('token.expireToken')
          );
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
        return apiHandler.sendUnauthorizedError(
          res,
          i18next.t('token.expireToken')
        );
    }
  },

  refreshToken: (req, res, next) => {
    try {
      const token = req.cookies.refresh_token;

      // Kiểm tra token có trong cookie không
      if (!token) {
        return apiHandler.sendValidationError(
          res,
          i18next.t('token.expireToken')
        );
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
      return apiHandler.sendValidationError(
        res,
        i18next.t('token.expireToken')
      );
    }
  },
};
module.exports = authJwt;
