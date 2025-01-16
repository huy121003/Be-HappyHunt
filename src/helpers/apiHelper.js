// Định nghĩa mã trạng thái HTTP
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * Gửi phản hồi thành công chỉ chứa thông điệp
 * Thường được sử dụng khi một thao tác thành công và không cần trả thêm dữ liệu.
 *
 * @param {Object} res - Đối tượng phản hồi từ Express
 * @param {string} message - Thông điệp phản hồi
 * @returns {Object} JSON phản hồi với trạng thái thành công
 */
exports.sendSuccessMessage = function (res, message) {
  const response = {
    status: 1,
    statusCode: HTTP_STATUS.OK,
    message: message,
  };
  return res.status(HTTP_STATUS.OK).json(response);
};

/**
 * Gửi phản hồi thành công với dữ liệu kèm theo
 * Sử dụng khi cần trả về dữ liệu từ API, ví dụ danh sách, chi tiết đối tượng...
 *
 * @param {Object} res - Đối tượng phản hồi từ Express
 * @param {string} message - Thông điệp phản hồi
 * @param {Object} data - Dữ liệu trả về
 * @returns {Object} JSON phản hồi với trạng thái thành công và dữ liệu
 */
exports.sendSuccessWithData = function (res, message, data) {
  const response = {
    status: 1,
    statusCode: HTTP_STATUS.OK,
    message: message,
    data: data,
  };
  return res.status(HTTP_STATUS.OK).json(response);
};

/**
 * Gửi phản hồi lỗi tổng quát
 * Sử dụng khi có lỗi xảy ra ở phía máy chủ, như lỗi không xác định hoặc ngoại lệ.
 *
 * @param {Object} res - Đối tượng phản hồi từ Express
 * @param {string} message - Thông điệp mô tả lỗi
 * @returns {Object} JSON phản hồi với trạng thái lỗi
 */
exports.sendErrorMessage = function (res, message) {
  const response = {
    status: 0,
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: message,
  };
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
};

/**
 * Gửi phản hồi không tìm thấy
 * Sử dụng khi không tìm thấy tài nguyên được yêu cầu, ví dụ đường dẫn hoặc dữ liệu không tồn tại.
 *
 * @param {Object} res - Đối tượng phản hồi từ Express
 * @param {string} message - Thông điệp mô tả lỗi
 * @returns {Object} JSON phản hồi với trạng thái lỗi không tìm thấy
 */
exports.sendNotFound = function (res, message) {
  const response = {
    status: 0,
    statusCode: HTTP_STATUS.NOT_FOUND,
    message: message,
  };
  return res.status(HTTP_STATUS.NOT_FOUND).json(response);
};

/**
 * Gửi phản hồi lỗi do dữ liệu không hợp lệ
 * Sử dụng khi dữ liệu đầu vào không hợp lệ, ví dụ thiếu thông tin bắt buộc hoặc dữ liệu sai định dạng.
 *
 * @param {Object} res - Đối tượng phản hồi từ Express
 * @param {string} message - Thông điệp mô tả lỗi
 * @param {Object} data - Dữ liệu lỗi chi tiết (nếu có)
 * @returns {Object} JSON phản hồi với trạng thái lỗi dữ liệu không hợp lệ
 */
exports.sendValidationError = function (res, message, data) {
  const response = {
    status: 0,
    statusCode: HTTP_STATUS.BAD_REQUEST,
    message: message,
    data: data,
  };
  return res.status(HTTP_STATUS.BAD_REQUEST).json(response);
};

/**
 * Gửi phản hồi lỗi không được phép
 * Sử dụng khi người dùng không có quyền thực hiện thao tác, ví dụ chưa đăng nhập hoặc không đủ quyền.
 *
 * @param {Object} res - Đối tượng phản hồi từ Express
 * @param {string} message - Thông điệp mô tả lỗi
 * @returns {Object} JSON phản hồi với trạng thái lỗi không được phép
 */
exports.sendUnauthorizedError = function (res, message) {
  const response = {
    status: 0,
    statusCode: HTTP_STATUS.UNAUTHORIZED,
    message: message,
  };
  return res.status(HTTP_STATUS.UNAUTHORIZED).json(response);
};
