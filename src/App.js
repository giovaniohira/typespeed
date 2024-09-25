import React, { useState, useEffect, useRef } from "react";
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
    "Choose a random theme and create a very short story. Don't use formatations like ## or **"
  ); // Prompt for content generation
  const [selectedLanguage, setSelectedLanguage] = useState("English"); // Language for content generation
  const [promptInput, setPromptInput] = useState(""); // Input field for new prompt
  const promptInputRef = useRef(null); // Reference to track focus on prompt input

  async function fetchContent() {
    try {
      const generatedContent = await generateContent(prompt, selectedLanguage);
      setContent(generatedContent);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  }

  useEffect(() => {
    fetchContent();
  }, [prompt, selectedLanguage]); // Refetch content whenever the prompt changes

  useEffect(() => {
    let timer;
    if (isTimerActive && timeElapsed < selectedTime && !isGameOver) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else if (timeElapsed >= selectedTime ) {
      clearInterval(timer);
      setIsGameOver(true);
    }

    return () => clearInterval(timer);
  }, [isTimerActive, timeElapsed, selectedTime, isGameOver]);

  useEffect(() => {
    const handleKeydown = (event) => {
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
    };
    if(userInput.length === content.length) {
      setIsGameOver(true);
    }

    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [userInput, isGameOver, isTimerActive, hasStartedTyping, content]);

  useEffect(() => {
    if (timeElapsed > 0) {
      const correctCharsCount = userInput
        .split("")
        .reduce((count, char, index) => {
          return char === content[index] ? count + 1 : count;
        }, 0);

      const wordsTyped = userInput.trim().split(/\s+/).length;

      setWpm(((wordsTyped / timeElapsed) * 60).toFixed(1));
      setCpm(((correctCharsCount / timeElapsed) * 60).toFixed(1));
    }
  }, [userInput, timeElapsed, content]);

  const handleRestart = () => {
    setUserInput("");

    setWpm(0);
    setCpm(0);
    setTimeElapsed(0);
    setIsTimerActive(false);
    setIsGameOver(false);
    setHasStartedTyping(false);
    setContent("Loading...");
    fetchContent();
  };

  const handleChangePrompt = () => {
    setPrompt(promptInput); // Update the prompt with user input
    setUserInput("");

    setWpm(0);
    setCpm(0);
    setTimeElapsed(0);
    setIsTimerActive(false);
    setIsGameOver(false);
    setHasStartedTyping(false);
    setContent("Loading...");
  };

  return (
    <div className="App">
      <h1>Typespeed</h1>
      <TextConfigs
        promptInput={promptInput}
        setPromptInput={setPromptInput}
        promptInputRef={promptInputRef}
        handleChangePrompt={handleChangePrompt}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        setSelectedTime={setSelectedTime}
      />
      <TextDisplay
        timeRemaining={selectedTime - timeElapsed}
        text={content}
        userInput={userInput}
        hasStartedTyping={hasStartedTyping}
      />
      {isGameOver && <Dimmer onRestart={handleRestart} cpm={cpm} wpm={wpm} />}
    </div>
  );
}

export default App;
