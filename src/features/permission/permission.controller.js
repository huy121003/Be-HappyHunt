const { parseSortQuery, apiHandler } = require('../../helpers');
const { Permission } = require('../../models');
const perimissionData = require('./permission.data');
const permissionService = require('./permission.service');

const autoCreatePermissionMany = async () => {
  try {
    const permissions = await Permission.find({});
    if (permissions.length === 0) {
      for (const permission of perimissionData) {
        await Permission.create(permission);
        console.log('Inserted permission:', permission);
      }
      console.log('All permissions inserted successfully');
    } else {
      console.log('Permissions already exist');
    }
  } catch (err) {
    console.error('Error inserting permissions:', err);
  }
};

const getAllPermission = async (req, res) => {
  let { sort, ...search } = req.query;

  const sortObject = parseSortQuery(sort);
  if (!search) {
    search = {};
  }
  try {
    const result = await permissionService.getAllPermission({
      sortObject,
      search,
    });
    return apiHandler.sendSuccessWithData(res, 'List permissions', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
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
    const result = await permissionService.getAllPermissionWithPagination({
      pageNumber,
      pageSize,
      sortObject,
      search,
    });
    return apiHandler.sendSuccessWithData(res, 'List permissions', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getPermissionById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await permissionService.getPermissionById(id);
    return apiHandler.sendSuccessWithData(res, 'Permission', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const createAPermission = async (req, res) => {
  const { name, description, method, type, url } = req.body;

  try {
    const nameSreach = await Permission.findOne({ name });
    if (nameSreach) {
      return apiHandler.sendErrorMessage(res, 'Permission đã tồn tại');
    }

    const result = await permissionService.createAPermission({
      name,
      description: description || '',
      method,
      type,
      url,
    });
    return apiHandler.sendSuccessWithData(res, 'Permission', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const updateAPermisson = async (req, res) => {
  const { id } = req.params;
  const { name, description, method, type, url } = req.body;

  try {
    const result = await permissionService.updateAPermission(id, {
      name,
      description,
      method,
      type,
      url,
    });
    return apiHandler.sendSuccessWithData(res, 'Permission', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const deleteAPermission = async (req, res) => {
  const { id } = req.params;
  try {
    await permissionService.deleteAPermission(id);
    return apiHandler.sendSuccessMessage(res, 'Xóa permission thành công');
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
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
