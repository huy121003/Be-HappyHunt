const jwt = require('jsonwebtoken');
require('dotenv').config();
const { apiHandler } = require('../helpers');
const { Account } = require('../models');

const accessToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return apiHandler.sendUnauthorizedError(res, 'Token is required');
    }

    const token = authHeader.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const account = await Account.findOne({
      _id: decode._id,
      phoneNumber: decode.phoneNumber,
      username: decode.username,
      role: decode.role,
    });
    if (!account) throw new Error('Account not found');
    if (account.isBanned) throw new Error('Account is banned');

    req.userAccess = {
      _id: account._id,
      phoneNumber: account.phoneNumber,
      username: account.username,
      role: account.role,
    };

    next();
  } catch (error) {
    return apiHandler.sendUnauthorizedError(res, 'Token is invalid');
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token)
      return apiHandler.sendValidationError(res, 'Refresh token is required');

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    const account = await Account.findOne({
      _id: decode._id,
      phoneNumber: decode.phoneNumber,
      username: decode.username,
      role: decode.role,
    })
      .populate('role', 'name _id permissions')
      .lean();
    if (!account) throw new Error('Account not found');

    if (account.isBanned) throw new Error('Account is banned');

    // Tạo access_token mới
    const newAccessToken = jwt.sign(
      {
        _id: account._id,
        phoneNumber: account.phoneNumber,
        username: account.username,
        role: account.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Gửi access_token mới về response
    res.json({ access_token: newAccessToken });

    req.userRefresh = {
      _id: account._id,
      phoneNumber: account.phoneNumber,
      username: account.username,
      role: account.role,
    };

    next();
  } catch (error) {
    res.clearCookie('refresh_token');
    return apiHandler.sendValidationError(res, 'Refresh token is invalid');
  }
};

module.exports = {
  accessToken,
  refreshToken,
};
