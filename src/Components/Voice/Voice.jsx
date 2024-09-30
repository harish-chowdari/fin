import React, { useState, useEffect } from 'react';

const VoiceToDo = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [toDoList, setToDoList] = useState([]);

  useEffect(() => {
    // Check if the browser supports SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech Recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    if (listening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    // Cleanup function
    return () => {
      recognition.stop();
    };
  }, [listening]);

  const toggleListening = () => {
    setListening((prevState) => !prevState);
  };

  const addToDo = () => {
    if (transcript.trim()) {
      setToDoList([...toDoList, transcript.trim()]);
      setTranscript(''); // Clear the transcript after adding
    }
  };

  return (
    <div>
      <h1>Speech to To-Do List</h1>
      <button onClick={toggleListening}>
        {listening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <div>
        <input 
          type="text" 
          value={transcript} 
          onChange={(e) => setTranscript(e.target.value)} 
          placeholder="Speak or type your task"
        />
        <button onClick={addToDo}>Add to To-Do List</button>
      </div>
      <ul>
        {toDoList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default VoiceToDo;
