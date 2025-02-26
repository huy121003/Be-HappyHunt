const parseFilterQuery = (filters) => {
  const query = {};

  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      if (typeof filters[key] === 'string') {
        query[key] = { $regex: filters[key], $options: 'i' };
      } else {
        query[key] = filters[key];
      }
    }
  });

  return query;
};

module.exports = parseFilterQuery;
