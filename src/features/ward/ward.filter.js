const exportFilter = (ward) => {
  const res = {
    ...(ward.page ? { page: Number(ward.page) } : { page: 0 }),
    ...(ward.size ? { size: Number(ward.size) } : { size: 10 }),
    ...(ward.sort ? { sort: ward.sort } : { sort: '-createdAt' }),
    ...(ward.name && { name: new RegExp(ward.name, 'i') }),
    ...(ward.district && { district: ward.district }),
    ...(ward.province && { province: ward.province }),
  };
  return res;
};

module.exports = exportFilter;
