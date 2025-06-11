const classifyImageFromUrl = async (imageUrl) => {
  try {
    const { pipeline } = await import('@xenova/transformers');
    const model = await pipeline(
      'image-classification',
      'Xenova/mobilevit-small'
    ); // Dùng model nhẹ hơn
    const result = await model(imageUrl);
    if (!result || result?.length === 0) {
      throw new Error('No classification results found.');
    }

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
module.exports = {
  classifyImageFromUrl,
};
