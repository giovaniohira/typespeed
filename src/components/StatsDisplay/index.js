import './StatsDisplay.css';

function StatsDisplay({ wpm, cpm }) {
    return (
        <div className="StatsDisplay">
        <h2>Stats</h2>
            <p>WPM: {wpm}</p>
            <p>CPM: {cpm}</p>
        </div>
    );
}

export default StatsDisplay;