import { pipeline } from '@xenova/transformers';

export async function classifyImageFromUrl(imageUrl) {
  try {
    const model = await pipeline('image-classification');
    const result = await model(imageUrl);
    if (!result || result.length === 0) {
      throw new Error('No classification results found for the image.');
    }
    return result;
  } catch (error) {
    throw error;
  }
}
