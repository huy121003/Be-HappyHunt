const { apiHandler, parseSortQuery } = require('../../helpers');
const { Role } = require('../../models');
const roleService = require('./role.service');

const getAll = async (req, res) => {
  try {
    const result = await roleService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List roles', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No roles found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  try {
    const result = await roleService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Role', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Role not found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const create = async (req, res) => {
  try {
    const result = await roleService.create({
      ...req.body,
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(res, 'Role created successfully', result);
  } catch (error) {
    if (error.message.includes('duplicate')) {
      return apiHandler.sendConflict(res, 'Role already exists');
    }
    if (error.message.includes('create')) {
      return apiHandler.sendErrorMessage(res, 'Failed to create role');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const update = async (req, res) => {
  try {
    const result = await roleService.update(req.params.id, {
      ...req.body,
      updatedBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(res, 'Role updated successfully', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Role not found');
    }
    if (error.message.includes('duplicate')) {
      return apiHandler.sendConflict(res, 'Role already exists');
    }
    if (error.message.includes('update')) {
      return apiHandler.sendConflict(res, 'Role already exists');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const remove = async (req, res) => {
  try {
    const result = await roleService.remove(req.params.id);
    return apiHandler.sendCreated(res, 'Role deleted successfully', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Role not found');
    }
    if (error.message.includes('delete')) {
      return apiHandler.sendErrorMessage(res, 'Failed to delete role');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
