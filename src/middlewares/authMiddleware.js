const jwt = require('jsonwebtoken');
const responseHandler = require('../helper/responseHandler');
require('dotenv').config();
const { i18next } = require('../i18n');
const { apiHelper } = require('./../helpers');
const { t } = i18next;
const auth = (req, res, next) => {
  const white_list = ['/', '/login', '/register'];
  if (white_list.find((item) => `/v1/api${item}` === req.originalUrl)) {
    next();
  } else {
    if (req?.headers?.authorization?.split(' ')[1]) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          _id: decode?._id,
          name: decode?.name,
          phone: decode?.phone,
        };
        next();
      } catch {
        return res
          .status(401)
          .json(apiHelper.unauthorizedResponse(res, t('expireToken')));
      }
    } else {
      //return exception
      return res
        .status(401)
        .json(apiHelper.unauthorizedResponse(res, t('expireToken')));
    }
  }
};
module.exports = auth; //export default
