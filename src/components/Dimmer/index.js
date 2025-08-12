import React from 'react';
import './Dimmer.css';

function Dimmer({ onRestart, cpm, wpm, speedData }) {
  // Calculate graph dimensions and data
  const maxWpm = Math.max(...speedData.map(d => d.wpm), 1);
  const maxCpm = Math.max(...speedData.map(d => d.cpm), 1);
  const graphWidth = 450;
  const graphHeight = 200;
  const padding = 30;

  // Generate SVG path for WPM line
  const generateWpmPath = () => {
    if (speedData.length < 2) return '';
    
    const points = speedData.map((data, index) => {
      const x = padding + (data.time / Math.max(...speedData.map(d => d.time))) * (graphWidth - 2 * padding);
      const y = padding + (1 - data.wpm / maxWpm) * (graphHeight - 2 * padding);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  // Generate SVG path for CPM line
  const generateCpmPath = () => {
    if (speedData.length < 2) return '';
    
    const points = speedData.map((data, index) => {
      const x = padding + (data.time / Math.max(...speedData.map(d => d.time))) * (graphWidth - 2 * padding);
      const y = padding + (1 - data.cpm / maxCpm) * (graphHeight - 2 * padding);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  // Generate mistake markers
  const generateMistakeMarkers = () => {
    return speedData.map((data, index) => {
      if (data.mistakes > 0) {
        const x = padding + (data.time / Math.max(...speedData.map(d => d.time))) * (graphWidth - 2 * padding);
        const y = padding + (1 - data.wpm / maxWpm) * (graphHeight - 2 * padding);
        return (
          <circle
            key={`mistake-${index}`}
            cx={x}
            cy={y}
            r="2"
            fill="var(--error)"
            opacity="0.8"
            className="mistake-marker"
          />
        );
      }
      return null;
    }).filter(Boolean);
  };

  return (
    <div className="dimmer">
      <div className="dimmer-content">
        <h2>Typing Results</h2>
        
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-label">WPM</span>
            <span className="stat-value">{wpm}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">CPM</span>
            <span className="stat-value">{cpm}</span>
          </div>
        </div>

        {speedData.length > 1 && (
          <div className="speed-graph">
            <h3>Speed Over Time</h3>
            <svg width={graphWidth} height={graphHeight} className="graph-svg">
              {/* Subtle grid lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168, 230, 207, 0.08)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Y-axis labels */}
              <text x={8} y={padding + 8} className="axis-label">{(maxWpm * 0.8).toFixed(0)}</text>
              <text x={8} y={padding + (graphHeight - 2 * padding) * 0.5 + 8} className="axis-label">{(maxWpm * 0.5).toFixed(0)}</text>
              <text x={8} y={graphHeight - padding + 8} className="axis-label">0</text>
              
              {/* X-axis labels */}
              <text x={padding} y={graphHeight - 8} className="axis-label">0s</text>
              <text x={graphWidth / 2} y={graphHeight - 8} className="axis-label">{Math.max(...speedData.map(d => d.time)) / 2}s</text>
              <text x={graphWidth - padding} y={graphHeight - 8} className="axis-label">{Math.max(...speedData.map(d => d.time))}s</text>
              
              {/* WPM line */}
              <path
                d={generateWpmPath()}
                stroke="var(--accent-primary)"
                strokeWidth="1.5"
                fill="none"
                className="graph-line"
                opacity="0.9"
              />
              
              {/* CPM line */}
              <path
                d={generateCpmPath()}
                stroke="var(--accent-secondary)"
                strokeWidth="1.5"
                fill="none"
                className="graph-line"
                opacity="0.9"
              />
              
              {/* Mistake markers */}
              {generateMistakeMarkers()}
              
              {/* Minimal legend */}
              <g className="legend">
                <circle cx={padding} cy={padding - 15} r="3" fill="var(--accent-primary)" opacity="0.9" />
                <text x={padding + 8} y={padding - 10} className="legend-text">WPM</text>
                <circle cx={padding + 70} cy={padding - 15} r="3" fill="var(--accent-secondary)" opacity="0.8" />
                <text x={padding + 78} y={padding - 10} className="legend-text">CPM</text>
                <circle cx={padding + 140} cy={padding - 15} r="2" fill="var(--error)" opacity="0.8" />
                <text x={padding + 148} y={padding - 10} className="legend-text">Mistakes</text>
              </g>
            </svg>
          </div>
        )}

        <button onClick={onRestart} className="restart-button">Try Again</button>
      </div>
    </div>
  );
}

export default Dimmer;
