// // Định nghĩa hàm classifyImageFromUrl
// const classifyImageFromUrl = async (imageUrl) => {
//   try {
//     // Tải mô hình CLIP
//     const { pipeline } = await import('@xenova/transformers');
//     const model = await pipeline('image-classification');
//     // Phân loại hình ảnh
//     const result = await model(imageUrl);
//     if (!result || result.length === 0) {
//       throw new Error('No classification results found for the image.');
//     }
//     console.log('Classification result:', result);
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

// module.exports = { classifyImageFromUrl };

