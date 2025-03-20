const Evaluate = require('../../models/evaluate');
const exportFilter = require('./evaluate.filter');

const create = async (data) => {
  const result = await Evaluate.create({
    ...data,
  });
  if (!result) throw new Error('Create evaluate failed');

  return result;
};

const getByIdUser = async (userId, data) => {
  const { page, size, sort, ...filter } = exportFilter(data);
  const [totalDocuments, result] = await Promise.all([
    Evaluate.countDocuments(filter),
    Evaluate.find({ target: userId })
      .select('-__v')
      .sort(sort)
      .limit(size)
      .skip(page * size)
      .lean()
      .exec(),
  ]);
  if (!result || !totalDocuments) throw new Error('Fetch evaluate failed');
  return {
    documentList: result,
    totalDocuments,
    pageSize: size,
    pageNumber: page,
  };
};
const countByUserId = async (userId) => {
  const result = await Evaluate.find({ target: userId });

  if (!result) {
    throw new Error('Evaluate not found');
  }

  const count = result.length;

  const totalStars = result.reduce((sum, review) => sum + review.star, 0);

  const averageStar = totalStars / count;

  return {
    count,
    averageStar: parseFloat(averageStar.toFixed(1)) || 0,
  };
};

module.exports = {
  create,
  getByIdUser,
  countByUserId,
};
