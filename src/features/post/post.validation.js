const { apiHandler } = require('../../helpers');
const { Post } = require('../../models');

const create = async (req, res, next) => {
  if (!req.body.name)
    return apiHandler.sendValidationError(res, 'Title is required');
  const searchName = await Post.findOne({
    name: req.body.name,
  });
  if (searchName)
    return apiHandler.sendValidationError(res, 'The title has existed');
  if (req.files.images.length < 3 && req.files.images > 10)
    return apiHandler.sendValidationError(res, 'Please upload 3-10 images');
  next();
};
module.exports = {
  create,
};
