const encodeImagesToBase64 = (images) => {
  return images.map((image) => ({
    name: image.name,
    base64: image.data.toString('base64'), // Chuyển Buffer thành Base64
    mimetype: image.mimetype,
    size: image.size,
  }));
};
const decodeImagesFromBase64 = (encodedImages) => {
  return encodedImages.map((image) => ({
    name: image.name,
    data: Buffer.from(image.base64, 'base64'),
    mimetype: image.mimetype,
    size: image.size,
  }));
};
module.exports = {
  encodeImagesToBase64,
  decodeImagesFromBase64,
};
