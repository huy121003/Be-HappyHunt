const exportFilter = (category) => {
  const res = {
    ...(category.page ? { page: Number(category.page) } : { page: 0 }),
    ...(category.size ? { size: Number(category.size) } : { size: 10 }),
    ...(category.sort ? { sort: category.sort } : { sort: '-createdAt' }),
    ...(category.name && { name: new RegExp(category.name, 'i') }),
    ...(category.parent && { parent: category.parent }),
  };
  return res;
};

module.exports = exportFilter;
