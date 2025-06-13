const jwt = require('jsonwebtoken');
require('dotenv').config();
const { apiHandler } = require('../helpers');
const { Account } = require('../models');

const verifyToken = async (token) => {
  if (!token) {
    const error = new Error('token: Token is required');
    error.statusCode = 401;
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const error = new Error('token: Invalid or expired token');
    error.statusCode = 401;
    throw error;
  }

  const account = await Account.findOne({
    _id: decoded._id,
    email: decoded.email,
    username: decoded.username,
    role: decoded.role,
  })
    .populate('role', 'name _id version')
    .lean();

  if (!account) {
    const error = new Error('token: Account not found');
    error.statusCode = 401;
    throw error;
  }

  if (!account.isBanned) {
    const error = new Error('banned: Your account has been banned');
    error.statusCode = 401;
    throw error;
  }

  if (account.role && account.role.version !== decoded.role.version) {
    const error = new Error('permission: Your role has been changed');
    error.statusCode = 401;
    throw error;
  }

  return account;
};

const handleError = (res, error) => {
  const [type, message] = error.message.split(':');
  if (type && message) {
    const msg = message.trim();
    if (type === 'banned' || type === 'permission') {
      return apiHandler.sendUnauthorizedError(res, msg);
    }
    return apiHandler.sendUnauthorizedError(res, msg);
  }
  return apiHandler.sendUnauthorizedError(res, error.message);
};

const accessToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return apiHandler.sendUnauthorizedError(res, 'Token is required');

    const token = authHeader.split(' ')[1];
    const account = await verifyToken(token);

    req.userAccess = {
      _id: account._id,
      email: account.email,
      username: account.username,
      role: account.role,
    };

    next();
  } catch (error) {
    const [type, message] = error.message.split(':');
    if (type && message) {
      const msg = message.trim();
      if (type === 'banned' || type === 'permission') {
        return apiHandler.sendUnauthorizedError(res, msg);
      }
      return apiHandler.sendUnauthorizedError(res, msg);
    }
    return apiHandler.sendUnauthorizedError(res, error.message);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token)
      return apiHandler.sendValidationError(res, 'Refresh token is required');

    const account = await verifyToken(token);

    req.userRefresh = {
      _id: account._id,
      email: account.email,
      username: account.username,
      role: account.role,
    };

    next();
  } catch (error) {
    res.clearCookie('refresh_token');
    const [type, message] = error.message.split(':');
    if (type && message) {
      const msg = message.trim();
      if (type === 'banned' || type === 'permission') {
        return apiHandler.sendValidationError(res, msg);
      }
      return apiHandler.sendValidationError(res, msg);
    }
    return apiHandler.sendValidationError(res, error.message);
  }
};

module.exports = {
  accessToken,
  refreshToken,
};
