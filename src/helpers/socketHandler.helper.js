const success = (data) => {
  return {
    success: true,
    data: data,
  };
};

const error = (message) => {
  return {
    success: false,
    message: message,
  };
};

module.exports = {
  success,
  error,
};
