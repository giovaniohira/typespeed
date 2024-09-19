import './TextDisplay.css';


function TextDisplay({ text }) {
  return (
    <div className="TextDisplay">
      <p>{text}</p>
    </div>
  );
}

export default TextDisplay;