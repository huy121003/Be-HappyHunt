const exportFilter = (filter) => {
  const res = {
    ...(filter.page ? { page: Number(filter.page) } : { page: 0 }),
    ...(filter.size ? { size: Number(filter.size) } : { size: 10 }),
    ...(filter.sort ? { sort: filter.sort } : { sort: '-createdAt' }),
    ...(filter.name && { name: new RegExp(filter.name, 'i') }),
    ...(filter.isBanned && { isBanned: filter.isBanned }),
    ...(filter.phoneNumber && {
      phoneNumber: new RegExp(filter.phoneNumber, 'i'),
    }),
    ...(filter.isVip && { isVip: filter.isVip }),
    role: null,
  };
  console.log('res', res);
  return res;
};
module.exports = exportFilter;
