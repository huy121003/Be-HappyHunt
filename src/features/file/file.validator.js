const { apiHandler } = require('../../helpers');

const uploadSingle = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return apiHandler.sendValidationError(res, 'File is required');
  }
  if (!req.files.imageFile) {
    return apiHandler.sendValidationError(res, 'imageFile is required');
  }
  if (
    req.files.imageFile.mimetype !== 'image/png' &&
    req.files.imageFile.mimetype !== 'image/jpeg'
  ) {
    return apiHandler.sendValidationError(res, 'File must be image');
  }
  if (req.files.imageFile.size > 1024 * 1024) {
    return apiHandler.sendValidationError(res, 'File is too large');
  }

  next();
};
const uploadMultiple = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return apiHandler.sendValidationError(res, 'File is required');
  }
  if (!req.files.image) {
    return apiHandler.sendValidationError(res, 'image is required');
  }
  if (!Array.isArray(req.files.image)) {
    return apiHandler.sendValidationError(res, 'image must be an array');
  }

  req.files.image.forEach((file) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      return apiHandler.sendValidationError(res, 'File must be image');
    }
    if (file.size > 1024 * 1024) {
      return apiHandler.sendValidationError(res, 'File is too large');
    }
  });

  next();
};

module.exports = {
  uploadSingle,
  uploadMultiple,
};
