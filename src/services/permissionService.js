const Permission = require('../models/permission');

const getAllPermissionService = async ({ sortObject, search }) => {
  const permissions = await Permission.find(search).sort(sortObject);
  if (!permissions) {
    throw new Error('Không tìm thấy permissions');
  }
  return permissions;
};
const getAllPermissionWithPaginationService = async ({
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
    throw new Error('Không tìm thấy permissions');
  }
  return {
    permissions,
    pageNumber,
    pageSize,
    total,
  };
};
const getPermissionByIdService = async (id) => {
  const permission = await Permission.findById(id);
  if (!permission) {
    throw new Error('Không tìm thấy permission');
  }
  return permission;
};
const createAPermissionService = async (data) => {
  const result = await Permission.create(data);
  if (!result) {
    throw new Error('Tạo permission không thành công');
  }
  return result;
};
const updateAPermissionService = async (id, data) => {
  console.log('data', data);
  const result = await Permission.findByIdAndUpdate(id, data, { new: true });
  if (!result) {
    throw new Error('Cập nhật permission không thành công');
  }
  return result;
};
const deleteAPermissionService = async (id) => {
  const result = await Permission.deleteById(id);
  if (!result) {
    throw new Error('Xóa permission không thành công');
  }
  return result;
};
module.exports = {
  getAllPermissionService,
  getAllPermissionWithPaginationService,
  getPermissionByIdService,
  createAPermissionService,
  updateAPermissionService,
  deleteAPermissionService,
};
