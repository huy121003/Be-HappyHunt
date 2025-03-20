const { cloudinary } = require('../../configs');

const uploadSingle = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto', // Tự động nhận diện loại tài nguyên (image, video, etc.)
        public_id: `happyhunt-${Date.now()}`, // Tên công khai (optional)
      },
      (error, result) => {
        if (error) {
          reject(`Có lỗi xảy ra khi upload file: ${error.message}`);
        } else {
          resolve(result.url);
        }
      }
    );

    // Chuyển đổi Buffer thành stream để upload
    stream.end(file.data);
  });
};
const uploadMultiple = async (files) => {
  // làm tuong tự như uploadSingleService
  if (Array.isArray(files) === false) {
    const url = await uploadSingle(files);
    return [url];
  }
  const uploadPromises = files.map((file) => uploadSingle(file));
  return Promise.all(uploadPromises);
};

module.exports = {
  uploadSingle,
  uploadMultiple,
};
