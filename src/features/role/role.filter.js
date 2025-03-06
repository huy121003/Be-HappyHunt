const exportFilter = (role) => {
  const res = {
    ...(role.page ? { page: Number(role.page) } : { page: 0 }),
    ...(role.size ? { size: Number(role.size) } : { size: 10 }),
    ...(role.sort ? { sort: role.sort } : { sort: '-createdAt' }),
    ...(role.name && { name: new RegExp(role.name, 'i') }),
  };
  return res;
};
module.exports = exportFilter;
