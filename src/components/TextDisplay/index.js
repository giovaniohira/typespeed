import React, { useMemo } from 'react';
import './TextDisplay.css';

function TextDisplay({ text, userInput, hasStartedTyping, timeRemaining }) {
  // Memoize the character rendering to prevent unnecessary re-renders
  const renderedCharacters = useMemo(() => {
    return text.split('').map((char, index) => {
      // Only apply styles after typing has started
      if (!hasStartedTyping) {
        return (
          <span 
            key={index} 
            style={{ marginRight: char === ' ' ? '1rem' : '0' }}
          >
            {char}
          </span>
        );
      }

      // Check if the character has been typed correctly
      const isCorrect = userInput[index] === char;
      const isIncorrect = userInput[index] !== char && userInput.length > index;
      const isCurrent = userInput.length === index;

      return (
        <span
          key={index}
          className={`${isCorrect ? 'correct' : ''} ${isCurrent ? 'current' : ''} ${isIncorrect ? 'incorrect' : ''}`}
          style={{ marginRight: char === ' ' ? '1rem' : '0' }}
        >
          {char}
        </span>
      );
    });
  }, [text, userInput, hasStartedTyping]);

  return (
    <div className="TextDisplay">
      <p>{timeRemaining}</p>
      {renderedCharacters}
    </div>
  );
}

export default React.memo(TextDisplay);
