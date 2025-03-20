const autoSlug = (str) => {
  return str
    .trim() // Loại bỏ khoảng trắng ở đầu và cuối
    .toLowerCase() // Chuyển thành chữ thường
    .replace(/\s+/g, '_'); // Thay thế tất cả khoảng trắng bằng "_"
  //.replace(/[^\w_]/g, ''); // Loại bỏ ký tự đặc biệt (chỉ giữ chữ cái, số và "_")
};
module.exports = autoSlug;
