const exportFilter = (filter) => {
  const res = {
    ...(filter.page ? { page: Number(filter.page) } : { page: 0 }),
    ...(filter.size ? { size: Number(filter.size) } : { size: 10 }),
    ...(filter.sort ? { sort: filter.sort } : { sort: '-createdAt' }),
    ...(filter.name && { name: new RegExp(filter.name, 'i') }),
  };
  return res;
};

module.exports = exportFilter;
