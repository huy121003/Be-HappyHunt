const { apiHandler } = require('../../helpers');
const districtService = require('./district.service');

const getAll = async (req, res) => {
  try {
    const result = await districtService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List districts', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No districts found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const getById = async (req, res) => {
  try {
    const result = await districtService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'District', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'District not found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const create = async (req, res) => {
  try {
    const result = await districtService.create({
      ...req.body,
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(res, 'District created', result);
  } catch (error) {
    if (error.message.includes('duplicate')) {
      return apiHandler.sendConflict(res, 'District already exists');
    }
    if (error.message.includes('create')) {
      return apiHandler.sendErrorMessage(res, 'Failed to create district');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const update = async (req, res) => {
  try {
    const result = await districtService.update(request.params.id, {
      ...req.body,
      updatedBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(res, 'District updated', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'District not found');
    }
    if (error.message.includes('update')) {
      return apiHandler.sendErrorMessage(res, 'Failed to update district');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const remove = async (req, res) => {
  try {
    const result = await districtService.remove(req.params.id);
    return apiHandler.sendCreated(res, 'District removed', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'District not found');
    }
    if (error.message.includes('delete')) {
      return apiHandler.sendErrorMessage(res, 'Failed to delete district');
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
};
