// Import OpenAI from langchain
const { OpenAI } = require('@langchain/openai');
require('dotenv').config();

// Initialize the OpenAI model
const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
    modelName: 'gpt-3.5-turbo'
});

const getLangChain = async (prompt) => {
    try {
        const response = await model.call(prompt);
        return response;
    } catch (error) {
        console.error('Error in LangChain:', error);
        throw error;
    }
};

module.exports = {
    getLangChain
};