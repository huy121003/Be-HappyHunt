const jwt = require('jsonwebtoken');

require('dotenv').config();

const { sendUnauthorizedError } = require('../helpers/apiHelper');
const { i18next } = require('../i18n');

const { t } = i18next;
const authMiddlewareAccessToken = (req, res, next) => {
  const white_list = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
  ];
  if (white_list.find((item) => `api/v1${item}` === req.originalUrl)) {
    next();
  } else {
    if (req?.headers?.authorization?.split(' ')[1]) {
      try {
        const access_token = req.headers.authorization.split(' ')[1];

        const decode = jwt.verify(access_token, process.env.JWT_SECRET);

        req.userAccess = {
          _id: decode?._id,
          phoneNumber: decode?.phoneNumber,
        };

        next();
      } catch {
        return sendUnauthorizedError(res, t('token.expireToken'));
      }
    } else {
      //return exception
      return sendUnauthorizedError(res, t('token.expireToken'));
    }
  }
};
const authMiddlewareRefreshToken = (req, res, next) => {
  const white_list = ['/refresh-token'];
  if (white_list.find((item) => `api/v1${item}` === req.originalUrl)) {
    if (req?.cookies?.refresh_token) {
      try {
        const refresh_token = req.cookies.refresh_token;

        const decode = jwt.verify(refresh_token, process.env.JWT_SECRET);

        req.userRefresh = {
          _id: decode?._id,
          phoneNumber: decode?.phoneNumber,
        };

        next();
      } catch {
        return sendUnauthorizedError(res, t('token.expireToken'));
      }
    } else {
      //return exception
      return sendUnauthorizedError(res, t('token.expireToken'));
    }
  } else {
    next();
  }
};
module.exports = { authMiddlewareAccessToken, authMiddlewareRefreshToken }; //export default
