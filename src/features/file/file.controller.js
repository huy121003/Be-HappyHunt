const { apiHandler } = require('../../helpers');
const fileService = require('./file.service');

const uploadSingle = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return apiHandler.sendValidationError(res, 'File is required');
  }
  try {
    const result = await fileService.uploadSingle(req.files.imageFile);

    return sendSuccessWithData(res, 'File uploaded successfully', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
const uploadMultiple = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return apiHandler.sendValidationError(res, 'File is required');
  }
  try {
    if (Array.isArray(req.files.image)) {
      const result = await fileService.uploadMultiple(req.files.image);
      return apiHandler.sendSuccessWithData(
        res,
        'File uploaded successfully',
        result
      );
    }
    const result = await fileService.uploadSingle(req.files.image);
    return apiHandler.sendSuccessWithData(
      res,
      'File uploaded successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
};
