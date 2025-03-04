const { apiHandler } = require('../../helpers');
const permissionService = require('./permission.service');

const getAll = async (req, res) => {
  try {
    const result = await permissionService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List permissions', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAllPagination = async (req, res) => {
  try {
    const result = await permissionService.getAllPagination(req.query);
    return apiHandler.sendSuccessWithData(res, 'List permissions', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  try {
    const result = await permissionService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Role', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const create = async (req, res) => {
  try {
    const result = await permissionService.create({
      ...req.body,
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Permission created successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const update = async (req, res) => {
  try {
    const result = await permissionService.update(req.params.id, {
      ...req.body,
      updatedBy: req.userAccess._id,
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Permission updated successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const remove = async (req, res) => {
  try {
    const result = await permissionService.remove(req.params.id);
    return apiHandler.sendSuccessWithData(
      res,
      'Permission deleted successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getAllPagination,
};
