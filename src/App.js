import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import TextDisplay from "./components/TextDisplay";
import { generateContent } from "./utils/GeminiAPI";
import Dimmer from "./components/Dimmer";
import TextConfigs from "./components/TextConfigs";

function App() {
  const [content, setContent] = useState("Loading..."); // Content to be typed
  const [userInput, setUserInput] = useState(""); // User input

  const [wpm, setWpm] = useState(0); // Words per minute
  const [cpm, setCpm] = useState(0); // Characters per minute
  const [timeElapsed, setTimeElapsed] = useState(0); // Timer
  const [selectedTime, setSelectedTime] = useState(30); // Timer duration
  const [isTimerActive, setIsTimerActive] = useState(false); // Control timer
  const [isGameOver, setIsGameOver] = useState(false); // Game state
  const [hasStartedTyping, setHasStartedTyping] = useState(false); // Track typing
  const [prompt, setPrompt] = useState(
    "Create a completely random, creative story in 2-3 sentences. Mix genres, unexpected elements, and vivid descriptions. Make it unpredictable and engaging. Avoid any formatting or special characters."
  ); // Prompt for content generation

  const [selectedLanguage, setSelectedLanguage] = useState("English"); // The language for content generation
  const [tempSelectedLanguage, setTempSelectedLanguage] = useState("English"); // Temporary language before applying

  const [promptInput, setPromptInput] = useState(""); // Input field for new prompt
  const promptInputRef = useRef(null); // Reference to track focus on prompt input

  // Speed tracking over time
  const [speedData, setSpeedData] = useState([]); // Array of {time, wpm, cpm, mistakes} objects

  // Fetch content function
  const fetchContent = useCallback(async () => {
    try {
      const generatedContent = await generateContent(prompt, selectedLanguage);
      setContent(generatedContent);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  }, [prompt, selectedLanguage]);

  // Fetch content on initial load and when prompt changes
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    let timer;
    if (isTimerActive && timeElapsed < selectedTime && !isGameOver) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else if (timeElapsed >= selectedTime) {
      clearInterval(timer);
      setIsGameOver(true);
    }

    return () => clearInterval(timer);
  }, [isTimerActive, timeElapsed, selectedTime, isGameOver]);

  // Memoized keydown handler to prevent recreation on every render
  const handleKeydown = useCallback((event) => {
    if (
      isGameOver ||
      content === "Loading..." ||
      document.activeElement === promptInputRef.current // Check if prompt input is focused
    ) {
      return; // Block typing if game is over, content is loading, or prompt input is focused
    }

    const { key } = event;
    if (!isTimerActive) setIsTimerActive(true); // Start timer on first keypress
    if (!hasStartedTyping) setHasStartedTyping(true); // Mark when typing starts

    if (key === "Backspace") {
      setUserInput((prev) => prev.slice(0, -1)); // Remove last char
    } else if (key.length === 1) {
      setUserInput((prev) => prev + key); // Append char to input
    }
  }, [isGameOver, content, isTimerActive, hasStartedTyping, promptInputRef]);

  useEffect(() => {
    if (userInput.length === content.length) {
      setIsGameOver(true);
    }

    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [userInput, content, handleKeydown]);

  useEffect(() => {
    if (timeElapsed > 0) {
      const correctCharsCount = userInput
        .split("")
        .reduce((count, char, index) => {
          return char === content[index] ? count + 1 : count;
        }, 0);

      const wordsTyped = userInput.trim().split(/\s+/).length;
      const mistakes = userInput.length - correctCharsCount;

      const currentWpm = ((wordsTyped / timeElapsed) * 60).toFixed(1);
      const currentCpm = ((correctCharsCount / timeElapsed) * 60).toFixed(1);

      setWpm(currentWpm);
      setCpm(currentCpm);

      // Track speed data every second
      setSpeedData(prev => {
        const newData = [...prev];
        const existingIndex = newData.findIndex(item => item.time === timeElapsed);
        
        if (existingIndex !== -1) {
          newData[existingIndex] = { 
            time: timeElapsed, 
            wpm: parseFloat(currentWpm), 
            cpm: parseFloat(currentCpm),
            mistakes: mistakes
          };
        } else {
          newData.push({ 
            time: timeElapsed, 
            wpm: parseFloat(currentWpm), 
            cpm: parseFloat(currentCpm),
            mistakes: mistakes
          });
        }
        
        return newData;
      });
    }
  }, [userInput, timeElapsed, content]);

  const handleRestart = useCallback(() => {
    setUserInput("");
    setWpm(0);
    setCpm(0);
    setTimeElapsed(0);
    setIsTimerActive(false);
    setIsGameOver(false);
    setHasStartedTyping(false);
    setContent("Loading...");
    setSpeedData([]); // Reset speed data
    fetchContent(); // Fetch new content
  }, [fetchContent]);

  const handleChangePrompt = useCallback(() => {
    setPrompt(promptInput); // Update the prompt with user input
    setSelectedLanguage(tempSelectedLanguage); // Update the selected language when "Change Prompt" is pressed
    setUserInput("");
    setWpm(0);
    setCpm(0);
    setTimeElapsed(0);
    setIsTimerActive(false);
    setIsGameOver(false);
    setHasStartedTyping(false);
    setContent("Loading...");
    setSpeedData([]); // Reset speed data
    fetchContent(); // Fetch content after changing the prompt and language
  }, [promptInput, tempSelectedLanguage, fetchContent]);

  return (
    <div className="App">
      <h1>Typespeed</h1>
      <TextConfigs
        promptInput={promptInput}
        setPromptInput={setPromptInput}
        promptInputRef={promptInputRef}
        handleChangePrompt={handleChangePrompt}
        tempSelectedLanguage={tempSelectedLanguage}
        setTempSelectedLanguage={setTempSelectedLanguage}
        setSelectedTime={setSelectedTime}
      />
      <TextDisplay
        timeRemaining={selectedTime - timeElapsed}
        text={content}
        userInput={userInput}
        hasStartedTyping={hasStartedTyping}
      />
      {isGameOver && <Dimmer onRestart={handleRestart} cpm={cpm} wpm={wpm} speedData={speedData} />}
      <p className="disclaimer">This game was created as a proof of concept, you may experience some bugs, mainly with the custom prompts. Coded by <a href="https://github.com/giovaniohira" target="_blank">Giovani Ohira</a></p>
    </div>
  );
}

export default App;
