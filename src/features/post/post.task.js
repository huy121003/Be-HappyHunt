const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const { Post } = require('../../models');
const axios = require('axios');
const evaluateImageContent = require('../../helpers/checkingImgaePoint');
require('dotenv').config();

// Chạy cron mỗi 1 phút (đổi từ */5 thành */1 theo code của bạn)
cron.schedule('*/1 * * * *', async () => {
  try {
    console.log('🔍 Checking posts with status WAITING...');

    // Lấy tất cả bài đăng có trạng thái 'WAITING'
    const posts = await Post.find({ status: 'WAITING' });

    if (!posts.length) {
      console.log('✅ No posts to check.');
      return;
    }

    for (const post of posts) {
      let aiCheckFailed = false;
      let allApproved = true;
      const updatedImages = [];

      console.log(`📌 Checking post ID: ${post._id}`);

      const checkResults = await Promise.allSettled(
        post.images.map(async (image) => {
          const reasonReject = []; // Mảng lý do từ chối cho từng ảnh
          try {
            // const imagePath = path.join(__dirname, '../../', image.url);

            // // Kiểm tra xem file ảnh có tồn tại không trước khi gửi API
            // if (!fs.existsSync(imagePath)) {
            //   throw new Error(`Image file ${image.url} not found`);
            // }

            // Gọi API SightEngine để phân tích ảnh
            const result = await checkImage(image.url);
            if (!result || result.status !== 'success') {
              throw new Error(`Invalid API response for ${image.url}`);
            }

            // Đánh giá kết quả phân tích
            const evaluation = evaluateImageContent(result, {});
            if (!evaluation || typeof evaluation.approved === 'undefined') {
              throw new Error(`Evaluation failed for ${image.url}`);
            }

            // Nếu ảnh không được duyệt, thêm lý do từ chối
            if (!evaluation.approved) {
              reasonReject.push(...evaluation.reasons);
              allApproved = false;
              console.log(
                `🚫 Image ${image.url} rejected: ${evaluation.reasons.join(', ')}`
              );
            }
          } catch (error) {
            // console.error(
            //   `❌ Error checking image ${image.url}:`,
            //   error.message
            // );
            reasonReject.push(error.message);
            aiCheckFailed = true;
            allApproved = false;
          }

          // Trả về thông tin ảnh đã kiểm tra
          return {
            url: image.url,
            index: image.index,
            reasonReject: reasonReject.length > 0 ? reasonReject : [],
          };
        })
      );

      // Xử lý kết quả từ Promise.allSettled và cập nhật mảng images
      checkResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          updatedImages.push(result.value);
        } else {
         // console.error(`❌ Image check failed unexpectedly:`, result.reason);
          // Thêm ảnh lỗi vào updatedImages với lý do từ chối
          updatedImages.push({
            url: result.reason.image?.url || 'unknown',
            index: result.reason.image?.index || 0,
            reasonReject: [result.reason.message || 'Unknown error'],
          });
          aiCheckFailed = true;
          allApproved = false;
        }
      });

      // Xác định trạng thái mới cho bài đăng
      let newStatus = allApproved ? 'SELLING' : 'REJECTED';
      if (aiCheckFailed) {
        newStatus = 'WAITING|AI_CHECKING_FAILED';
      }
      await Post.findByIdAndUpdate(
        post._id,
        { status: newStatus, images: updatedImages },
        { new: true }
      );

      console.log(`📢 Post ID: ${post._id} updated to ${newStatus}`);
    }
  } catch (error) {
    console.error('❌ Error checking posts:', error);
  }
});

/**
 * Gửi ảnh lên API SightEngine để kiểm tra nội dung
 * @param {string} imagePath - Đường dẫn tới file ảnh
 * @returns {Promise<Object>} - Kết quả phân tích từ API
 */
const checkImage = async (imagePath) => {
  const data = new FormData();
  data.append('media', fs.createReadStream(imagePath));
  data.append('workflow', 'wfl_i82TKxJD9c9oVBe9cQW2k');
  data.append('api_user', '1222006132');
  data.append('api_secret', 'RX7Rro7YXqvzRhPnvwNsVWfUEQyin8Xt');

  try {
    const response = await axios.get(
      'https://api.sightengine.com/1.0/check-workflow.json',
      {
        params: {
          url: imagePath,
          workflow: 'wfl_i82TKxJD9c9oVBe9cQW2k',
          api_user: '1222006132',
          api_secret: 'RX7Rro7YXqvzRhPnvwNsVWfUEQyin8Xt',
        },
      }
    );

    return response.data;
  } catch (error) {
    // if (error.response) {
    //   console.error('🚨 API Error:', error.response.data);
    // } else {
    //   console.error('❌ Network/Error:', error.message);
    // }
    throw error;
  }
};

module.exports = cron;
