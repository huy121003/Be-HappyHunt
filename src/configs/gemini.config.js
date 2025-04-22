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
    console.error("Error calling Gemini API:", error);
    throw new Error(error.message);
  }
};

module.exports = {
  callGemini,
};