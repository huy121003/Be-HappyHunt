const { apiHandler } = require('../../helpers');
const chatService = require('./chat.service');

const getBySlug = async (req, res) => {
  try {
    const chat = await chatService.getDetailBySlug(req.params.slug);
    return apiHandler.sendSuccessWithData(
      res,
      'Chat fetched successfully',
      chat
    );
  } catch (error) {
    if (error.message.includes('not found')) {
      return apiHandler.sendNotFound(res, 'Chat not found');
    }
    return apiHandler.sendErrorMessage(res, error);
  }
};

module.exports = {
  getBySlug,
};
