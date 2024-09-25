import './TextDisplay.css';

function TextDisplay({ text, userInput, hasStartedTyping, timeRemaining }) {
  return (
    <div className="TextDisplay">
      <p>{timeRemaining}</p>
      {text.split('').map((char, index) => {
        // Only apply styles after typing has started
        if (!hasStartedTyping) {
          return <span key={index} 
          style={{ marginRight: char === ' ' ? '1rem' : '0' }}
          >{char}</span>;
        }

        // Check if the character has been typed correctly
        const isCorrect = userInput[index] === char;
        const isIncorrect = userInput[index] !== char && userInput.length > index;
        const isCurrent = userInput.length === index;

        return (
          <>
            <span
              key={index}
              className={`${isCorrect ? 'correct' : ''} ${isCurrent ? 'current' : ''} ${isIncorrect ? 'incorrect' : ''}`}
              style={{ marginRight: char === ' ' ? '1rem' : '0' }}
            >
              {char}
            </span>
          </>
        );
      })}
    </div>
  );
}

export default TextDisplay;
