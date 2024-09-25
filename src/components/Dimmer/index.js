import React from 'react';
import './Dimmer.css';

function Dimmer({ onRestart, cpm, wpm }) {
  return (
    <div className="dimmer">
      <div className="dimmer-content">
        <p>WPM: <span>{wpm}</span></p>
        <p>CPM: <span>{cpm}</span></p>
        <button onClick={onRestart}>Restart</button>
      </div>
    </div>
  );
}

export default Dimmer;
