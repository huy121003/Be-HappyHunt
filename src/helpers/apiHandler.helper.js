// Định nghĩa mã trạng thái HTTP
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

const apiHandler = {
  // Phản hồi thành công không có dữ liệu
  sendSuccessMessage: function (res, message) {
    const response = {
      status: 1,
      statusCode: HTTP_STATUS.OK,
      message: message,
    };
    return res.status(HTTP_STATUS.OK).json(response);
  },

  // Phản hồi thành công kèm dữ liệu
  sendSuccessWithData: function (res, message, data) {
    const response = {
      status: 1,
      statusCode: HTTP_STATUS.OK,
      message: message,
      data: data,
    };
    return res.status(HTTP_STATUS.OK).json(response);
  },

  // Phản hồi thành công khi tạo mới dữ liệu
  sendCreated: function (res, message, data) {
    const response = {
      status: 1,
      statusCode: HTTP_STATUS.CREATED,
      message: message,
      data: data,
    };
    return res.status(HTTP_STATUS.CREATED).json(response);
  },

  // Phản hồi thành công nhưng không có nội dung trả về
  sendNoContent: function (res) {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  },

  // Lỗi 400 - Request không hợp lệ
  sendValidationError: function (res, message, data) {
    const response = {
      status: 0,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message: message,
      data: data,
    };
    return res.status(HTTP_STATUS.BAD_REQUEST).json(response);
  },

  // Lỗi 401 - Không có quyền truy cập
  sendUnauthorizedError: function (res, message) {
    const response = {
      status: 0,
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      message: message,
    };
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(response);
  },

  // Lỗi 403 - Không đủ quyền
  sendForbidden: function (res, message) {
    const response = {
      status: 0,
      statusCode: HTTP_STATUS.FORBIDDEN,
      message: message,
    };
    return res.status(HTTP_STATUS.FORBIDDEN).json(response);
  },

  // Lỗi 404 - Không tìm thấy tài nguyên
  sendNotFound: function (res, message) {
    const response = {
      status: 0,
      statusCode: HTTP_STATUS.NOT_FOUND,
      message: message,
    };
    return res.status(HTTP_STATUS.NOT_FOUND).json(response);
  },

  // Lỗi 409 - Xung đột dữ liệu
  sendConflict: function (res, message) {
    const response = {
      status: 0,
      statusCode: HTTP_STATUS.CONFLICT,
      message: message,
    };
    return res.status(HTTP_STATUS.CONFLICT).json(response);
  },

  // Lỗi 422 - Dữ liệu không hợp lệ
  sendUnprocessableEntity: function (res, message, data) {
    const response = {
      status: 0,
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      message: message,
      data: data,
    };
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(response);
  },

  // Lỗi 500 - Lỗi server
  sendErrorMessage: function (res, message) {
    const response = {
      status: 0,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: message,
    };
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
  },

  // Lỗi 503 - Server quá tải hoặc bảo trì
  sendServiceUnavailable: function (res, message) {
    const response = {
      status: 0,
      statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
      message: message,
    };
    return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json(response);
  },
};
const sendResponse = (res, statusCode, message, data) => {
  switch (statusCode) {
    // Trường hợp thành công không có dữ liệu code 200
    case HTTP_STATUS.OK:
      return apiHandler.sendSuccessMessage(res, message);
    // Trường hợp thành công có dữ liệu trả về code 200
    case HTTP_STATUS.OK:
      return apiHandler.sendSuccessWithData(res, message, data);
    // Trường hợp tạo mới dữ liệu thành công code 201
    case HTTP_STATUS.CREATED:
      return apiHandler.sendCreated(res, message, data);
    // Trường hợp lỗi request không hợp lệ code 400
    case HTTP_STATUS.BAD_REQUEST:
      return apiHandler.sendValidationError(res, message, data);
    // Trường hợp không có quyền truy cập code 401
    case HTTP_STATUS.UNAUTHORIZED:
      return apiHandler.sendUnauthorizedError(res, message);
    // Trường hợp không đủ quyền code 403
    case HTTP_STATUS.FORBIDDEN:
      return apiHandler.sendForbidden(res, message);
    // Trường hợp không tìm thấy tài nguyên code 404
    case HTTP_STATUS.NOT_FOUND:
      return apiHandler.sendNotFound(res, message);
    // Trường hợp xung đột dữ liệu code 409
    case HTTP_STATUS.CONFLICT:
      return apiHandler.sendConflict(res, message);
    // Trường hợp dữ liệu không hợp lệ code 422
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      return apiHandler.sendUnprocessableEntity(res, message, data);
    // Trường hợp lỗi server code 500
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return apiHandler.sendErrorMessage(res, message);
    // Trường hợp server quá tải hoặc bảo trì code 503
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return apiHandler.sendServiceUnavailable(res, message);
    // Trường hợp không xác định được lỗi code 500
    default:
      return apiHandler.sendErrorMessage(res, 'Unknown error');
  }
};

module.exports = apiHandler;
