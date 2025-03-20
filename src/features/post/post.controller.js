const { apiHandler } = require('../../helpers');

const postService = require('./post.service');
const create = async (req, res) => {
  try {
    const result = await postService.create({
      ...req.body,
      createdBy: req.userAccess._id,
      ...(req.files && {
        images: req.files.images,
      }),
    });
    return apiHandler.sendCreated(res, 'Post created successfully', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const update = async (req, res) => {
  try {
    const result = await postService.update(req.params.id, {
      ...req.body,
      updateBy: req.userAccess._id,
      ...(req.files && {
        images: req.files.images,
      }),
    });
    return apiHandler.sendCreated(res, 'Post updated successfully', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const updateStatus = async (req, res) => {
  try {
    const result = await postService.updateStatus(req.params.id, {
      ...req.body,
      ...(req.body.status === 'HIDDEN' && {
        isSold: true,
      }),
      updateBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(
      res,
      'Post Status updated successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const countStatus = async (req, res) => {
  try {
    const result = await postService.countStatus(Number(req.params._id));
    return apiHandler.sendSuccessWithData(
      res,
      'Count Status successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAllPagination = async (req, res) => {
  try {
    const result = await postService.getAllPagination({
      ...req.query,
      createdBy: Number(req.params.id),
    });
    return apiHandler.sendSuccessWithData(res, 'List posts', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  try {
    const result = await postService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Post', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getBySlug = async (req, res) => {
  try {
    const result = await postService.getBySlug(req.params.slug);
    return apiHandler.sendSuccessWithData(res, 'Post', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const remove = async (req, res) => {
  try {
    const result = await postService.remove(req.params.id);
    return apiHandler.sendCreated(res, 'Post removed successfully', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const countSold = async (req, res) => {
  try {
    const result = await postService.countSold(req.params.id);
    return apiHandler.sendSuccessWithData(
      res,
      'Count Sold successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const updateClickCount = async (req, res) => {
  try {
    const result = await postService.updateClickCount(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Update click count', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

module.exports = {
  create,
  updateStatus,
  countStatus,
  getAllPagination,
  getById,
  remove,
  getBySlug,
  update,
  countSold,
  updateClickCount,
};
