
//import * as React from 'react'
import React, { useState, useEffect } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';


const phrases = [
  "Var kommer du ifrån?",
  "Vad heter du?",
  "Trevligt att träffas.",
  "Var är toaletten?",
  "Godnatt.",
  "Hej då!"
];


export default function App() {
  const [randomPhrase, setRandomPhrase] = useState("");
  const [apiResponse, setApiResponse] = useState("");

  useEffect(() => {
    setRandomPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
  }, []);


  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.table(err) // onNotAllowedOrFound
  );
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement('audio');
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);

    /*const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'recording.wav';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);*/
    
    const formData = new FormData();
    formData.append('file', blob, 'recording.wav');

    try {
      const response = await fetch('https://your-api-endpoint.com/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setApiResponse(data.message); // Assuming the response has a 'message' field
        console.log('File uploaded successfully:', data);
      } else {
        console.error('File upload failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }

    {apiResponse && <p>API Response: {apiResponse}</p>}

  };

  return (
    <div>
      <p>Please say the sentence below:</p>
      <h3>{randomPhrase}</h3>
      <AudioRecorder
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
        // downloadOnSavePress={true}
        // downloadFileExtension="mp3"
        showVisualizer={true}
      />
      <br />
      <button onClick={recorderControls.stopRecording}>Stop recording</button>
      <br />
    </div>
  );
}
