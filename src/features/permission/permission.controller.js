const { apiHandler } = require('../../helpers');
const permissionService = require('./permission.service');

const getAll = async (req, res) => {
  try {
    const result = await permissionService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List permissions', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No permissions found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const getAllPagination = async (req, res) => {
  try {
    const result = await permissionService.getAllPagination(req.query);
    return apiHandler.sendSuccessWithData(res, 'List permissions', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No permissions found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const getById = async (req, res) => {
  try {
    const result = await permissionService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Role', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Role not found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const create = async (req, res) => {
  try {
    const result = await permissionService.create({
      ...req.body,
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(
      res,
      'Permission created successfully',
      result
    );
  } catch (error) {
    if (error.message.includes('duplicate')) {
      return apiHandler.sendConflict(res, 'Permission already exists');
    }
    if (error.message.includes('create')) {
      return apiHandler.sendErrorMessage(res, 'Failed to create permission');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const update = async (req, res) => {
  try {
    const result = await permissionService.update(req.params.id, {
      ...req.body,
      updatedBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(
      res,
      'Permission updated successfully',
      result
    );
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Permission not found');
    }
    if (error.message.includes('update')) {
      return apiHandler.sendErrorMessage(res, 'Failed to update permission');
    }
    if (error.message.includes('duplicate')) {
      return apiHandler.sendConflict(res, 'Permission already exists');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const remove = async (req, res) => {
  try {
    const result = await permissionService.remove(req.params.id);
    return apiHandler.sendCreated(
      res,
      'Permission deleted successfully',
      result
    );
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Permission not found');
    }
    if (error.message.includes('delete')) {
      return apiHandler.sendErrorMessage(res, 'Failed to delete permission');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
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
