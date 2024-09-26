import './TextConfig.css';

function TextConfigs({ 
    promptInput, 
    setPromptInput, 
    promptInputRef, 
    handleChangePrompt, 
    tempSelectedLanguage, 
    setTempSelectedLanguage, 
    setSelectedTime 
}) {
    const languages = [
        "English", "Mandarin", "Hindi", "Spanish", "French", "Arabic", "Bengali", "Russian", "Portuguese", "Urdu",
        "Indonesian", "German", "Japanese", "Swahili", "Marathi", "Telugu", "Turkish", "Tamil", "Korean", "Vietnamese"
    ];

    return (
        <div className="TextConfigs">
            <input 
                className='prompt-input'
                type="text" 
                value={promptInput} 
                onChange={(e) => setPromptInput(e.target.value)} 
                placeholder="Enter a new prompt" 
                ref={promptInputRef}
            />
            <select 
                className='language-select'
                value={tempSelectedLanguage} 
                onChange={(e) => setTempSelectedLanguage(e.target.value)}
            >
                {languages.map((language, index) => (
                    <option key={index} value={language} className='language-option'>
                        {language}
                    </option>
                ))}
            </select>
            <select 
                className='time-select'
                onChange={(e) => setSelectedTime(parseInt(e.target.value))}
            >
                {[5, 15, 30, 60].map((time, index) => (
                    <option key={index} value={time} className='time-option'>
                        {time} seconds
                    </option>
                ))}
            </select>
            <button className='prompt-button' onClick={handleChangePrompt}>Change Prompt</button>
            <p className='gemini'>This game is powered by Gemini AI, you can use a personalized prompt, give it a try!</p>
        </div>
    );
}

export default TextConfigs;
