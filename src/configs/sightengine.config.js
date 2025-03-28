const axios = require('axios');
/**
 * Gửi ảnh lên API SightEngine để kiểm tra nội dung
 * @param {string} imagePath - Đường dẫn tới file ảnh
 * @returns {Promise<Object>} - Kết quả phân tích từ API
 */
require('dotenv').config();



const sightEngineConnect= async (imagePath) => {
  try {
    const response = await axios.get(process.env.SIGHTENGINE_API_URL, {
      params: {
        url: imagePath,
        workflow: process.env.SIGHTENGINE_API_WORKFLOW,
        api_user: process.env.SIGHTENGINE_API_USER,
        api_secret: process.env.SIGHTENGINE_API_SECRET,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(' API Error:', error.response.data);
    } else {
      console.error(' Network/Error:', error.message);
    }
    throw error;
  }
}
module.exports = sightEngineConnect;