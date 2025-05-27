const jwt = require('jsonwebtoken');
require('dotenv').config();
const { apiHandler } = require('../helpers');
const { Account } = require('../models');
const comparePermissions = (accountPermissions, decodedPermissions) => {
  if (accountPermissions.length !== decodedPermissions.length) return false;

  return accountPermissions.every((accPerm) => {
    const match = decodedPermissions.find(
      (decPerm) => decPerm.codeName === accPerm.codeName
    );
    if (!match) return false;

    return Object.keys(accPerm).every((key) => {
      if (key !== 'codeName') {
        return accPerm[key] === match[key];
      }
      return true;
    });
  });
};

const verifyToken = async (token) => {
  if (!token) {
    const error = new Error('token: Token is required');
    error.statusCode = 401;
    throw error;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const account = await Account.findOne({
    _id: decoded._id,
    email: decoded.email,
    username: decoded.username,
    role: decoded.role,
  })
    .populate('role', 'name _id permissions')
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
  const accountPermissions = account?.role?.permissions || [];
  const decodedPermissions = decoded?.role?.permissions || [];

  if (!comparePermissions(accountPermissions, decodedPermissions)) {
    const error = new Error('permission: Permission denied');
    error.statusCode = 403;
    throw error;
  }

  return account;
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
    if (error.message.includes('token:')) {
      return apiHandler.sendUnauthorizedError(
        res,
        error.message.split(':')[1].trim()
      );
    } else if (error.message.includes('banned:')) {
  
      return apiHandler.sendUnauthorizedError(
        res,
        error.message.split(':')[1].trim()
      );
    } else if (error.message.includes('permission:')) {
      return apiHandler.sendUnauthorizedError(
        res,
        error.message.split(':')[1].trim()
      );
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
    if (error.message.includes('token:')) {
      return apiHandler.sendUnauthorizedError(
        res,
        error.message.split(':')[1].trim()
      );
    } else if (error.message.includes('banned:')) {
      return apiHandler.sendForbidden(res, error.message.split(':')[1].trim());
    } else if (error.message.includes('permission:')) {
      return apiHandler.sendForbidden(res, error.message.split(':')[1].trim());
    }
    return apiHandler.sendUnauthorizedError(res, error.message);
  }
};

module.exports = {
  accessToken,
  refreshToken,
};
