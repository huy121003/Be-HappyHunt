const checkType = (type) => {
  let startDate, groupByFormat;

  switch (type) {
    case 'this_week': // Tuần này
      startDate = dayjs().startOf('week').toDate();
      groupByFormat = '%Y-%m-%d';
      break;
    case 'last_week': // Tuần trước
      startDate = dayjs().subtract(1, 'week').startOf('week').toDate();
      groupByFormat = '%Y-%m-%d';
      break;
    case 'this_month': // Tháng này
      startDate = dayjs().startOf('month').toDate();
      groupByFormat = '%Y-%m-%d';
      break;
    case 'last_month': // Tháng trước
      startDate = dayjs().subtract(1, 'month').startOf('month').toDate();
      groupByFormat = '%Y-%m-%d';
      break;
    case 'this_year': // Năm nay
      startDate = dayjs().startOf('year').toDate();
      groupByFormat = '%Y-%m';
      break;
    case 'last_year': // Năm trước
      startDate = dayjs().subtract(1, 'year').startOf('year').toDate();
      groupByFormat = '%Y-%m';
      break;
    case 'last_7_days': // 7 ngày gần đây
      startDate = dayjs().subtract(7, 'day').toDate();
      groupByFormat = '%Y-%m-%d';
      break;
    case 'last_30_days': // 30 ngày gần đây
      startDate = dayjs().subtract(30, 'day').toDate();
      groupByFormat = '%Y-%m-%d';
      break;
    case 'last_6_months': // 6 tháng gần đây
      startDate = dayjs().subtract(6, 'month').startOf('month').toDate();
      groupByFormat = '%Y-%m';
      break;
    default:
      throw new Error('notfound: Invalid type');
  }
  return { startDate, groupByFormat };
};
module.exports = {
  checkType,
};
