import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateContent(prompt) {
  try {
    const result = await model.generateContent(prompt);

    return result.response.text();  
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error generating content.";
  }
}