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
    let pushData = {};
    if (result.targetType === 'account') {
      pushData.accountBlock = result.target;
    } else if (result.targetType === 'post') {
      pushData.postBlock = result.target;
    } else if (result.targetType === 'review') {
      pushData.reviewBlock = result.target;
    }

    // Chỉ update nếu có trường cần push
    if (Object.keys(pushData).length > 0) {
      await userService.update(result.createdBy, {
        $push: pushData,
      });
    }

    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
const updateStatus = async (id, data) => {
  console.log('updateStatus', id, data);
  try {
    const result = await Report.findByIdAndUpdate(
      id,
      {
        status: data.status,
        updatedBy: data.updatedBy,
      },
      { new: true }
    );

    if (!result) {
      throw new Error('Update failed or document not found.');
    }

    if (data.status === 'APPROVED') {
      let updateReportCount;

      switch (result.targetType) {
        case 'account':
          updateReportCount = await userService.updateReportCount(
            result.target
          );
          break;
        case 'post':
          const post = await postService.getById(result.target, null);
          updateReportCount = await userService.updateReportCount(
            post.createdBy._id
          );
          break;
        case 'review':
          const review = await evaluateService.getById(result.target);
          updateReportCount = await userService.updateReportCount(
            review.createdBy._id
          );
          break;
        default:
          break;
      }

      if (!updateReportCount) {
        throw new Error('Failed to update report count.');
      }
    } else if (data.status === 'SPAM') {
      const updateSpamCount = await userService.updateReportCount(
        result.createdBy
      );
      if (!updateSpamCount) {
        throw new Error('Failed to update spam count.');
      }
    }

    return result;
  } catch (error) {
    console.error('Error in updateStatus:', error);
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
    console.error(error);
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
