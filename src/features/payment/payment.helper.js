const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(isoWeek); // Đảm bảo tuần ISO bắt đầu từ Thứ Hai
dayjs.extend(utc);
dayjs.extend(timezone);

const checkType = (data) => {
  const { type, start, end } = data;
  let startDate, endDate, groupByFormat;

  switch (type) {
    case 'ALL':
      startDate = dayjs('2020-01-01').startOf('day').toDate(); // 00:00:00
      endDate = dayjs().endOf('day').toDate(); // 23:59:59 hôm nay
      groupByFormat = '%Y-%m';
      break;
    case 'TODAY':
      startDate = dayjs().startOf('day').toDate(); // 00:00:00 hôm nay
      endDate = dayjs().endOf('day').toDate(); // 23:59:59 hôm nay
      groupByFormat = '%Y-%m-%d';
      break;
    case 'YESTERDAY':
      startDate = dayjs().subtract(1, 'day').startOf('day').toDate(); // 00:00:00 hôm qua
      endDate = dayjs().subtract(1, 'day').endOf('day').toDate(); // 23:59:59 hôm qua
      groupByFormat = '%Y-%m-%d';
      break;
    case 'THIS_WEEK':
      startDate = dayjs().day(1).startOf('day').toDate(); // Thứ Hai (00:00:00)
      endDate = dayjs().day(7).endOf('day').toDate(); // Chủ Nhật (23:59:59)
      groupByFormat = '%Y-%m-%d';
      break;

    case 'LAST_WEEK':
      startDate = dayjs().subtract(1, 'week').day(1).startOf('day').toDate(); // Thứ Hai tuần trước (00:00:00)
      endDate = dayjs().subtract(1, 'week').day(7).endOf('day').toDate(); // Chủ Nhật tuần trước (23:59:59)
      groupByFormat = '%Y-%m-%d';
      break;

    case 'THIS_MONTH':
      startDate = dayjs()
        .startOf('month')

        .startOf('day')
        .toDate();
      endDate = dayjs().endOf('month').endOf('day').toDate();
      groupByFormat = '%Y-%m-%d';
      break;

    case 'LAST_MONTH':
      startDate = dayjs()
        .subtract(1, 'month')

        .startOf('month')

        .startOf('day')
        .toDate();
      endDate = dayjs()
        .subtract(1, 'month')
        .endOf('month')
        .endOf('day')
        .toDate();
      groupByFormat = '%Y-%m-%d';
      break;

    case 'THIS_YEAR':
      startDate = dayjs().startOf('year').startOf('day').toDate();
      endDate = dayjs().endOf('year').endOf('day').toDate();
      groupByFormat = '%Y-%m';
      break;

    case 'LAST_YEAR':
      startDate = dayjs()
        .subtract(1, 'year')
        .startOf('year')
        .startOf('day')

        .toDate();
      endDate = dayjs().subtract(1, 'year').endOf('year').endOf('day').toDate();
      groupByFormat = '%Y-%m';
      break;
    case '24H':
      startDate = dayjs().subtract(24, 'hour').toDate();
      endDate = dayjs().toDate();
      groupByFormat = '%Y-%m-%d ';
      break;
    case '7D':
      startDate = dayjs()
        .subtract(7, 'day')

        .startOf('day')
        .toDate();
      endDate = dayjs().endOf('day').toDate();
      groupByFormat = '%Y-%m-%d';
      break;

    case '30D':
      startDate = dayjs()
        .month(dayjs().month() - 1)
        .date(dayjs().date())

        .startOf('day')
        .toDate();
      endDate = dayjs().endOf('day').toDate();
      groupByFormat = '%Y-%m-%d';
      break;

    case '1Y':
      startDate = dayjs()
        .subtract(1, 'year')
        .date(dayjs().date())

        .startOf('day')
        .toDate();
      endDate = dayjs().endOf('day').toDate();
      groupByFormat = '%Y-%m';
      break;
    case 'CUSTOM':
      startDate = dayjs(start).startOf('day').toDate(); // 00:00:00 hôm qua
      endDate = dayjs(end).endOf('day').toDate(); // 23:59:59 hôm qua
      groupByFormat = '%Y-%m-%d';
      break;
    default:
      throw new Error('notfound: Invalid type');
  }

  return { startDate, groupByFormat, endDate };
};

module.exports = {
  checkType,
};
