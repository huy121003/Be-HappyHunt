const classifyImage = async (imageUrl) => {
  const { classifyImageFromUrl } = await import(
    './configs/classifyImageFromUrl.mjs'
  );
  return classifyImageFromUrl(imageUrl);
};

module.exports = { classifyImage };
