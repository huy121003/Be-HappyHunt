const { Permission } = require('../../models');

const getAllPermission = async ({ sortObject, search }) => {
  const permissions = await Permission.find(search).sort(sortObject);
  if (!permissions) {
    throw new Error('Do not have any permissions');
  }
  return permissions;
};
const getAllPermissionWithPagination = async ({
  pageNumber,
  pageSize,
  sortObject,
  search,
}) => {
  const permissions = await Permission.find(search)
    .sort(sortObject)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);
  const total = await Permission.countDocuments(search);
  if (!permissions) {
    throw new Error('Do not have any permissions');
  }
  return {
    permissions,
    pageNumber,
    pageSize,
    total,
  };
};
const getPermissionById = async (id) => {
  const permission = await Permission.findById(id).select('-__v -isDeleted');
  if (!permission) {
    throw new Error('Cannot find permission');
  }
  return permission;
};
const createAPermission = async (data) => {
  const result = await Permission.create(data);
  if (!result) {
    throw new Error('Create permission failed');
  }
  return result;
};
const updateAPermission = async (id, data) => {
  console.log('data', data);
  const result = await Permission.findByIdAndUpdate(id, data, { new: true });
  if (!result) {
    throw new Error('Update permission failed');
  }
  return result;
};
const deleteAPermission = async (id) => {
  const result = await Permission.deleteById(id);
  if (!result) {
    throw new Error('Delete permission failed');
  }
  return result;
};

module.exports = {
  getAllPermission,
  getAllPermissionWithPagination,
  getPermissionById,
  createAPermission,
  updateAPermission,
  deleteAPermission,
};
