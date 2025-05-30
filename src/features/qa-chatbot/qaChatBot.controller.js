const { apiHandler } = require('../../helpers');
const qaChatbotService = require('./qaChatBot.service');

const create = async (req, res) => {
  try {
    const result = await qaChatbotService.create({
      ...req.body,
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Qa chatbot created successfully',
      result
    );
  } catch (error) {
    if (error.message.includes('create')) {
      return apiHandler.sendErrorMessage(res, 'Failed to create qa chatbot');
    }
    if (error.message.includes('duplicate')) {
      return apiHandler.sendConflict(res, 'Qa chatbot already exists');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const update = async (req, res) => {
  try {
    const result = await qaChatbotService.update(req.params.id, {
      ...req.body,
      updatedBy: req.userAccess._id,
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Qa chatbot updated successfully',
      result
    );
  } catch (error) {
    if (error.message.includes('update')) {
      return apiHandler.sendErrorMessage(res, 'Failed to update qa chatbot');
    }
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Qa chatbot not found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const remove = async (req, res) => {
  try {
    const result = await qaChatbotService.remove(req.params.id);
    return apiHandler.sendSuccessWithData(
      res,
      'Qa chatbot deleted successfully',
      result
    );
  } catch (error) {
    if (error.message.includes('remove')) {
      return apiHandler.sendErrorMessage(res, 'Failed to delete qa chatbot');
    }
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Qa chatbot not found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const getAllPagination = async (req, res) => {
  try {
    const result = await qaChatbotService.getAllPagination(req.query);
    return apiHandler.sendSuccessWithData(res, 'Qa chatbot list', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Qa chatbot not found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const getAll = async (req, res) => {
  try {
    const result = await qaChatbotService.getAll();
    return apiHandler.sendSuccessWithData(res, 'Qa chatbot list', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Qa chatbot not found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const getById = async (req, res) => {
  try {
    const result = await qaChatbotService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Qa chatbot details', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Qa chatbot not found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const getAnswer = async (req, res) => {
  try {
    const result = await qaChatbotService.getAnswer(req.body);
    return apiHandler.sendSuccessWithData(res, 'Answer', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Qa chatbot not found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const getDescription = async (req, res) => {
  try {
    const result = await qaChatbotService.getDescription(req.body);
    return apiHandler.sendSuccessWithData(res, 'Product description', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Qa chatbot not found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
module.exports = {
  create,
  update,
  remove,
  getAllPagination,
  getAll,
  getById,
  getAnswer,
  getDescription
};
