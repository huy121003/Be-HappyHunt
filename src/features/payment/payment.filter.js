const exportFilter = (payment) => {
  const res = {
    ...(payment.page ? { page: Number(payment.page) } : { page: 0 }),
    ...(payment.size ? { size: Number(payment.size) } : { size: 10 }),
    ...(payment.sort ? { sort: payment.sort } : { sort: '-createdAt' }),
    ...(payment.name && { name: new RegExp(payment.name, 'i') }),
    ...(payment.status && { status: new RegExp(payment.status, 'i') }),
    ...(payment.createdBy && { createdBy: Number(payment.createdBy) }),
    ...(payment.amount && { amount: Number(payment.amount) }),
  };
  return res;
};
module.exports = exportFilter;
