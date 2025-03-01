const parseFilterQuery = (filters) => {
  const query = {};

  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      const value = filters[key];

      // Kiểm tra nếu value là chuỗi nhưng có thể chuyển thành số
      if (!isNaN(value) && typeof value === 'string') {
        query[key] = Number(value); // Chuyển sang kiểu số
      } else if (typeof value === 'string') {
        query[key] = { $regex: value, $options: 'i' }; // Giữ nguyên regex
      } else {
        query[key] = value;
      }
    }
  });

  return query;
};

module.exports = parseFilterQuery;
