const uploadBase64ToCloudinary = (base64String) => {
  const buffer = Buffer.from(base64String.split(',')[1], 'base64'); // giải mã base64

  return buffer;
};

module.exports = uploadBase64ToCloudinary;
