const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

exports.successResponse = function (res, msg) {
  const data = {
    status: 1,
    message: msg,
  };
  return res.status(HTTP_STATUS.OK).json(data);
};

exports.successResponseWithData = function (res, msg, data) {
  const resData = {
    status: 1,
    statusCode: HTTP_STATUS.OK,
    message: msg,
    data: data,
  };
  return res.status(HTTP_STATUS.OK).json(resData);
};

exports.ErrorResponse = function (res, msg) {
  const data = {
    status: 0,
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: msg,
  };
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(data);
};

exports.notFoundResponse = function (res, msg) {
  const data = {
    status: 0,
    statusCode: HTTP_STATUS.NOT_FOUND,
    message: msg,
  };
  return res.status(HTTP_STATUS.NOT_FOUND).json(data);
};

exports.validationErrorWithData = function (res, msg, data) {
  const resData = {
    status: 0,
    statusCode: HTTP_STATUS.BAD_REQUEST,
    message: msg,
    data: data,
  };
  return res.status(HTTP_STATUS.BAD_REQUEST).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
  const data = {
    status: 0,
    statusCode: HTTP_STATUS.UNAUTHORIZED,
    message: msg,
  };
  return res.status(HTTP_STATUS.UNAUTHORIZED).json(data);
};
