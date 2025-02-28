const jwt = require('jsonwebtoken');
require('dotenv').config();
const { apiHandler } = require('../helpers');

const accessToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      if (!res.headersSent)
        return apiHandler.sendUnauthorizedError(res, 'Token is required');
      return;
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userAccess = {
      _id: decode?._id,
      phoneNumber: decode?.phoneNumber,
    };
    return next();
  } catch (error) {
    if (!res.headersSent)
      return apiHandler.sendUnauthorizedError(res, 'Token is invalid');
  }
};

const refreshToken = (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token)
      return apiHandler.sendValidationError(res, 'Token is required in cookie');
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userRefresh = {
      _id: decode?._id,
      phoneNumber: decode?.phoneNumber,
    };
    next();
  } catch (error) {
    return apiHandler.sendValidationError(res, 'Token is invalid in cookie');
  }
};

module.exports = {
  accessToken,
  refreshToken,
};
