const { Account } = require('../../models');
const PaymentHistory = require('../../models/payment-history');
const exportFilter = require('./payment.filter');
const { checkType } = require('./payment.helper');

const createPaymentHistory = async (data) => {
  try {
    const result = await PaymentHistory.create(data);
    if (!result) {
      throw new Error('Payment history created successfully');
    }
    return { _id: result._id };
  } catch (error) {
    console.error('Error during create payment history:', error.message);
  }
};
const checkStatus = async (id) => {
  try {
    const result = await PaymentHistory.findById(id)
      .select('status')
      .lean()
      .exec();
    if (!result) {
      throw new Error('notfound');
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateStatus = async (id, status) => {
  try {
    const result = await PaymentHistory.findByIdAndUpdate(id, status, {
      new: true,
    });
    if (!result) {
      throw new Error('update');
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updatePaymentHistory = async (data) => {
  try {
    const result = await PaymentHistory.findOneAndUpdate(
      {
        orderCode: data.orderCode,
        paymentLinkId: data.paymentLinkId,
      },
      {
        status: data.status,
      }
    );
    if (!result) {
      throw new Error('update');
    }
    const account = await Account.findByIdAndUpdate(
      result.createdBy,
      { $inc: { balance: data.amount } },
      {
        new: true,
      }
    );
    if (!account) {
      throw new Error('update');
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getById = async (id) => {
  try {
    const result = await PaymentHistory.findById(id)
      .select('-__v -deleted')
      .lean()
      .exec();
    if (!result) {
      throw new Error('notfound');
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllPagiantion = async (query) => {
  const { page, size, sort, ...filter } = exportFilter(query);

  try {
    const [totalDocuments, result] = await Promise.all([
      PaymentHistory.countDocuments(filter),
      PaymentHistory.find(filter)
        .select('-__v -deleted')
        .sort(sort)
        .limit(size)
        .skip(page * size)
        .populate('createdBy', 'name avatar')
        .lean()
        .exec(),
    ]);

    if (!result) {
      throw new Error('notfound');
    }
    return {
      documentList: result,
      pageSize: size,
      pageNumber: page,
      totalDocuments,
    };
  } catch (error) {
    console.error('Error during get all payment history:', error.message);
    throw new Error(error.message);
  }
};
const getDepositStatistics = async (type) => {
  try {
    const { startDate, groupByFormat } = checkType(type);
    const result = await PaymentHistory.aggregate([
      {
        $match: {
          status: 'PAID',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: groupByFormat, date: '$createdAt' },
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    if (!result) {
      throw new Error('notfound');
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getTopDepositors = async () => {
  try {
    const topUsers = await PaymentHistory.aggregate([
      { $match: { status: 'PAID' } }, // Chỉ lấy những giao dịch đã thanh toán
      {
        $group: {
          _id: '$accountNumber',
          totalAmount: { $sum: '$amount' },
          accountName: { $first: '$accountName' },
        },
      },
      { $sort: { totalAmount: -1 } }, // Sắp xếp theo số tiền giảm dần
      { $limit: 5 }, // Chỉ lấy top 5
    ]);
    if (!topUsers) {
      throw new Error('notfound');
    }
    return topUsers;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  createPaymentHistory,
  checkStatus,
  updateStatus,
  getById,
  getAllPagiantion,
  getDepositStatistics,
  getTopDepositors,
  updatePaymentHistory,
};
