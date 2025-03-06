const { apiHandler } = require('../../helpers');
const bannerService = require('./banner.service');
require('dotenv').config();
const create = async (req, res) => {
  try {
    const result = await bannerService.create({
      ...req.body,
      createdBy: req.userAccess._id,
      ...(req.files && { image: req.files.image }),
    });
    return apiHandler.sendCreated(res, 'Banner created successfully', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAll = async (req, res) => {
  try {
    const result = await bannerService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List banners', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAllPagination = async (req, res) => {
  try {
    const result = await bannerService.getAllPagination(req.query);
    return apiHandler.sendSuccessWithData(res, 'List banners', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  try {
    const result = await bannerService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Banner', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const update = async (req, res) => {
  try {
    const result = await bannerService.update(req.params.id, {
      ...req.body,
      updatedBy: req.userAccess._id,
      ...(req.files && { image: req.files.image }),
    });
    return apiHandler.sendCreated(res, 'Banner updated successfully', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const remove = async (req, res) => {
  try {
    const result = await bannerService.remove(req.params.id);
    return apiHandler.sendCreated(res, 'Banner deleted successfully', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const show = async (req, res) => {
  try {
    const result = await bannerService.show(req.params.id, {
      ...req.body,
      updatedBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(res, 'Banner updated successfully', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

module.exports = {
  create,
  getAll,
  getAllPagination,
  getById,
  update,
  remove,
  show,
};
