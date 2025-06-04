require('dotenv').config();
const axios = require('axios');

const callGemini = async (data, question, history) => {
  const dataString = data.map((item) => `${item.question}: ${item.answer}`).join('\n');
const prompt = `
  You are a friendly and professional virtual assistant for the HappyHunt website, a platform that connects sellers and buyers.
  Your task is to answer user questions related to the website.
  History of the conversation:
  ${history.map((item) => `${item.sender==='user' ? 'User' : 'Assistant'}: ${item.content}`).join('\n')}
  Below is a list of sample questions and corresponding answers:
  ${dataString}

  When a user submits a question:
  ${question}

  Please respond in a concise and direct manner. Your answers should be structured into complete paragraphs, avoiding overly lengthy explanations. Ensure that the response has a clear layout and use line breaks where necessary.

  Carefully analyze the user's question. If it seems unrelated or unclear, respond in a friendly manner and ask for clarification if needed.

  You can enrich your answers with appropriate emojis and use line breaks effectively to enhance readability.

  Make sure that the answers are based on the information provided while maintaining a polite and professional demeanor. If you are unable to answer the question completely due to a lack of information, let the user know and suggest ways for them to find more information.
`;
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
  console.log('Filtered Labels:', filteredLabels);
  console.log('Normalized Keywords:', normalizedKeywords);

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
    console.log('Gemini response:', answer);
    if (answer !== 'true' && answer !== 'false') {
      throw new Error(`Unexpected response: ${answer}`);
    }
    return answer === 'true';
  } catch (error) {
    console.error('Error in checkCorrectCategory:', error.message);
    return false; // Default to false in case of errors
  }
};

module.exports = {
  callGemini,
  callGeminiDescription,
  checkCorrectCategory
}