const { Account } = require('../../models');
const PaymentHistory = require('../../models/payment-history');
const exportFilter = require('./payment.filter');
const { checkType } = require('./payment.helper');

const createPaymentHistory = async (data) => {
  try {
    const result = await PaymentHistory.create(data);
    if (!result) {
      throw new Error('create');
    }
    return { _id: result._id };
  } catch (error) {
    console.error('Error during create payment history:', error.message);
  }
};
const remove = async (id) => {
  try {
    const result = await PaymentHistory.deleteById(id);
    if (!result) {
      throw new Error('notfound');
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
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
const updateStatusByPaymentLinkId = async (paymentLinkId, data) => {
  try {
    const result = await PaymentHistory.findOneAndUpdate(
      { paymentLinkId },
      data,
      { new: true }
    );
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
        transactionDateTime: new Date(Date.now()),
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
const getDepositStatistics = async (data) => {
  try {
    const { startDate, groupByFormat, endDate } = checkType(data);
   
    const result = await PaymentHistory.aggregate([
      {
        $match: {
          status: 'SUCCESS',
          transactionDateTime: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupByFormat,
              date: {
                $dateAdd: {
                  startDate: '$transactionDateTime',
                  unit: 'hour',
                  amount: 7,
                },
              },
            },
          },
          totalAmount: { $sum: '$amount' },
          totalInvoices: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $group: {
          _id: null, // Gom tất cả thành 1 nhóm duy nhất
          data: { $push: '$$ROOT' }, // Giữ nguyên dữ liệu đã nhóm trước đó
          grandTotalAmount: { $sum: '$totalAmount' }, // Tổng toàn bộ tiền
          grandTotalInvoices: { $sum: '$totalInvoices' }, // Tổng toàn bộ hóa đơn
        },
      },
      {
        $project: {
          _id: 0, // Bỏ _id vì không cần thiết
          data: 1,
          grandTotalAmount: 1,
          grandTotalInvoices: 1,
        },
      },
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
    const topUsers = await PaymentHistory.find({ status: 'PAID' })
      .select('createdBy amount')
      .populate('createdBy', '_id name avatar')
      .lean();

    const result = Object.values(
      topUsers.reduce((acc, item) => {
        const key = item?.createdBy?._id.toString();
        if (!acc[key]) {
          acc[key] = {
            createdBy: item?.createdBy?._id,
            userName: item.createdBy?.name,
            userAvatar: item.createdBy?.avatar,
            totalAmount: 0,
            totalFaid: 0,
          };
        }
        acc[key].totalAmount += item.amount;
        acc[key].totalFaid += 1;
        return acc;
      }, {})
    );
    result.sort((a, b) => b.totalAmount - a.totalAmount);

    return result.slice(0, 5);
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
  updateStatusByPaymentLinkId,
  remove,
};
