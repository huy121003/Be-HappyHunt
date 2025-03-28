const { apiHandler } = require('../../helpers');
const historyClickService = require('./historyClick.service');
const getAllByPostId = async (req, res) => {
  try {
    const result = await historyClickService.getAllByPostId(
      req.params.id,
      rq.userAccess._id
    );

    return apiHandler.sendSuccessWithData(
      res,
      'Fetch history click successfully',
      result
    );
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No history click found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
const countClicksByDay = async (req, res) => {
  try {
    const result = await historyClickService.countClicksByDay(req.params.id);
    return apiHandler.sendSuccessWithData(
      res,
      'Fetch history click successfully',
      result
    );
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No history click found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred, please try again later'
    );
  }
};
module.exports = {
  getAllByPostId,
  countClicksByDay,
};
