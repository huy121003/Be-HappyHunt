require('dotenv').config();
const { uploadMultiple } = require('../file/file.service');
const postHelper = require('./post.helper');
const {
  Post,
  HistoryClickPost,
  FavoritePost,
  Account,
} = require('../../models');
const autoSlug = require('../../helpers/autoSlug');
const exportFilter = require('./post.filter');
const dayjs = require('dayjs');

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
const getAllPagination = async (data, userId) => {
  const { page, size, sort, ...filter } = exportFilter(data);
  const [totalDocuments, posts] = await Promise.all([
    Post.countDocuments(filter),
    Post.find(filter)
      .select('-__v -deleted')
      .populate(
        'category categoryParent address.province address.district address.ward createdBy',
        'name _id avatar phoneNumber'
      )
      .sort({
        ...sort,
        pushedAt: -1,
      })
      .limit(size)
      .skip(page * size)
      .lean()
      .exec(),
  ]);

  const result = await Promise.all(
    posts.map(async (post) => ({
      ...post,
      isFavorite: !!(await FavoritePost.findOne({
        post: post._id,
        createdBy: userId,
      })),
    }))
  );

  if (!result || !totalDocuments) throw new Error('Fetch post failed');

  return {
    documentList: result,
    totalDocuments,
    pageSize: size,
    pageNumber: page,
  };
};
const getAllSuggestionsPagination = async (data, userId) => {
  const [categorySuggestions, user, favoritePost] = await Promise.all([
    Post.find({ createdBy: userId })
      .select('category categoryParent')
      .skip(0)
      .limit(10)
      .sort({ createdAt: -1 })
      .lean(),
    Account.findById(userId).lean(),
    FavoritePost.find({ createdBy: userId })
      .select('post')
      .populate('post', 'category categoryParent')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  if (!user) throw new Error('User not found');

  const finalCategorySuggestions = [
    ...postHelper.sortCategory(
      favoritePost.map((item) => item.post),
      categorySuggestions
    ),
  ];

  const { page, size, sort, ...filter } = exportFilter({
    ...data,
    ...(user.address && {
      province: user.address.province,
      district: user.address.district,
      ward: user.address.ward,
    }),
  });

  const query = {
    ...filter,
    status: 'SELLING',
    createdBy: { $ne: userId },
    ...(finalCategorySuggestions.length > 0 && {
      $or: finalCategorySuggestions,
    }),
  };
  const [totalDocuments, result] = await Promise.all([
    Post.countDocuments(query),
    Post.find(query)
      .select('-__v -deleted')
      .populate(
        'category categoryParent address.province address.district address.ward createdBy',
        'name _id avatar phoneNumber slug'
      )
      .sort({
        ...sort,
        pushedAt: -1,
      })
      .skip(page * size)
      .limit(size)
      .lean(),
  ]);
  const res = await Promise.all(
    result.map(async (post) => ({
      ...post,
      isFavorite: !!(await FavoritePost.findOne({
        post: post._id,
        createdBy: userId,
      })),
    }))
  );

  return {
    documentList: res,
    totalDocuments,
    pageSize: size,
    pageNumber: page,
  };
};

const updateCheckingStatus = async (id, post) => {
  const result = await Post.findByIdAndUpdate(
    id,
    {
      ...post,
      ...(post.status &&
        post.status === 'SELLING' && {
          expiredAt: dayjs().add(2, 'months').toDate(),
        }),
    },
    { new: true }
  );
  if (!result) throw new Error('Update status post failed');

  return result;
};

const getById = async (id, userId) => {
  const result = await Post.findById(id)
    .select(' -updatedAt -__v')
    .populate(
      'category categoryParent address.province address.district address.ward createdBy',
      'name _id avatar phoneNumber slug'
    )
    .lean()
    .exec();

  if (!result) throw new Error('Post not found');
  const favorite = await FavoritePost.findOne({ post: id, createdBy: userId });

  return {
    ...result,
    isFavorite: !!favorite,
  };
};
const getBySlug = async (slug, userId) => {
  const result = await Post.findOne({ slug })
    .select(' -updatedAt -__v')
    .populate(
      'category categoryParent address.province address.district address.ward createdBy',
      'name _id avatar phoneNumber slug'
    )
    .lean()
    .exec();

  if (!result) throw new Error('Post not found');
  const favorite = await FavoritePost.findOne({
    post: result._id,
    createdBy: userId,
  });

  return {
    ...result,
    isFavorite: !!favorite,
  };
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
const updateClickCount = async (id, userId) => {
  const res = await HistoryClickPost.findOne({ post: id, createdBy: userId });
  if (res) {
    return res;
  }
  const [result, createClick] = await Promise.all([
    Post.findByIdAndUpdate(
      id,
      { $inc: { clickCount: 1 } }, // Increment the clickCount field
      { new: true } // Return the updated document
    ),
    HistoryClickPost.create({ post: id, createdBy: userId }),
  ]);
  if (!result || !createClick) throw new Error('Update click count failed');
  return result;
};
const updatePushedAt = async (id) => {
  const result = await Post.findByIdAndUpdate(
    id,
    { pushedAt: new Date() },
    { new: true }
  );
  if (!result) throw new Error('Update pushedAt failed');
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
  updateCheckingStatus,
  getAllSuggestionsPagination,
  updatePushedAt,
};
