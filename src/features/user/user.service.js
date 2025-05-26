require('dotenv').config();

const { checkType } = require('../../helpers/checkType.helper');
const { Account } = require('../../models');
const exportFilter = require('./user.filter');
const emailService = require('../email/email.service');
const Post = require('../../models/post');

const getAll = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);
    const [totalDocuments, result] = await Promise.all([
      Account.countDocuments(filter),
      Account.find(filter)
        .select('-password -__v -updatedAt -deleted')
        .populate({
          path: 'address.province address.district address.ward',
          select: 'name _id',
        })
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
  } catch (error) {
    throw new Error(error.message);
  }
};
const getById = async (id) => {
  try {
    const result = await Account.findById(id)
      .select('-password -__v  -updatedAt -deleted')
      .populate({ path: 'address.province', select: 'name _id' })
      .populate({ path: 'address.district', select: 'name _id' })
      .populate({ path: 'address.ward', select: 'name _id' })
      .lean()
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getBySlug = async (slug) => {
  try {
    const result = await Account.findOne({ slug })
      .select('-password -__v  -updatedAt -deleted')
      .populate({ path: 'address.province', select: 'name _id' })
      .populate({ path: 'address.district', select: 'name _id' })
      .populate({ path: 'address.ward', select: 'name _id' })
      .lean()
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const remove = async (id) => {
  try {
    const result = await Account.deleteById(id).exec();
    if (!result) throw new Error('delete');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const banned = async (id, data) => {
  try {
    const accountBanned = await Account.findById(id).exec();
    if (!accountBanned.isBanned && !data.isBanned) {
      return;
    }

    const result = await Account.findByIdAndUpdate(id, {
      ...data,
      ...(!data.isBanned && { banAmount: accountBanned.banAmount + 1 }),
    }).exec();

    if (!data.isBanned) {
      await emailService.sendBanAccountEmail(result.email);
      await Post.updateMany(
        { createdBy: id, status: 'SELLING' },
        { status: 'DELETED' }
      ).exec();
    }

    if (!result) throw new Error('update');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateReportCount = async (id) => {
  try {
    const result = await Account.findByIdAndUpdate(id, {
      $inc: { reportAmount: 1 },
    }).exec();
    if (!result) throw new Error('update');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getNewAccountStatistics = async (data) => {
  try {
    const { startDate, endDate, groupByFormat } = checkType(data);
    const result = await Account.aggregate([
      {
        $match: {
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
          totalAccounts: { $sum: 1 },
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

const getNewUser = async () => {
  try {
    const result = await Account.find()
      .select('-password -__v  -updatedAt -deleted')
      .populate({ path: 'address.province', select: 'name _id' })
      .populate({ path: 'address.district', select: 'name _id' })
      .populate({ path: 'address.ward', select: 'name _id' })
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getNewUserStatistics = async (data) => {
  try {
    const { startDate, endDate, groupByFormat } = checkType(data);
    const result = await Account.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: groupByFormat, date: '$createdAt' } },
          totalUsers: { $sum: 1 },
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
const totalUser = async () => {
  try {
    const [totalUser, totalBanned] = await Promise.all([
      Account.countDocuments({
        role: null,
      }),
      Account.countDocuments({ isBanned: false, role: null }),
    ]);

    return {
      totalUser: totalUser || 0,
      totalBanned: totalBanned || 0,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateStatus = async (id, status) => {
  try {
    const result = await Account.findByIdAndUpdate(id, {
      onOff: {
        status: status,
        timeOff: status === 'online' ? null : new Date(),
      },
    }).exec();
    if (!result) throw new Error('update');
    return {
      accountId: id,
      status: result.onOff.status,
      timestamp: result.onOff.timeOff,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const getStatus = async (id) => {
  try {
    const result = await Account.findById(id).exec();
    if (!result) throw new Error('notfound');
    return {
      accountId: id,
      status: result.onOff.status,
      timestamp: result.onOff.timeOff,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const countGenderUser = async () => {
  try {
    const [totalUser, totalMale, totalFemale, totalOther, totalNotUpdate] =
      await Promise.all([
        Account.countDocuments({ role: null }),
        Account.countDocuments({ role: null, gender: 'MALE' }),
        Account.countDocuments({ role: null, gender: 'FEMALE' }),
        Account.countDocuments({ role: null, gender: 'OTHER' }),
        Account.countDocuments({ role: null, gender: null }),
      ]);
    return {
      totalUser: totalUser || 0,
      totalMale: totalMale || 0,
      totalFemale: totalFemale || 0,
      totalOther: totalOther || 0,
      totalNotUpdate: totalNotUpdate || 0,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  getAll,
  remove,
  getById,
  banned,
  getBySlug,
  getNewAccountStatistics,

  getNewUser,
  getNewUserStatistics,
  totalUser,
  updateStatus,
  getStatus,
  countGenderUser,
  updateReportCount,
};
