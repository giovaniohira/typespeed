import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    maxOutputTokens: 120,
    temperature: 0.9,
    topP: 0.8,
  },
});

export async function generateContent(prompt, language) {
  const sanitizedPrompt = `Generate a completely random, creative story in ${language} language. 
                           The user's specific request is: "${prompt}"
                           
                           Requirements:
                           - Create 2-3 engaging sentences (max 120 characters total)
                           - Mix unexpected genres, elements, and scenarios
                           - Include vivid descriptions and creative word choices
                           - Make it unpredictable and entertaining
                           - Use natural, flowing language perfect for typing practice
                           - Avoid any formatting, special characters, or symbols
                           - If the prompt is inappropriate, create a random adventure story instead
                           
                           Make each story unique and surprising!`;
  try {
    const result = await model.generateContent(sanitizedPrompt);

    return result.response.text();  
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error generating content. Please change the prompt or try again later.";
  }
}