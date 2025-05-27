const exportFilter = (report) => {
  const res = {
    ...(report.page ? { page: Number(report.page) } : { page: 0 }),
    ...(report.size ? { size: Number(report.size) } : { size: 10 }),
    ...(report.sort ? { sort: report.sort } : { sort: '-createdAt' }),
    ...(report.status && { status: report.status }),
    ...(report.targetType && { targetType: report.targetType }),
  };
  return res;
};
module.exports = exportFilter;
