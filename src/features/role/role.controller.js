const { apiHandler, parseSortQuery } = require('../../helpers');
const { Role } = require('../../models');
const roleService = require('./role.service');

const getAll = async (req, res) => {
  try {
    const result = await roleService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List roles', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  try {
    const result = await roleService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Role', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const create = async (req, res) => {
  try {
    const result = await roleService.create(req.body);
    return apiHandler.sendSuccessWithData(
      res,
      'Role created successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const update = async (req, res) => {
  try {
    const result = await roleService.update(req.params.id, req.body);
    return apiHandler.sendSuccessWithData(
      res,
      'Role updated successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const remove = async (req, res) => {
  try {
    const result = await roleService.remove(req.params.id);
    return apiHandler.sendSuccessWithData(
      res,
      'Role deleted successfully',
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
};
