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
    const result = await model(imageUrl);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  classifyImageFromUrl,
  loadModel,
};
