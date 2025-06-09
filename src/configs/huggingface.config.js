// const transformers = require('@huggingface/transformers');
// const {
//   AutoTokenizer,
//   CLIPTextModelWithProjection,
//   AutoProcessor,
//   CLIPVisionModelWithProjection,
//   RawImage,
//   dot,
//   softmax,
// } = transformers;

// async function run() {
//   const model_id = 'Xenova/mobileclip_s0';

//   // Load tokenizer and text modelyyy
//   const tokenizer = await transformers.AutoTokenizer.from_pretrained(model_id);
//   const text_model = await transformers.CLIPTextModelWithProjection.from_pretrained(model_id);

//   // Load processor and vision model
//   const processor = await transformers.AutoProcessor.from_pretrained(model_id);
//   const vision_model = await transformers.CLIPVisionModelWithProjection.from_pretrained(model_id);

//   // Run tokenization
//   const texts = ['cats', 'cars', 'birds'];
//   const text_inputs = tokenizer(texts, { padding: 'max_length', truncation: true });

//   // Compute text embeddings
//   const { text_embeds } = await text_model(text_inputs);
//   const normalized_text_embeds = text_embeds.normalize().tolist();

//   // Read image and run processor
//   const url = 'https://www.motortrend.com/uploads/2023/03/2026-Sony-Honda-Mobility-Afeela-Concept-42.jpg';
//   const image = await RawImage.read(url);
//   const image_inputs = await processor(image);

//   // Compute vision embeddings
//   const { image_embeds } = await vision_model(image_inputs);
//   const normalized_image_embeds = image_embeds.normalize().tolist();

//   // Compute probabilities
//   const probabilities = normalized_image_embeds.map(
//     x => softmax(normalized_text_embeds.map(y => 100 * dot(x, y)))
//   );
//   console.log(probabilities);
// }

// module.exports = {
//   run,
// };
