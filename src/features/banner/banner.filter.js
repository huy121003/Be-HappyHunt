const exportFilter = (data) => {
  const res = {
    ...(data.page ? { page: Number(data.page) } : { page: 0 }),
    ...(data.size ? { size: Number(data.size) } : { size: 10 }),
    ...(data.sort ? { sort: data.sort } : { sort: '-createdAt' }),
    ...(data.name && { name: new RegExp(data.name, 'i') }),
  };
  return res;
};
module.exports = exportFilter;
