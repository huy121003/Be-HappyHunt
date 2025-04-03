const exportFilter = (search) => {
  const res = {
    ...(search.page ? { page: Number(search.page) } : { page: 0 }),
    ...(search.size ? { size: Number(search.size) } : { size: 10 }),
    ...(search.sort
      ? { sort: search.sort }
      : { sort: '-updatedAt -createdAt' }),
    ...(search.keyword && { keyword: search.keyword }),
  };
  return res;
};
module.exports = exportFilter;
