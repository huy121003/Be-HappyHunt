const removeDiacritics = (str) => {
  return str
    .normalize('NFD') // Chuẩn hóa Unicode, tách dấu ra khỏi ký tự
    .replace(/[\u0300-\u036f]/g, '') // Xóa các ký tự dấu
    .replace(/đ/g, 'd') // Thay "đ" bằng "d"
    .replace(/Đ/g, 'D'); // Thay "Đ" bằng "D"
};
module.exports = removeDiacritics;