const { apiHandler } = require('../../helpers');
const { Account } = require('../../models');

const postService = require('./post.service');
const create = async (req, res) => {
  try {
    const user = await Account.findById(req.userAccess._id).select('balance');
    if (user.balance && Number(user.balance) < Number(req.body.pricePayment)) {
      return apiHandler.sendValidationError(
        res,
        'You do not have enough money to post'
      );
    }
    const result = await postService.create({
      ...req.body,
      createdBy: req.userAccess._id,
      ...(req.body.pricePayment && {
        payment: req.body.pricePayment,
      }),
      ...(req.files && {
        images: req.files.images,
      }),
    });
    return apiHandler.sendCreated(res, 'Post created successfully', result);
  } catch (error) {
    if (error.message.includes('duplicate')) {
      return apiHandler.sendConflict(res, 'Title is already exist');
    }
    if (error.message.includes('create')) {
      return apiHandler.sendErrorMessage(res, 'Failed to create post');
    }
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
    if (error.message.includes('duplicate')) {
      return apiHandler.sendConflict(res, 'Title is already exist');
    }
    if (error.message.includes('update')) {
      return apiHandler.sendErrorMessage(res, 'Failed to update post');
    }
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
    if ((error.message = 'update')) {
      return apiHandler.sendErrorMessage(res, 'Failed to update post status');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const updateCheckingStatus = async (req, res) => {
  try {
    const result = await postService.updateCheckingStatus(req.params.id, {
      ...req.body,
      updateBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(
      res,
      'Post Checking Status updated successfully',
      result
    );
  } catch (error) {
    if (error.message.includes('update')) {
      return apiHandler.sendErrorMessage(
        res,
        'Failed to update post checking status'
      );
    }
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
    if (error.message.includes('notfound')) {
      return apiHandler.sendErrorMessage(res, 'Failed to count status');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAllPagination = async (req, res) => {
  try {
    const result = await postService.getAllPagination(
      {
        ...req.query,
      },
      req.userAccess._id
    );
    return apiHandler.sendSuccessWithData(res, 'List posts', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No post found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAllSuggestionsPagination = async (req, res) => {
  try {
    const result = await postService.getAllSuggestionsPagination(
      req.query,
      req.userAccess._id
    );
    return apiHandler.sendSuccessWithData(res, 'List posts', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No post found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  try {
    const result = await postService.getById(req.params.id, req.userAccess._id);
    return apiHandler.sendSuccessWithData(res, 'Post', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Post not found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getBySlug = async (req, res) => {
  try {
    const result = await postService.getBySlug(
      req.params.slug,
      req.userAccess._id
    );
    return apiHandler.sendSuccessWithData(res, 'Post', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Post not found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const remove = async (req, res) => {
  try {
    const result = await postService.remove(req.params.id);
    return apiHandler.sendCreated(res, 'Post removed successfully', result);
  } catch (error) {
    if (error.message.includes('delete')) {
      return apiHandler.sendErrorMessage(res, 'Post not found');
    }
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
    if (error.message.includes('notfound')) {
      return apiHandler.sendErrorMessage(res, 'Failed to count sold');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const updateClickCount = async (req, res) => {
  try {
    const result = await postService.updateClickCount(
      req.params.id,
      req.userAccess._id
    );
    return apiHandler.sendSuccessWithData(res, 'Update click count', result);
  } catch (error) {
    if (error.message.includes('update')) {
      return apiHandler.sendErrorMessage(res, 'Failed to update click count');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const updatePushedAt = async (req, res) => {
  try {
    const result = await postService.updatePushedAt(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Update pushedAt', result);
  } catch (error) {
    if (error.message.includes('update')) {
      return apiHandler.sendErrorMessage(res, 'Failed to update pushedAt');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const countStatusProfile = async (req, res) => {
  try {
    const result = await postService.countStatusProfile(req.params._id);
    return apiHandler.sendSuccessWithData(
      res,
      'Count Status successfully',
      result
    );
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendErrorMessage(res, 'Failed to count status');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getNewPostStatistics = async (req, res) => {
  try {
    const result = await postService.getNewPostStatistics(req.query);
    return apiHandler.sendSuccessWithData(res, 'List posts', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No data in this time range');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const totalPostSelling = async (req, res) => {
  try {
    const result = await postService.totalPostSelling();
    return apiHandler.sendSuccessWithData(res, 'Total posts', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const totalPostSellingByCategory = async (req, res) => {
  try {
    const result = await postService.totalPostSellingByCategory();
    return apiHandler.sendSuccessWithData(res, 'Total posts', result);
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
  updateCheckingStatus,
  getAllSuggestionsPagination,
  updatePushedAt,
  countStatusProfile,
  getNewPostStatistics,
  totalPostSelling,
  totalPostSellingByCategory,
};
