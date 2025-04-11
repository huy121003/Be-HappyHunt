const { apiHandler } = require('../../helpers');
const sampleMessageService = require('./sampleMessage.service');

const create = async (req, res) => {
  try {
    const sampleMessage = await sampleMessageService.create({
      ...req.body,
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Sample message created successfully',
      sampleMessage
    );
  } catch (error) {
    if (error.message.includes('create')) {
      return apiHandler.sendErrorMessage(
        res,
        'Failed to create sample message'
      );
    }
    if (error.message.includes('max')) {
      return apiHandler.sendValidationError(
        res,
        'You have reached the maximum number of sample messages'
      );
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const update = async (req, res) => {
  try {
    const sampleMessage = await sampleMessageService.update(req.params.id, {
      ...req.body,
      updatedBy: req.userAccess._id,
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Sample message updated successfully',
      sampleMessage
    );
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Sample message not found');
    }
    if (error.message.includes('delete')) {
      return apiHandler.sendErrorMessage(
        res,
        'Failed to delete sample message'
      );
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const remove = async (req, res) => {
  try {
    const sampleMessage = await sampleMessageService.remove(req.params.id);
    return apiHandler.sendSuccessWithData(
      res,
      'Sample message removed successfully',
      sampleMessage
    );
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Sample message not found');
    }
    if (error.message.includes('delete')) {
      return apiHandler.sendErrorMessage(
        res,
        'Failed to delete sample message'
      );
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAll = async (req, res) => {
  try {
    const sampleMessages = await sampleMessageService.getAll({
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Sample messages retrieved successfully',
      sampleMessages
    );
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Sample message not found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  try {
    const sampleMessage = await sampleMessageService.getById(req.params.id);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
module.exports = {
  create,
  update,
  remove,
  getAll,
  getById,
};
