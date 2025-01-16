// 8-10 ki tu co it nhat 1 chu hoa, 1 chu thuong, 1 so
const passwordRegex = (password) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/;
  return regex.test(password);
};
module.exports = passwordRegex;
