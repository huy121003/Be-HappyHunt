const Joi = require('joi');

const adminValidation = {
  getAll: {
    query: Joi.object({
      page: Joi.number().min(0).default(0),
      size: Joi.number().min(1).default(10),
      sort: Joi.string().default('-createdAt'),
      role: Joi.number().optional(),
      name: Joi.string().allow('', null).optional(),
      isBanned: Joi.boolean().allow('', null).optional(),
      phoneNumber: Joi.string().allow('', null).optional(),
    }).options({ convert: true, stripUnknown: true }),
  },
};

module.exports = adminValidation;
