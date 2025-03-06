const parseSortQuery = (sort) => {
  let sortObject = {};

  if (!sort) {
    sortObject[process.env.SORT_DEFAULT] =
      process.env.ORDER_DEFAULT === 'desc' ? -1 : 1;
  } else {
    let sortArr = Array.isArray(sort) ? sort : [sort];
    sortArr.forEach((item) => {
      const order = item.startsWith('-') ? -1 : 1;
      const field = item.replace(/^[-+]/, '');
      sortObject[field] = order;
    });
  }

  return sortObject;
};
module.exports = parseSortQuery;
