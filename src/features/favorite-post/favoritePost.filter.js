const exportFilter = (favorite) => {
  const res = {
    ...(favorite.page ? { page: Number(favorite.page) } : { page: 0 }),
    ...(favorite.size ? { size: Number(favorite.size) } : { size: 10 }),
    ...(favorite.sort ? { sort: favorite.sort } : { sort: '-createdAt' }),
    ...(favorite.post && { post: favorite.post }),
    ...(favorite.user && { createBy: favorite.user }),
    ...(favorite.createBy && { createBy: favorite.createBy }),
  };
  return res;
};
module.exports = exportFilter;
