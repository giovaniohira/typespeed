import React, { useState, useEffect } from 'react';
import './App.css';
import TextDisplay from './components/TextDisplay';
import { generateContent } from './utils/GeminiAPI';

function App() {
  const [content, setContent] = useState("Loading...");

  const prompt = "Write a story about a magic backpack.";
  
  useEffect(() => {
    async function fetchContent() {
      try {
        const generatedContent = await generateContent(prompt);
        setContent(generatedContent);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    }
    fetchContent();
  }, [prompt]);

  return (
    <div className="App">
      <TextDisplay text={content} />
    </div>
  );
}

export default App;
