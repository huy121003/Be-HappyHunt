// const {
//   AutoTokenizer,
//   CLIPTextModelWithProjection,
//   AutoProcessor,
//   CLIPVisionModelWithProjection,
//   RawImage,
//   dot,
//   softmax,
// } = require('@huggingface/transformers');

// // Khởi tạo mô hình một lần
// let tokenizer, text_model, processor, vision_model;
// const model_id = 'Xenova/mobileclip_s0';

// const retryAsync = async (fn, retries = 3, delay = 1000) => {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       return await fn();
//     } catch (error) {
//       console.error(`Attempt ${attempt} failed:`, error.message);
//       if (attempt === retries) throw error;
//       console.log(`Retrying in ${delay}ms...`);
//       await new Promise(res => setTimeout(res, delay));
//     }
//   }
// };

// const initializeModels = async () => {
//   try {
//     if (!tokenizer) {
//       console.log('Khởi tạo tokenizer...');
//       tokenizer = await retryAsync(() => AutoTokenizer.from_pretrained(model_id, { progress_callback: (progress) => console.log(`Tokenizer load: ${progress}%`) }));
//     }
//     if (!text_model) {
//       console.log('Khởi tạo text model...');
//       text_model = await retryAsync(() => CLIPTextModelWithProjection.from_pretrained(model_id, { progress_callback: (progress) => console.log(`Text model load: ${progress}%`) }));
//     }
//     if (!processor) {
//       console.log('Khởi tạo processor...');
//       processor = await retryAsync(() => AutoProcessor.from_pretrained(model_id, { progress_callback: (progress) => console.log(`Processor load: ${progress}%`) }));
//     }
//     if (!vision_model) {
//       console.log('Khởi tạo vision model...');
//       vision_model = await retryAsync(() => CLIPVisionModelWithProjection.from_pretrained(model_id, { progress_callback: (progress) => console.log(`Vision model load: ${progress}%`) }));
//     }
//   } catch (error) {
//     console.error('Lỗi khi khởi tạo mô hình:', error);
//     throw error;
//   }
// };

// const checkHuggingFaceConfig = async (imageUrl, categories) => {
//   try {
//     if (!imageUrl || !categories || !Array.isArray(categories) || categories.length === 0) {
//       throw new Error('Invalid input: imageUrl and categories are required.');
//     }

//     console.log('Initializing models...');
//     await initializeModels();

//     console.log('Tokenizing texts:', categories);
//     const text_inputs = tokenizer(categories, { padding: 'max_length', truncation: true });
//     if (!text_inputs) throw new Error('Failed to tokenize texts.');

//     console.log('Computing text embeddings...');
//     const { text_embeds } = await text_model(text_inputs);
//     if (!text_embeds) throw new Error('Failed to compute text embeddings.');
//     const normalized_text_embeds = text_embeds.normalize().tolist();

//     console.log('Loading image from:', imageUrl);
//     const image = await retryAsync(() => RawImage.read(imageUrl));
//     if (!image) throw new Error('Failed to load image.');
//     const image_inputs = await processor(image);
//     if (!image_inputs) throw new Error('Failed to process image.');

//     console.log('Computing vision embeddings...');
//     const { image_embeds } = await vision_model(image_inputs);
//     if (!image_embeds) throw new Error('Failed to compute vision embeddings.');
//     const normalized_image_embeds = image_embeds.normalize().tolist();

//     console.log('Computing probabilities...');
//     const probabilities = normalized_image_embeds.map(
//       x => softmax(normalized_text_embeds.map(y => 100 * dot(x, y)))
//     );
//     if (!probabilities || probabilities.length === 0) throw new Error('Failed to compute probabilities.');
//     console.log('Probabilities:', probabilities);

//     return probabilities[0].map((score, index) => ({
//       label: categories[index],
//       score,
//     }));
//   } catch (error) {
//     console.error('Lỗi trong checkHuggingFaceConfig:', error);
//     throw error;
//   }
// };

// module.exports = { checkHuggingFaceConfig, initializeModels };