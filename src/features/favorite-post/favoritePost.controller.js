const { apiHandler } = require('../../helpers');
const { FavoritePost } = require('../../models');
const favoritePostService = require('./favoritePost.service');
const create = async (req, res) => {
  try {
    const count = await FavoritePost.countDocuments({
      createdBy: req.userAccess._id,
    });
    if (count >= 100) {
      return apiHandler.sendValidationError(
        res,
        'You have reached the maximum number of favorite posts'
      );
    }
    const result = await favoritePostService.create({
      ...req.body,
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(res, 'Favorite post  successfully', result);
  } catch (error) {
    if (error.message.includes('create')) {
      return apiHandler.sendErrorMessage(res, 'Failed to create favorite post');
    }

    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
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
    if (error.message.includes('delete')) {
      return apiHandler.sendErrorMessage(res, 'Failed to unfavorite post');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const getAllPagination = async (req, res) => {
  try {
    const result = await favoritePostService.getAllPagination({
      ...req.query,
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Fetch favorite post successfully',
      result
    );
  } catch (error) {

    if (error.message === 'notfound') {
      return apiHandler.sendNotFound(res, 'No favorite post found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const getById = async (req, res) => {
  try {
    const result = await favoritePostService.getById(
      req.params.id,
      req.userAccess._id
    );
    return apiHandler.sendSuccessWithData(
      res,
      'Fetch favorite post successfully',
      result
    );
  } catch (error) {
    if (error.message === 'notfound') {
      return apiHandler.sendNotFound(res, 'Favorite post not found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const removeById = async (req, res) => {
  try {
    const result = await favoritePostService.removeById(req.params.id);
    return apiHandler.sendCreated(
      res,
      'Favorite post removed successfully',
      result
    );
  } catch (error) {
    if (error.message === 'delete') {
      return apiHandler.sendErrorMessage(res, 'Failed to remove favorite post');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};

module.exports = {
  create,
  remove,
  getAllPagination,
  getById,
  removeById,
};
