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
const callGeminiDescription=async(data)=>{
  const prompt = `
You are a highly skilled and experienced product description writer. Your task is to create a compelling, engaging, and informative product description for an e-commerce listing. The goal is to make the product stand out to potential customers by clearly communicating its value, features, and benefits in a professional yet friendly tone.

Please use the following Post details to craft your description:

📦 Post Information:
- 🏷️ Post Title: ${data.name}
- 💰 Price: ${data.price} VND
- 🗂️ Post Category: ${data.category}
- 🔧 Key Features & Attributes:
${data.attributes.map(attr => `  • ${attr.name}: ${attr.value}`).join('\n')}

🎯 Objectives:
- Create a well-structured and persuasive description that not only informs but also inspires the customer to make a purchase.
- Highlight the **main features**, but also emphasize the **practical benefits** and **unique selling points** of the product.
- Describe how the product can **solve a problem**, **improve the user’s daily life**, or **enhance their experience**.

📌 Writing Guidelines:
- ✅ Length: Between 100 and 1500 characters.
- ✅ SEO: Include relevant keywords naturally to improve searchability.
- ✅ Language: English.
- ✅ Tone: Professional, friendly, and easy to understand.
- ✅ Style: Clear, concise, trustworthy, and customer-focused.
- ✅ Format: Use short paragraphs or bullet points where appropriate for readability.
- ✅ Visuals: Incorporate suitable emojis to make the text feel more lively and approachable (but don’t overuse them).

Please generate only the product description content based on the instructions above. Avoid repeating the product name more than necessary, and focus on making the product desirable to potential buyers.
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

}

module.exports = {
  callGemini,
  callGeminiDescription
};