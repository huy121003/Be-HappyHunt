const { apiHandler } = require('../../helpers');
const { HistorySearch } = require('../../models');
const HistorySearchServcie = require('./search.service');
const create = async (req, res) => {
  try {
    const data = req.body;

    const find = await HistorySearch.findOne({
      createdBy: req.userAccess._id,
      keyword: data.keyword,
    });
    const found = find ? true : false;
    const result = await HistorySearchServcie.create(
      {
        ...data,
        createdBy: req.userAccess._id,
      },
      found
    );
    return apiHandler.sendCreated(
      res,
      'History search created successfully',
      result
    );
  } catch (error) {
    if (error.message === 'create') {
      return apiHandler.sendErrorMessage(
        res,
        'Error during history search creation'
      );
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAllPagination = async (req, res) => {
  try {
    const result = await HistorySearchServcie.getAllPagination({
      ...req.query,
      createdBy: Number(req.userAccess._id),
    });
    return apiHandler.sendSuccessWithData(res, 'History search', result);
  } catch (error) {
    if (error.message === 'notfound') {
      return apiHandler.sendNotFound(res, 'History search not found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const remove = async (req, res) => {
  try {
    const result = await HistorySearchServcie.remove(req.params.id);
    return apiHandler.sendCreated(
      res,
      'History search deleted successfully',
      result
    );
  } catch (error) {
    if (error.message === 'delete') {
      return apiHandler.sendErrorMessage(res, 'History search not found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
module.exports = {
  create,
  getAllPagination,
  remove,
};
