import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, ArrowLeftRight } from 'lucide-react';
import axios from 'axios';

const LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  nl: 'Dutch',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  hi: 'Hindi'
};

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  let recognition;

  const initSpeechRecognition = () => {
    recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.lang = sourceLang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setInputText(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const startListening = () => {
    if (!recognition) initSpeechRecognition();
    if (sourceLang !== 'en' && sourceLang !== 'hi') {
      alert('Speech-to-text conversion may not work well for this language. Please consider typing.');
    }
    recognition.lang = sourceLang; // Ensure language is updated dynamically
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognition) recognition.stop();
    setIsListening(false);
  };

  const toggleMic = () => {
    if (micEnabled) {
      stopListening();
    } else {
      startListening();
    }
    setMicEnabled(!micEnabled);
  };

  const speak = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeech = () => {
    if (speechEnabled) {
      window.speechSynthesis.cancel();
    } else {
      speak(outputText, targetLang);
    }
    setSpeechEnabled(!speechEnabled);
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const translateText = async () => {
    setIsTranslating(true);
    try {
      const formData = new URLSearchParams();
      formData.append('source_language', sourceLang);
      formData.append('target_language', targetLang);
      formData.append('text', inputText);

      const response = await axios.post('https://text-translator2.p.rapidapi.com/translate', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-rapidapi-host': 'text-translator2.p.rapidapi.com',
          'x-rapidapi-key': '24f51dff97msh23e7d8a082ceae7p135131jsnf156e9e71d50',
        }
      });

      setOutputText(response.data.data.translatedText);  
    } catch (error) {
      console.error("Translation failed", error);
      setOutputText('Error translating text');
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    if (inputText.trim()) {
      translateText();
    }
  }, [inputText, sourceLang, targetLang]);

  return (
    <div className="min-h-screen bg-gradient-to-bl from-purple-300 via-pink-300 to-orange-300 p-8 flex justify-center items-center">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-gray-800">AI Language Translator</h1>
          <p className="mt-4 text-lg text-gray-600">Real-time translation with voice and text support</p>
        </div>

        {isTranslating && (
          <div className="mb-4 text-center text-red-600 font-medium">
            Translation in progress...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-4">
              <select
                value={sourceLang}
                onChange={(e) => {
                  setSourceLang(e.target.value);
                  if (isListening) stopListening(); // Restart recognition with new language
                }}
                className="w-2/3 bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-xl py-2 px-4 focus:ring-2 focus:ring-purple-400"
              >
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
              <button
                onClick={toggleMic}
                className={`p-3 rounded-full ${micEnabled ? 'bg-red-400 text-white' : 'bg-gray-300 text-gray-700'} hover:bg-opacity-90 transition-all`}
              >
                {micEnabled ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Speak or type text here..."
              className="w-full h-40 p-4 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-4">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-2/3 bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-xl py-2 px-4 focus:ring-2 focus:ring-purple-400"
              >
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
              <button
                onClick={toggleSpeech}
                className={`p-3 rounded-full ${speechEnabled ? 'bg-purple-400 text-white' : 'bg-gray-300 text-gray-700'} hover:bg-opacity-90 transition-all`}
              >
                {speechEnabled ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
            </div>
            <textarea
              value={outputText}
              readOnly
              placeholder="Translation will appear here..."
              className="w-full h-40 p-4 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={swapLanguages}
            className="p-3 rounded-full bg-purple-500 text-white hover:bg-purple-600 shadow-md transition-all"
          >
            <ArrowLeftRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;