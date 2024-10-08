import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    maxOutputTokens: 90,
  },
});

export async function generateContent(prompt, language) {
  const sanitizedPrompt = `This is a  very short story generation request based on a user-provided prompt with at most one paragraph. 
                           The user has given the following prompt: "${prompt}", you need to generate the text in ${language} language. 
                           If there is anything inappropriate about the prompt or if no prompt has been provided, please choose a random theme and generate a short story.
                           Avoid using any sensitive, offensive, or explicit content.
                           If the request is not accepted, return a short story with a random theme.
                           `;
  try {
    const result = await model.generateContent(sanitizedPrompt);

    return result.response.text();  
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error generating content. Please change the prompt or try again later.";
  }
}