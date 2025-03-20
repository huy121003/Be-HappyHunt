const fs = require('fs');
const path = require('path');

const uploadImages = async (images) => {
  const imageUrls = [];
  const uploadDir = path.join(__dirname, '../uploads');

  // Kiểm tra thư mục, nếu chưa tồn tại thì tạo mới
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  for (const image of images) {
    try {
      const fileName = `${Date.now()}-${image.name}`;
      const filePath = path.join(uploadDir, fileName);

      // Chờ file được lưu hoàn tất
      await new Promise((resolve, reject) => {
        image.mv(filePath, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      imageUrls.push(`/uploads/${fileName}`);
    } catch (error) {
      console.error(`❌ Error uploading image: ${image.name}`, error);
      throw new Error('Error uploading image');
    }
  }

  return imageUrls;
};

module.exports = uploadImages;
