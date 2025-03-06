const exportFilter = (permission) => {
  const res = {
    ...(permission.page ? { page: Number(permission.page) } : { page: 0 }),
    ...(permission.size ? { size: Number(permission.size) } : { size: 10 }),
    ...(permission.sort ? { sort: permission.sort } : { sort: '-createdAt' }),
    ...(permission.name && { name: new RegExp(permission.name, 'i') }),
    ...(permission.code && { code: new RegExp(permission.code, 'i') }),
  };
  return res;
};
module.exports = exportFilter;
