const exportFilter = (data) => {
  const res = {
    ...(data.page ? { page: Number(data.page) } : { page: 0 }),
    ...(data.size ? { size: Number(data.size) } : { size: 10 }),
    ...(data.sort ? { sort: data.sort } : { sort: '-createdAt' }),
    ...(data.role ? { role: Number(data.role) } : { role: { $ne: null } }),
    ...(data.name && { name: new RegExp(data.name, 'i') }),
    ...(data.isBanned && { isBanned: data.isBanned }),
    ...(data.email && { email: new RegExp(data.email, 'i') }),
  };
  return res;
};
module.exports = exportFilter;
