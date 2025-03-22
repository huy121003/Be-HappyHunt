const historyClickService = require('./historyClick.service');
const getAllByPostId = async (req, res) => {
  try {
    const result = await historyClickService.getAllByPostId(
      req.params.id,
      rq.userAccess._id
    );

    return apiHandler.sendSuccess(
      res,
      'Fetch history click successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const countClicksByDay = async (req, res) => {
  try {
    const result = await historyClickService.countClicksByDay(req.params.id);
    return apiHandler.sendSuccess(
      res,
      'Fetch history click successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
module.exports = {
  getAllByPostId,
  countClicksByDay,
};
