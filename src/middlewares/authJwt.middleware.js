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
  if (!token) throw new Error('Token is required');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const account = await Account.findOne({
    _id: decoded._id,
    phoneNumber: decoded.phoneNumber,
    username: decoded.username,
    role: decoded.role,
  })
    .populate('role', 'name _id permissions')
    .lean();
  if (!account) throw new Error('Account not found');

  if (!account.isBanned) throw new Error('Account is banned');
  const accountPermissions = account?.role?.permissions || [];
  const decodedPermissions = decoded?.role?.permissions || [];

  if (!comparePermissions(accountPermissions, decodedPermissions))
    throw new Error('Permission denied');

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
      phoneNumber: account.phoneNumber,
      username: account.username,
      role: account.role,
    };

    next();
  } catch (error) {
    return apiHandler.sendUnauthorizedError(
      res,
      error.message || 'Token is invalid'
    );
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
      phoneNumber: account.phoneNumber,
      username: account.username,
      role: account.role,
    };

    next();
  } catch (error) {
    res.clearCookie('refresh_token');
    return apiHandler.sendValidationError(
      res,
      error.message || 'Refresh token is invalid'
    );
  }
};

module.exports = {
  accessToken,
  refreshToken,
};
