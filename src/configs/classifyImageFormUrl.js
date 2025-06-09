const classifyImageFromUrl = async (imageUrl) => {
  try {
    const module = await import('@xenova/transformers');
    const model = await module.pipeline('image-classification');
    const result = await model(imageUrl);
    if (!result || result.length === 0) {
      throw new Error('No classification results found for the image.');
    }
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { classifyImageFromUrl };
