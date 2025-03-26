const PaymentHistory = require('../../models/payment-history');
const exportFilter = require('./payment.filter');
const { checkType } = require('./payment.helper');

const createPaymentHistory = async (data) => {
  try {
    const result = await PaymentHistory.create(data);
    if (!result) {
      throw new Error('Payment history created successfully');
    }
    return result;
  } catch (error) {
    console.error('Error during create payment history:', error.message);
  }
};
const checkStatus = async (data) => {
  try {
    const result = await PaymentHistory.findOne({
      orderCode: data.orderCode,
      paymentLinkId: data.paymentLinkId,
      createdBy: createdBy,
    });
    if (!result) {
      throw new Error('notfound');
    }
    return result.status;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateStatus = async (data) => {
  try {
    const result = await PaymentHistory.findOneAndUpdate(
      {
        orderCode: data.orderCode,
        paymentLinkId: data.paymentLinkId,
        qrCode: data.qrCode,
      },
      {
        status: data.status,
      }
    );
    if (!result) {
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
        .populate('createdBy', '_id name avatar')
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
};
