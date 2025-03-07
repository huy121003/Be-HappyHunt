const exportFilter = (district) => {
  const res = {
    ...(district.page ? { page: Number(district.page) } : { page: 0 }),
    ...(district.size ? { size: Number(district.size) } : { size: 10 }),
    ...(district.sort ? { sort: district.sort } : { sort: '-createdAt' }),
    ...(district.name && { name: new RegExp(district.name, 'i') }),
    ...(district.provinceId && { provinceId: Number(district.provinceId) }),
  };
  return res;
};
module.exports = exportFilter;
