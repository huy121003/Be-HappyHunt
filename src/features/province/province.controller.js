const { apiHandler } = require('../../helpers');
const provinceService = require('./province.service');
const create = async (req, res) => {
  try {
    const result = await provinceService.create({
      ...req.body,
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(res, 'Province created successfully', result);
  } catch (error) {
    if (error.message.includes('duplicate')) {
      return apiHandler.sendConflict(res, 'Province already exists');
    }
    if (error.message.includes('create')) {
      return apiHandler.sendErrorMessage(res, 'Failed to create province');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAll = async (req, res) => {
  try {
    const result = await provinceService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List provinces', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No provinces found');
    }

    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await provinceService.getById(id);
    return apiHandler.sendSuccessWithData(res, 'Province', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Province not found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const update = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await provinceService.update(id, {
      ...req.body,
      updatedBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(res, 'Province updated successfully', result);
  } catch (error) {
    if (error.message.includes('update')) {
      return apiHandler.sendConflict(res, 'Province already exists');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await provinceService.remove(id);
    return apiHandler.sendCreated(res, 'Province deleted successfully', result);
  } catch (error) {
    if (error.message.includes('delete')) {
      return apiHandler.sendErrorMessage(res, 'Failed to delete province');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
