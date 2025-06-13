let model;
const loadModel = async () => {
  if (!model) {
    const { pipeline } = await import('@xenova/transformers');
    model = await pipeline(
      'image-classification',
      'Xenova/vit-base-patch16-224'
    );
  }
};

const classifyImageFromUrl = async (imageUrl) => {
  try {
    await loadModel(); // Ensure the model is loaded before classifying
    const result = await model(imageUrl);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  classifyImageFromUrl,
  loadModel,
};
