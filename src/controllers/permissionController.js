const perimissionData = require('../data/permissionData');
const {
  sendSuccessWithData,
  sendErrorMessage,
  sendValidationError,
  sendSuccessMessage,
} = require('../helpers/apiHelper');
const { parseSortQuery } = require('../helpers/parseSortQuery');
const Permission = require('../models/permission');
const {
  getAllPermissionService,
  getAllPermissionWithPaginationService,
  getPermissionByIdService,
  updateAPermissionService,
  createAPermissionService,
  deleteAPermissionService,
} = require('../services/permissionService');
const autoCreatePermissionMany = async () => {
  try {
    const permission = await Permission.find({});
    if (permission.length === 0) {
      const result = await Permission.insertMany(perimissionData);
      return true;
    }
  } catch (err) {
    console.log(err);
  }
};
const getAllPermission = async (req, res) => {
  let { sort, ...search } = req.query;

  const sortObject = parseSortQuery(sort);
  if (!search) {
    search = {};
  }
  try {
    const result = await getAllPermissionService({
      sortObject,
      search,
    });
    return sendSuccessWithData(res, 'List permissions', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
const getAllPermissionWithPagination = async (req, res) => {
  let { pageNumber, pageSize, sort, ...search } = req.query;
  if (!pageNumber || pageNumber < 1) {
    pageNumber = process.env.PAGENUMBER_DEFAULT;
  }
  if (!pageSize || pageSize < 1) {
    pageSize = process.env.PAGESIZE_DEFAULT;
  }
  if (!sort) {
    sort = process.env.SORT_DEFAULT;
  }
  console.log('sort', sort);
  const sortObject = parseSortQuery(sort);
  if (!search) {
    search = {};
  }
  try {
    const result = await getAllPermissionWithPaginationService({
      pageNumber,
      pageSize,
      sortObject,
      search,
    });
    return sendSuccessWithData(res, 'List permissions', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
const getPermissionById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendValidationError(res, 'Id không được để trống');
  }
  try {
    const result = await getPermissionByIdService(id);
    return sendSuccessWithData(res, 'Permission', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
const createAPermission = async (req, res) => {
  const { name, description, method, type, url } = req.body;
  if (!name || !description || !method || !type || !url) {
    return sendValidationError(res, 'Thiếu thông tin cần thiết');
  }

  try {
    const nameSreach = await Permission.findOne({ name });
    if (nameSreach) {
      return sendErrorMessage(res, 'Permission đã tồn tại');
    }

    const result = await createAPermissionService({
      name,
      description,
      method,
      type,
      url,
    });
    return sendSuccessWithData(res, 'Permission', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
const updateAPermisson = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendValidationError(res, 'Id không được để trống');
  }
  const { name, description, method, type, url } = req.body;

  try {
    const result = await updateAPermissionService(id, {
      name,
      description,
      method,
      type,
      url,
    });
    return sendSuccessWithData(res, 'Permission', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
const deleteAPermission = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendValidationError(res, 'Id không được để trống');
  }
  try {
    await deleteAPermissionService(id);
    return sendSuccessMessage(res, 'Xóa permission thành công');
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
module.exports = {
  autoCreatePermissionMany,
  getAllPermission,
  getAllPermissionWithPagination,
  getPermissionById,
  createAPermission,
  updateAPermisson,
  deleteAPermission,
};
