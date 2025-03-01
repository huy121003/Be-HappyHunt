const { apiHandler } = require('../../helpers');
const districtService = require('./district.service');

const getAll = async (req, res) => {
  try {
    const result = await districtService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List districts', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  try {
    const result = await districtService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'District', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const create = async (req, res) => {
  try {
    const result = await districtService.create(req.body);
    return apiHandler.sendSuccessWithData(res, 'District created', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const update = async (req, res) => {
  try {
    const result = await districtService.update(request.params.id, req.body);
    return apiHandler.sendSuccessWithData(res, 'District updated', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const remove = async (req, res) => {
  try {
    const result = await districtService.remove(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'District removed', result);
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
