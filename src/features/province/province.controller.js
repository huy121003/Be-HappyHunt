const { apiHandler } = require('../../helpers');
const provinceService = require('./province.service');
const create = async (req, res) => {
  try {
    const result = await provinceService.create(req.body);
    return apiHandler.sendSuccessWithData(
      res,
      'Province created successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAll = async (req, res) => {
  try {
    const result = await provinceService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List provinces', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await provinceService.getById(id);
    return apiHandler.sendSuccessWithData(res, 'Province', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const update = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await provinceService.update(id, req.body);
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
    const result = await provinceService.deleteById(id);
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
  create,
  getAll,
  getById,
  update,
  remove,
};
