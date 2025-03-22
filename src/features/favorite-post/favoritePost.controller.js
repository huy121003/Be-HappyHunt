const { apiHandler } = require('../../helpers');
const favoritePostService = require('./favoritePost.service');
const create = async (req, res) => {
  try {
    const result = await favoritePostService.create({
      ...req.body,
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(res, 'Favorite post  successfully', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const remove = async (req, res) => {
  try {
    const result = await favoritePostService.remove(
      req.params.id,
      req.userAccess._id
    );
    return apiHandler.sendCreated(res, 'Unfavorite post successfully', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAllPagination = async (req, res) => {
  try {
    const result = await favoritePostService.getAllPagination({
      ...req.query,
      createBy: req.userAccess._id,
    });
    return apiHandler.sendSuccess(
      res,
      'Fetch favorite post successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  try {
    const result = await favoritePostService.getById(
      req.params.id,
      req.userAccess._id
    );
    return apiHandler.sendSuccess(
      res,
      'Fetch favorite post successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

module.exports = {
  create,
  remove,
  getAllPagination,
  getById,
};
