const adminService = require('./admin.service');
const { apiHandler } = require('../../helpers');
const create = async (req, res) => {
  try {
    const result = await adminService.create({
      ...req.body,
      createdBy: req.userAccess._id,
      ...(req.files && { avatar: req.files.avatar }),
    });

    return apiHandler.sendCreated(res, 'Account created successfully', result);
  } catch (error) {
    if (error.message.includes('duplicate')) {
      return apiHandler.sendConflict(res, 'Username or Email already exists');
    }
    if (error.message.includes('create')) {
      return apiHandler.sendErrorMessage(res, 'Failed to create admin account');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
  }
};

const getAll = async (req, res) => {
  try {
    const result = await adminService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List accounts', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No accounts found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
  }
};
const getById = async (req, res) => {
  try {
    const result = await adminService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Account', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Account not found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
  }
};
const update = async (req, res) => {
  try {
    const result = await adminService.update(req.params.id, {
      ...req.body,
      ...(req.files && { avatar: req.files.avatar }),
      updatedBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(res, 'Account updated successfully', result);
  } catch (error) {
    if (error.message.includes('duplicate')) {
      return apiHandler.sendConflict(res, 'Username or Email already exists');
    }
    if (error.message.includes('update')) {
      return apiHandler.sendErrorMessage(res, 'Failed to update admin account');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
  }
};
const remove = async (req, res) => {
  try {
    const result = await adminService.remove(req.params.id);
    return apiHandler.sendCreated(res, 'Account removed successfully', result);
  } catch (error) {
    if (error.message.includes('delete')) {
      return apiHandler.sendErrorMessage(res, 'Failed to delete admin account');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
  }
};
const banned = async (req, res) => {
  try {
    const result = await adminService.banned(req.params.id, {
      isBanned: req.body.isBanned,
      updatedBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(res, 'Account banned successfully', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Account not found');
    }
    if (error.message.includes('update')) {
      return apiHandler.sendErrorMessage(
        res,
        'Failed to update account status'
      );
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  banned,
};
