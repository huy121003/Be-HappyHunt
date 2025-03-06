const getById = (req, res, next) => {
  if (!req.params.id) return sendValidationError(res, 'Id is required');
  next();
};
const update = (req, res, next) => {
  if (!req.params.id) return sendValidationError(res, 'Id is required');
  next();
};
const remove = (req, res, next) => {
  if (!req.params.id) return sendValidationError(res, 'Id is required');
  next();
};

module.exports = {
  getById,
  update,
  remove,
};
