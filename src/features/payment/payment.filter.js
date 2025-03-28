const dayjs = require('dayjs');

const exportFilter = (payment) => {
  console.log('payment', payment);
  const res = {
    ...(payment.page ? { page: Number(payment.page) } : { page: 0 }),
    ...(payment.size ? { size: Number(payment.size) } : { size: 10 }),
    ...(payment.sort ? { sort: payment.sort } : { sort: '-createdAt' }),
    ...(payment.status && { status: payment.status }),
    ...(payment.createdBy && { createdBy: Number(payment.createdBy) }),
    ...(payment.amount && { amount: Number(payment.amount) }),
    ...(payment.orderCode && { orderCode: payment.orderCode }),
    ...(payment.startDate &&
      payment.endDate && {
        transactionDateTime: {
          $gte: dayjs(payment.startDate).startOf('day').toDate(),
          $lte: dayjs(payment.endDate).endOf('day').toDate(),
        },
      }),
  };
  return res;
};
module.exports = exportFilter;
