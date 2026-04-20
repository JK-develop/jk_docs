const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('API Key length:', apiKey?.length);
  console.log('API Key start:', apiKey?.substring(0, 8));
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro', 'gemini-1.0-pro'];
  
  for (const modelName of models) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      console.log(`Success with ${modelName}:`, result.response.text());
      break;
    } catch (e) {
      console.error(`Failed with ${modelName}:`, e.message);
    }
  }
}

test();
