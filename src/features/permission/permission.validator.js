const { apiHandler } = require('../../helpers');

const getAllPermission = async (req, res, next) => {
  next();
};
const getAllPermissionWithPagination = async (req, res, next) => {
  next();
};
const getPermissionById = async (req, res, next) => {
  if (!req.params.id)
    return apiHandler.sendValidationError(res, 'Id is required');
  next();
};
const createAPermission = async (req, res, next) => {
  const { name, method, type, url } = req.body;
  if (!name || !method || !type || !url) {
    return apiHandler.sendValidationError(res, 'Thiếu thông tin cần thiết');
  }
  next();
};
const updateAPermisson = async (req, res, next) => {
  if (!req.params.id)
    return apiHandler.sendValidationError(res, 'Id is required');
  next();
};
const deleteAPermission = async (req, res, next) => {
  if (!req.params.id)
    return apiHandler.sendValidationError(res, 'Id is required');
  next();
};

module.exports = {
  getAllPermission,
  getAllPermissionWithPagination,
  getPermissionById,
  createAPermission,
  updateAPermisson,
  deleteAPermission,
};
