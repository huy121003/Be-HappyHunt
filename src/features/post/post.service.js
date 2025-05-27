require('dotenv').config();
const { uploadMultiple } = require('../file/file.service');
const postHelper = require('./post.helper');
const {
  Post,
  HistoryClickPost,
  FavoritePost,
  Account,
  Category,
} = require('../../models');
const daysjs = require('dayjs');
const autoSlug = require('../../helpers/autoSlug');
const exportFilter = require('./post.filter');
const dayjs = require('dayjs');
const { checkType } = require('../../helpers/checkType.helper');
const {
  create: createNotification,
} = require('../notification/notification.soket');
const { socketStore } = require('../app/app.socket');
const create = async (data) => {
  const { payment, ...restData } = data;

  try {
    let imageUrls = [];

    if (restData.images) {
      imageUrls = (await uploadMultiple(restData.images)) || [];
    }

    const result = await Post.create({
      ...restData,
      images: imageUrls.map((url, index) => {
        return {
          url,
          index: index + 1,
        };
      }),
      status: 'WAITING',
      address: JSON.parse(restData.address),
      attributes: JSON.parse(restData.attributes),
      slug: autoSlug(restData.name),
    });

    if (!result) throw new Error('create');

    if (payment) {
      let updateBalance = await Account.findByIdAndUpdate(
        restData.createdBy,
        {
          $inc: {
            balance: -Number(payment),
          },
        },
        { new: true }
      );
      if (!updateBalance) throw new Error('update');
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const update = async (id, data) => {
  try {
    let { images, saveImages = [], address, attributes, ...restData } = data;
    let imageUrls = JSON.parse(saveImages).map((item) => item.url);

    if (images) {
      const newImages = (await uploadMultiple(images)) || [];
      imageUrls = imageUrls.concat(newImages);
    }

    const updateQuery = {
      ...restData,
      images: imageUrls.map((url, index) => {
        return {
          url,
          index: index,
        };
      }),
      status: 'WAITING',
      ...(address && { address: JSON.parse(address) }),
      ...(attributes && { attributes: JSON.parse(attributes) }),
      slug: autoSlug(data.name),
    };

    const result = await Post.findByIdAndUpdate(id, updateQuery, {
      new: true,
      runValidators: true,
    });
    if (!result) throw new Error('update');

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateStatus = async (id, data) => {
  try {
    const result = await Post.findByIdAndUpdate(id, data, { new: true });

    if (!result) throw new Error('update');

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const countStatus = async (id) => {
  try {
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
    if (!result) throw new Error('notfound');

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
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAllPagination = async (data, userId) => {
  try {
    const { page, size, sort, search, ...filter } = exportFilter(data);

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
          createdAt: -1,
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

    if (!posts) throw new Error('notfound');

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
const getAllPaginationManager = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);
    const [totalDocuments, posts] = await Promise.all([
      Post.countDocuments(filter),
      Post.find(filter)

        .select('-__v -deleted')
        .populate(
          'category categoryParent address.province address.district address.ward createdBy',
          'name _id avatar phoneNumber slug messages pricePush'
        )
        .sort({
          ...sort,
        })
        .limit(size)
        .skip(page * size)
        .lean()
        .exec(),
    ]);
    if (!posts) throw new Error('notfound');
    return {
      documentList: posts,
      totalDocuments,
      pageSize: size,
      pageNumber: page,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllSuggestionsPagination = async (data, userId) => {
  try {
    const [historyClick, favoritePost, user] = await Promise.all([
      HistoryClickPost.find({ createdBy: userId })
        .select('post')
        .populate('post', 'category categoryParent')
        .sort({
          pushAt: -1,
          createdAt: -1,
        })
        .limit(10)
        .lean(),
      FavoritePost.find({ createdBy: userId })
        .select('post')
        .populate('post', 'category categoryParent')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Account.findById(userId).lean(),
    ]);
    if (!user) throw new Error('notfound');

    const preferredCategories = postHelper.sortCategory(
      favoritePost.map((x) => x.post),
      historyClick.map((x) => x.post)
    );

    const { page, size, sort, ...filter } = exportFilter({
      ...data,
      ...(user.address && {
        province: user.address.province,
        district: user.address.district,
        ward: user.address.ward,
      }),
    });

    const commonQuery = {
      ...filter,
      status: 'SELLING',
      createdBy: { $ne: userId },
    };

    const queryWithCategory =
      preferredCategories.length > 0
        ? { ...commonQuery, $or: preferredCategories }
        : commonQuery;

    // Lấy bài viết theo danh mục gợi ý
    let posts = await Post.find(queryWithCategory)
      .select('-__v -deleted')
      .populate([
        { path: 'category' },
        { path: 'categoryParent' },
        { path: 'address.province', select: 'name' },
        { path: 'address.district', select: 'name' },
        { path: 'address.ward', select: 'name' },
        { path: 'createdBy', select: 'name _id avatar phoneNumber slug' },
      ])
      .sort({ ...sort, pushedAt: -1 })
      .limit(50)
      .lean();

    const existingIds = new Set(posts.map((p) => p._id.toString()));

    // Nếu số lượng < 30 → lấy thêm bài mới nhất không trùng
    if (posts.length < 30) {
      const more = await Post.find({
        ...commonQuery,
        _id: { $nin: Array.from(existingIds) },
      })
        .select('-__v -deleted')
        .populate([
          { path: 'category' },
          { path: 'categoryParent' },
          { path: 'address.province', select: 'name' },
          { path: 'address.district', select: 'name' },
          { path: 'address.ward', select: 'name' },
          { path: 'createdBy', select: 'name _id avatar phoneNumber slug' },
        ])
        .sort({ ...sort, pushedAt: -1 })
        .limit(50)
        .lean();

      posts = [...posts, ...more];
    }

    const total = posts.length;
    const paged = posts.slice(page * size, (page + 1) * size);

    const result = await Promise.all(
      paged.map(async (post) => ({
        ...post,
        isFavorite: !!(await FavoritePost.findOne({
          post: post._id,
          createdBy: userId,
        })),
      }))
    );

    return {
      documentList: result,
      totalDocuments: total,
      pageSize: size,
      pageNumber: page,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateCheckingStatus = async (id, post) => {
  try {
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
    if (!result) throw new Error('update');
    await createNotification(socketStore.appNamespace, socketStore.socketOn, {
      target: post.createdBy,
      post: result._id,
      type: post.status === 'SELLING' ? 'NEW_POST' : 'POST_REJECTED',
      createdBy: post.createdBy,
    });

    return result;
  } catch (error) {
    console.error('Error updating checking status:', error);
    throw new Error(error.message);
  }
};

const getById = async (id, userId) => {
  try {
    const result = await Post.findById(id)
      .select(' -updatedAt -__v')
      .populate(
        'category categoryParent address.province address.district address.ward createdBy',
        'name _id avatar phoneNumber slug'
      )
      .lean()
      .exec();

    if (!result) throw new Error('notfound');
    const favorite = await FavoritePost.findOne({
      post: id,
      createdBy: userId,
    });

    return {
      ...result,
      isFavorite: !!favorite,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const getBySlug = async (slug, userId) => {
  try {
    const result = await Post.findOne({ slug })
      .select(' -updatedAt -__v')
      .populate(
        'category categoryParent address.province address.district address.ward createdBy',
        'name _id avatar phoneNumber slug messages'
      )
      .lean()
      .exec();

    if (!result) throw new Error('notfound');
    const favorite = await FavoritePost.findOne({
      post: result._id,
      createdBy: userId,
    });

    return {
      ...result,
      isFavorite: !!favorite,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const remove = async (id) => {
  try {
    const result = await Post.deleteById(id);
    if (!result) throw new Error('delete');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const countSold = async (id) => {
  try {
    const [countSelling, countHiddenAndSold] = await Promise.all([
      Post.countDocuments({ createdBy: id, status: 'SELLING' }),
      Post.countDocuments({ createdBy: id, status: 'HIDDEN', isSold: true }),
    ]);

    return {
      selling: countSelling || 0,
      sold: countHiddenAndSold || 0,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateClickCount = async (id, userId) => {
  try {
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
    if (!result || !createClick) throw new Error('update');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updatePushedAt = async (id, accountId, price) => {
  const result = await Post.findByIdAndUpdate(
    id,
    {
      pushedAt: new Date(
        daysjs().add(12, 'hour').format('YYYY-MM-DD')
      ).toISOString(),
    },
    { new: true }
  );
  const account = await Account.findByIdAndUpdate(
    accountId,
    {
      $inc: {
        balance: -Number(price),
      },
    },
    { new: true }
  );
  if (!account) throw new Error('update account');
  if (!result) throw new Error('update');

  return result;
};
const getPushedAt = async (id) => {
  const result = await Post.findById(id).select('pushedAt').lean();
  if (!result) throw new Error('notfound');
  return result;
};
const clearPushedAt = async (id) => {
  const result = await Post.findByIdAndUpdate(
    id,
    { pushedAt: new Date().toISOString() },
    { new: true }
  );
  if (!result) throw new Error('update');
  return result;
};

const countStatusProfile = async (id) => {
  try {
    const [selling, sold] = await Promise.all([
      Post.countDocuments({ createdBy: id, status: 'SELLING' }),
      Post.countDocuments({ createdBy: id, isSold: true }),
    ]);
    return {
      selling: selling || 0,
      sold: sold || 0,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const getNewPostStatistics = async (data) => {
  try {
    const { startDate, endDate, groupByFormat } = checkType(data);
    const result = await Post.aggregate([
      {
        $match: {
          role: null,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupByFormat,
              date: {
                $dateAdd: {
                  startDate: '$createdAt',
                  unit: 'hour',
                  amount: 7,
                },
              },
            },
          },
          totalPosts: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const totalPostSelling = async () => {
  try {
    const result = await Post.countDocuments({ status: 'SELLING' });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const totalPostSellingByCategory = async () => {
  const result = {};
  try {
    const categoryParent = await Category.find({
      parent: null,
    });
    for (const category of categoryParent) {
      const totalPost = await Post.countDocuments({
        categoryParent: category._id,
        status: 'SELLING',
      });
      result[category.name] = totalPost;
    }

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
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
  countStatusProfile,
  getNewPostStatistics,
  totalPostSelling,
  totalPostSellingByCategory,
  clearPushedAt,
  getPushedAt,
  getAllPaginationManager,
};
