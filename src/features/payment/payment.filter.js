const exportFilter = (payment) => {
  const res = {
    ...(payment.page ? { page: Number(payment.page) } : { page: 0 }),
    ...(payment.size ? { size: Number(payment.size) } : { size: 10 }),
    ...(payment.sort ? { sort: payment.sort } : { sort: '-createdAt' }),
    ...(payment.status && { status: payment.status }),
    ...(payment.createdBy && { createdBy: Number(payment.createdBy) }),
    ...(payment.amount && { amount: Number(payment.amount) }),
  };
  return res;
};
module.exports = exportFilter;
