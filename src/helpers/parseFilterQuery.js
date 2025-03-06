const parseFilterQuery = (filters) => {
  const query = {};

  Object.keys(filters).forEach((key) => {
    let value = filters[key];

    if (value === 'true') {
      value = true; // Chuyển "true" thành boolean true
    } else if (value === 'false') {
      value = false; // Chuyển "false" thành boolean false
    } else if (!isNaN(value) && value.trim() !== '') {
      value = Number(value); // Chuyển số dạng chuỗi thành số
    } else if (value.startsWith('[') && value.endsWith(']')) {
      try {
        value = JSON.parse(value); // Chuyển chuỗi JSON thành mảng (vd: "[1,2,3]")
      } catch (e) {
        // Nếu lỗi khi parse, giữ nguyên giá trị
      }
    } else if (value.startsWith('{') && value.endsWith('}')) {
      try {
        value = JSON.parse(value); // Chuyển chuỗi JSON thành object (vd: '{"a":1}')
      } catch (e) {
        // Nếu lỗi khi parse, giữ nguyên giá trị
      }
    }

    // Áp dụng bộ lọc regex nếu là chuỗi
    if (typeof value === 'string') {
      query[key] = { $regex: value, $options: 'i' };
    } else {
      query[key] = value;
    }
  });

  return query;
};

module.exports = parseFilterQuery;
