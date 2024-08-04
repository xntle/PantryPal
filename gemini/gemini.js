
const { GoogleGenerativeAI } = require("@google/generative-ai");



const apiKey = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
console.log('pAPI Key:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET); // Verify the value is loaded correctly


// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Using the information in the database, recommend a simple recipe for food, be funny and use emojis like these: :-) :-0 :-D give a recipe for that food.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function getRecipeRecommendation(ingredients) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(`Here are the ingredients I have: ${ingredients.join(", ")}. What can I make?`);
    return result.response.text();
  } catch (error) {
    console.error('Error generating recipe:', error);
    return 'Sorry, there was an error generating a recipe.';
  }
}

module.exports = getRecipeRecommendation;
