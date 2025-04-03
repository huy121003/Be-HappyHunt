const exportFilter = (follow) => {
  const res = {
    ...(follow.page ? { page: Number(follow.page) } : { page: 0 }),
    ...(follow.size ? { size: Number(follow.size) } : { size: 10 }),
    ...(follow.sort ? { sort: follow.sort } : { sort: '-createdAt' }),
    ...(follow.type === 'following' && { createdBy: follow.createdBy }),
    ...(follow.type === 'followers' && { following: follow.createdBy }),
  };
  return res;
};

module.exports = exportFilter;
