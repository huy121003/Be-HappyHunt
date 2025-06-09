const Report = require('../../models/report');
const { apiHandler } = require('../../helpers');
const reportService = require('./report.service');
const create = async (req, res) => {
  try {
    const result = await reportService.create({
      ...req.body,
      ...(req.files && {
        images: req.files.images,
      }),
      createdBy: req.userAccess._id,
      ...(req.files && { images: req.files.images }),
    });
    return apiHandler.sendCreated(res, 'Report created successfully', result);
  } catch (error) {
    if (error.message.includes('exit')) {
      return apiHandler.sendConflict(res, 'You have already reported this');
    }
    if (error.message.includes('create')) {
      return apiHandler.sendErrorMessage(res, 'Failed to create report');
    }

    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
  }
};

const updateStatus = async (req, res) => {
  try {
    const result = await reportService.updateStatus(req.params.id, {
      ...req.body,
      updatedBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(
      res,
      'Report status updated successfully',
      result
    );
  } catch (error) {
    if (error.message === 'update') {
      return apiHandler.sendErrorMessage(res, 'Failed to update report status');
    }
    return apiHandler.sendErrorMessage(res, error);
  }
};
const remove = async (req, res) => {
  try {
    const result = await reportService.remove(req.params.id);
    return apiHandler.sendSuccessWithData(
      res,
      'Report removed successfully',
      result
    );
  } catch (error) {
    if (error.message === 'notfound') {
      return apiHandler.sendNotFound(res, 'Report not found');
    }
    return apiHandler.sendErrorMessage(res, error);
  }
};
const getAll = async (req, res) => {
  try {
    const result = await reportService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List of reports', result);
  } catch (error) {
    if (error.message === 'notfound') {
      return apiHandler.sendNotFound(res, 'No reports found');
    }
    return apiHandler.sendErrorMessage(res, error);
  }
};
const getById = async (req, res) => {
  try {
    const result = await reportService.getById(req.params.id);

    return apiHandler.sendSuccessWithData(res, 'Report details', result);
  } catch (error) {
    if (error.message === 'notfound') {
      return apiHandler.sendNotFound(res, 'Report not found');
    }
    return apiHandler.sendErrorMessage(res, error);
  }
};
module.exports = {
  create,
  updateStatus,
  remove,
  getAll,
  getById,
};
