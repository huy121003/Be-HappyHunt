const Evaluate = require('../../models/evaluate');
const exportFilter = require('./evaluate.filter');

const create = async (data) => {
  try {
    const result = await Evaluate.create({
      ...data,
    });
    if (!result) throw new Error('create');

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getByIdUser = async (userId, data) => {
  const { page, size, sort, ...filter } = exportFilter(data);
  const [totalDocuments, result] = await Promise.all([
    Evaluate.countDocuments({
      ...filter,
      target: userId,
    }),
    Evaluate.find({
      ...filter,
      target: userId,
    })
      .select('-__v')
      .populate('createdBy', '_id name avatar slug')
      .populate('target', '_id name avatar slug ')
      .populate('post', '_id name slug images price status')
      .sort(sort)
      .limit(size)
      .skip(page * size)
      .lean()
      .exec(),
  ]);
  if (!result) throw new Error('notfound');

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
    throw new Error('notfound');
  }

  const count = result.length;

  const totalStars = result.reduce((sum, review) => sum + review.star, 0);

  const averageStar = totalStars / count;

  return {
    count,
    averageStar: parseFloat(averageStar.toFixed(1)) || 0,
  };
};
const countEvaluate = async (target) => {
  const [evalueteBySeller, evalueteByBuyer] = await Promise.all([
    Evaluate.find({ target: target, isSeller: true }).countDocuments(),
    Evaluate.find({ target: target, isSeller: false }).countDocuments(),
  ]);
  return {
    evaluateBySeller: evalueteBySeller || 0,
    evaluateByBuyer: evalueteByBuyer || 0,
    totalEvaluate: (evalueteBySeller || 0) + (evalueteByBuyer || 0),
  };
};
const getDetail = async (data) => {
  try {
    const result = await Evaluate.findOne(data);
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const remove = async (id) => {
  try {
    const result = await Evaluate.findByIdAndDelete(id);
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getById = async (id) => {
  try {
    const result = await Evaluate.findById(id)
      .select('-__v')
      .populate('createdBy', '_id name avatar slug')
      .populate('target', '_id name avatar slug ')
      .populate('post', '_id name slug images price status')
      .lean()
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  create,
  getByIdUser,
  countByUserId,
  getDetail,
  countEvaluate,
  remove,
  getById,
};
