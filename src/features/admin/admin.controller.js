const adminService = require('./admin.service');
const { apiHandler } = require('../../helpers');
const create = async (req, res) => {
  try {
    const result = await adminService.create({
      ...req.body,
      createdBy: req.userAccess._id,
      ...(req.files && { avatar: req.files.avatar }),
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Account created successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAll = async (req, res) => {
  try {
    const result = await adminService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List accounts', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  try {
    const result = await adminService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Account', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const update = async (req, res) => {
  try {
    const result = await adminService.update(req.params.id, {
      ...req.body,
      ...(req.files && { avatar: req.files.avatar }),
      updatedBy: req.userAccess._id,
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Account updated successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const remove = async (req, res) => {
  try {
    const result = await adminService.remove(req.params.id);
    return apiHandler.sendSuccessWithData(
      res,
      'Account removed successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const banned = async (req, res) => {
  try {
    const result = await adminService.banned(req.params.id, {
      isBanned: req.body.isBanned,
      updatedBy: req.userAccess._id,
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Account banned successfully',
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
  banned,
};
