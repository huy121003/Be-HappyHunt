const phoneRegex = (phone) => {
  const phonePattern = /^(\+84|0)\d{10,11}$/;
  return phonePattern.test(phone);
};

module.exports = phoneRegex;
