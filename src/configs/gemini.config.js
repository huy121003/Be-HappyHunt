require('dotenv').config();
const axios = require('axios');

const callGemini = async (data, question, history) => {
  const dataString = data.map((item, index) => 
    `Example ${index + 1}:
  Question: ${item.question}
  Answer: ${item.answer}`).join('\n\n');
  
  const prompt = `
You are a helpful and professional virtual assistant for HappyHunt website — a platform connecting sellers and buyers.

Here is a list of sample data I have prepared:
${dataString}
Your task is to answer the following question:${question}?

Requirements:
Please check the sample data to give an answer to the question
Answer the question naturally and friendly
The current sample data is single sentences so I need you to answer with complete sentence structure, line breaks, punctuation, and periods appropriately
You can use more emoticons for friendliness
If the question is not related to the sample data, politely and friendly decline
Do not say anything more unnecessary because your answer will be displayed to the user right now`;
  
  try {
    const response = await axios.post(process.env.GEMINI_API_URL, {
      "contents": [{
        "parts": [{"text": `${prompt}`}]
      }]
    });
    
    // Kiểm tra cấu trúc dữ liệu trả về
    if (response?.data?.candidates && response.data.candidates.length > 0) {
      return response.data.candidates[0].content.parts[0].text;
    }
    throw new Error("No valid response from Gemini API.");
  } catch (error) {

    throw new Error(error.message);
  }
};
const callGeminiDescription = async (data) => {
  const prompt = `
You are a regular person writing a product description to sell your own item online, not a professional seller. The tone should feel honest, friendly, and personal — like you're talking to a friend.

Use the info below to write a short, natural-sounding post in English that:
- Feels real and relatable.
- Highlights why you’re selling it (if relevant) and what’s good about it.
- Shares personal thoughts or experiences using it.
- Keeps it casual, not too formal or "salesy".
- Adds emojis if they fit (but don’t overdo it).
- Avoid repeating the product name too much.

Post Details:
- Title: ${data.name}
- Price: ${data.price} VND
- Category: ${data.category}
- Features:
${data.attributes.map(attr => `  • ${attr.name}: ${attr.value}`).join('\n')}

Length: ~100–1500 characters. Return only the post content.
`;

  try {
    const response = await axios.post(process.env.GEMINI_API_URL, {
      "contents": [
        {
          "parts": [{ "text": `${prompt}` }]
        }
      ]
    });

    if (response?.data?.candidates && response.data.candidates.length > 0) {
      return response.data.candidates[0].content.parts[0].text;
    }
    throw new Error("No valid response from Gemini API.");
  } catch (error) {
    throw new Error(error.message);
  }
}

const checkCorrectCategory = async (labels, keywords, nameCate) => {
  const filteredLabels = labels
    .filter(({ score }) => score >= 0.3)
    .flatMap(({ label }) => label.toLowerCase().split(',').map(l => l.trim()));

  const normalizedKeywords = keywords.map(k => k.toLowerCase().trim());
  const prompt = `
You are a product categorization expert.

Given:
- Image labels: "${filteredLabels.join(', ')}"
- Category name: "${nameCate}"
- Category keywords: [${normalizedKeywords.join(', ')}]

Task:
Determine if the labels are contextually or semantically related to any keyword.
Respond only with: true or false.
  `;

  try {
    const { data } = await axios.post(process.env.GEMINI_API_URL, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();
    if (answer !== 'true' && answer !== 'false') {
      throw new Error(`Unexpected response: ${answer}`);
    }
    return answer === 'true';
  } catch (error) {
    console.error('Error in checkCorrectCategory:', error.message);
    return false; // Default to false in case of errors
  }
};
const checkContent= async (text) => {
  const prompt = `You are a content moderation expert.
Your task is to determine if the following text contains any inappropriate or harmful content. Respond with "true" if the content is inappropriate, and "false" if it is acceptable.
Text: "${text}"
`;

  try {
    const response = await axios.post(process.env.GEMINI_API_URL, {
      "contents": [{
        "parts": [{"text": `${prompt}`}]
      }]
    });

    if (response?.data?.candidates && response.data.candidates.length > 0) {
      const answer = response.data.candidates[0].content.parts[0].text.trim().toLowerCase();
      return answer === 'true';
    }
    throw new Error("No valid response from Gemini API.");
  } catch (error) {
    throw new Error(error.message);
  }
}


module.exports = {
  callGemini,
  callGeminiDescription,
  checkCorrectCategory,
  checkContent
}