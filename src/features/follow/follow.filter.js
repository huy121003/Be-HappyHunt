const exportFilter = (follow) => {
  const res = {
    ...(follow.page ? { page: Number(follow.page) } : { page: 0 }),
    ...(follow.size ? { size: Number(follow.size) } : { size: 10 }),
    ...(follow.sort ? { sort: follow.sort } : { sort: '-createdAt' }),
  };
  return res;
};

module.exports = exportFilter;
