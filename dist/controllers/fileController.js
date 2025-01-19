const {
  sendErrorMessage,
  sendValidationError,
  sendSuccessWithData
} = require('../helpers/apiHelper');
const {
  uploadSingleService,
  uploadMultipleService
} = require('../services/fileService');
const uploadSingle = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return sendValidationError(res, 'File is required');
  }
  try {
    const result = await uploadSingleService(req.files.imageFile);
    return sendSuccessWithData(res, 'File uploaded successfully', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
const uploadMultiple = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return sendValidationError(res, 'File is required');
  }
  console.log(req.files);
  try {
    if (Array.isArray(req.files.image)) {
      const result = await uploadMultipleService(req.files.image);
      return sendSuccessWithData(res, 'File uploaded successfully', result);
    }
    const result = await uploadSingleService(req.files.image);
    return sendSuccessWithData(res, 'File uploaded successfully', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
module.exports = {
  uploadSingle,
  uploadMultiple
};