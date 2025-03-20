require('dotenv').config();
const { uploadMultiple } = require('../file/file.service');
const path = require('path');
const { Post } = require('../../models');
const autoSlug = require('../../helpers/autoSlug');
const exportFilter = require('./post.filter');
const fs = require('fs');
const uploadImages = require('../../helpers/uploadImages');
const create = async (data) => {
  let imageUrls = [];

  if (data.images) {
    imageUrls = (await uploadMultiple(data.images)) || [];
  }

  const result = await Post.create({
    ...data,
    images: imageUrls.map((url, index) => {
      return {
        url,
        index: index + 1,
      };
    }),
    status: 'WAITING',
    address: JSON.parse(data.address),
    attributes: JSON.parse(data.attributes),
    slug: autoSlug(data.name),
  });
  if (!result) throw new Error('Create post failed');

  return result;
};
const update = async (id, data) => {
  let { images, saveImages = [], address, attributes, ...restData } = data;
  let imageUrls = JSON.parse(saveImages);

  if (images) {
    const newImages = (await uploadMultiple(images)) || [];
    imageUrls = imageUrls.concat(newImages);
  }

  const updateQuery = {
    ...restData,
    images: imageUrls,
    status: 'WAITING',
    ...(address && { address: JSON.parse(address) }),
    ...(attributes && { attributes: JSON.parse(attributes) }),
    slug: autoSlug(data.name),
  };

  const result = await Post.findByIdAndUpdate(id, updateQuery, {
    new: true,
    runValidators: true,
  });
  if (!result) throw new Error('Update post failed');

  return result;
};

const updateStatus = async (id, data) => {
  const result = await Post.findByIdAndUpdate(id, data, { new: true });
  if (!result) throw new Error('Update status post failed');

  return result;
};
const countStatus = async (id) => {
  const result = await Post.aggregate([
    {
      $match: { createdBy: id },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);
  if (!result) throw new Error('Count status failed');

  const counts = result.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  // Calculate the total for "WAITING" and "WAITING|AI_CHECKING_FAILED"
  const totalWaitingAndFailed =
    (counts['WAITING'] || 0) + (counts['WAITING|AI_CHECKING_FAILED'] || 0);

  return {
    SELLING: counts['SELLING'] || 0,
    HIDDEN: counts['HIDDEN'] || 0,
    REJECTED: counts['REJECTED'] || 0,
    WAITING: totalWaitingAndFailed,
    EXPIRED: counts['EXPIRED'] || 0,
  };
};
const getAllPagination = async (data) => {
  const { page, size, sort, ...filter } = (await exportFilter(data)).filter;
  const [totalDocuments, result] = await Promise.all([
    Post.countDocuments(filter),
    Post.find(filter)
      .select('name _id status price images createdAt slug isIndividual')
      .populate(
        'category categoryParent address.province address.district address.ward',
        'name _id avatar phoneNumber'
      )
      .sort(sort)
      .limit(size)
      .skip(page * size)
      .exec(),
  ]);

  if (!result || !totalDocuments) throw new Error('Fetch post failed');

  return {
    documentList: result,
    totalDocuments,
    pageSize: size,
    pageNumber: page,
  };
};
const getById = async (id) => {
  const result = await Post.findById(id)
    .select(' -updatedAt -__v')
    .populate(
      'category categoryParent address.province address.district address.ward createdBy',
      'name _id avatar phoneNumber'
    )
    .exec();
  if (!result) throw new Error('Post not found');
  return result;
};
const getBySlug = async (slug) => {
  const result = await Post.findOne({ slug })
    .select(' -updatedAt -__v')
    .populate(
      'category categoryParent address.province address.district address.ward createdBy',
      'name _id avatar phoneNumber'
    )
    .exec();
  if (!result) throw new Error('Post not found');
  return result;
};
const remove = async (id) => {
  const result = await Post.deleteById(id);
  if (!result) throw new Error('Post delete failed');
  return result;
};
const countSold = async (id) => {
  const [countSelling, countHiddenAndSold] = await Promise.all([
    Post.countDocuments({ createdBy: id, status: 'SELLING' }),
    Post.countDocuments({ createdBy: id, status: 'HIDDEN', isSold: true }),
  ]);
  if (countSelling === undefined || countHiddenAndSold === undefined)
    throw new Error('Count sold failed');
  return {
    selling: countSelling || 0,
    sold: countHiddenAndSold || 0,
  };
};
const updateClickCount = async (id) => {
  const result = await Post.findByIdAndUpdate(
    id,
    { $inc: { clickCount: 1 } },
    { new: true }
  );
  if (!result) throw new Error('Update click count failed');
  return result;
};

module.exports = {
  create,
  updateStatus,
  countStatus,
  getAllPagination,
  getById,
  remove,
  getBySlug,
  update,
  countSold,
  updateClickCount,
};
