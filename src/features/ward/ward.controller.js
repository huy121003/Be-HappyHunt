const { apiHandler } = require('../../helpers');
const wardService = require('./ward.service');

const getAll = async (req, res) => {
  try {
    const result = await wardService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List provinces', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await wardService.getById(id);
    return apiHandler.sendSuccessWithData(res, 'Province', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const create = async (req, res) => {
  try {
    const result = await wardService.create({
      ...req.body,
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Province created successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const update = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await wardService.update(id, {
      ...req.body,
      updatedBy: req.userAccess._id,
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Province updated successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await wardService.remove(id);
    return apiHandler.sendSuccessWithData(
      res,
      'Province deleted successfully',
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
