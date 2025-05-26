require('dotenv').config();
const { uploadMultiple } = require('../file/file.service');
const exportFilter = require('./report.filter');
const dayjs = require('dayjs');
const evaluateService = require('../evaluate/evaluate.service');
const Report = require('../../models/report');
const userService = require('../user/user.service');
const postService = require('../post/post.service');

const create = async (data) => {
  const { images, ...rest } = data;
  const check = await checkExit(data.createdBy, data.target);
  if (!check) throw new Error('exit');

  try {
    let imageUrls = [];
    if (images) {
      imageUrls = (await uploadMultiple(images)) || [];
    }
    const result = await Report.create({
      ...rest,
      images: imageUrls,
    });
    if (!result) throw new Error('create');
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
const updateStatus = async (id, data) => {
  try {
    const result = await Report.findByIdAndUpdate(
      id,
      {
        status: data.status,
        updatedBy: data.updatedBy,
      },
      { new: true }
    );
    if (!result) throw new Error('update');
    if (data.status === 'APPROVED' && result.targetType === 'review') {
      const evaluate = await evaluateService.remove(result.target);
      if (!evaluate) throw new Error('update');
    }
    if (result.targetType === 'account' && data.status === 'APPROVED') {
      const updateReportCount = await userService.updateReportCount(
        result.target
      );
      if (!updateReportCount) throw new Error('update');
    }
    if (result.targetType === 'post' && data.status === 'APPROVED') {
      const post = await postService.getById(result.target);
      const updateReportCount = await userService.updateReportCount(
        post.createdBy._id
      );
      if (!updateReportCount) throw new Error('update');
    }
    if (result.targetType === 'review' && data.status === 'APPROVED') {
      const review = await evaluateService.getById(result.target);
      const updateReportCount = await userService.updateReportCount(
        review.createdBy._id
      );
      if (!updateReportCount) throw new Error('update');
    }
    if (data.status === 'SPAM') {
      const updateSpamCount = await userService.updateReportCount(
        result.createdBy
      );
      if (!updateSpamCount) throw new Error('update');
    }
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
const remove = async (id) => {
  try {
    const result = await Report.findByIdAndDelete(id);
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAll = async (query) => {
  try {
    const { page, size, sort, search, ...filter } = exportFilter(query);
    const [totalDocuments, result] = await Promise.all([
      Report.countDocuments(filter),
      Report.find(filter)
        .sort(sort)
        .limit(size)
        .skip(page * size)
        .populate('createdBy', 'name email avatar slug _id')
        .populate('updatedBy', 'name email avatar slug _id')
        .lean()
        .exec(),
    ]);
    return {
      documentList: result,
      totalDocuments,
      pageSize: size,
      pageNumber: page,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const getById = async (id) => {
  try {
    const result = await Report.findById(id)
      .populate('createdBy', 'name email avatar slug _id')
      .populate('updatedBy', 'name email avatar slug _id')
      .lean()
      .exec();
    if (!result) throw new Error('notfound');
    if (result.targetType === 'account') {
      result.account = await userService.getById(result.target);
    }
    if (result.targetType === 'post') {
      result.post = await postService.getById(result.target);
    }
    if (result.targetType === 'review') {
      result.review = await evaluateService.getById(result.target);
    }
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
const checkExit = async (createdBy, target) => {
  try {
    const result = await Report.findOne({
      createdBy,
      target,
    });
    if (result) return false;
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  create,
  updateStatus,
  remove,
  getAll,
  getById,
};
