const classifyImageFromUrl = async (imageUrl) => {
  try {
    const { pipeline } = await import('@xenova/transformers').then((m) => m);
    const model = await pipeline('image-classification');
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
