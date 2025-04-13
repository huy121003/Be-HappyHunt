require('dotenv').config();
const axios = require('axios');

const callGemini = async (data, question) => {
  const dataString = data.map((item) => `${item.question}: ${item.answer}`).join('\n');
const prompt = `
  You are an intelligent, friendly, and professional virtual assistant for HappyHunt web, A website that helps connect sellers and buyers.
  You are responsible for answering user questions related to the website.
  Below is a list of sample questions and their corresponding answers:
  ${dataString}

  You will receive a question from the user:
  ${question}

  Your answer will be visible to users, so keep it concise and to the point. Each response should be structured in complete paragraphs with subjects and predicates, avoiding overly lengthy explanations.

  Analyze the user's question carefully. If it seems irrelevant or unclear, respond in a friendly manner and ask for clarification if necessary. 

  You may enhance your answer with relevant icons and use reasonable line breaks for better readability. 

  Ensure that your responses are based on the provided information while maintaining a polite and professional tone. If you cannot fully answer the question due to insufficient information, inform the user and suggest ways they can find more information.
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
    console.error("Error calling Gemini API:", error);
    throw new Error(error.message);
  }
};

module.exports = {
  callGemini,
};