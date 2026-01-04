import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { createWorker } from 'tesseract.js';
import './App.css';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

type Screen = 'waiting' | 'camera' | 'ocr' | 'postReading' | 'depth';

interface AppState {
  screen: Screen;
  imageSrc: string | null;
  ocrText: string;
  ocrConfidence: number;
  audioMode: 'langsam' | 'normal' | 'still';
  depthAvatar: string | null;
  userInput: string;
  onlineConsent: boolean;
}

function App() {
  const [state, setState] = useState<AppState>({
    screen: 'waiting',
    imageSrc: null,
    ocrText: '',
    ocrConfidence: 0,
    audioMode: 'normal',
    depthAvatar: null,
    userInput: '',
    onlineConsent: false,
  });

  const webcamRef = useRef<Webcam>(null);
  const speechSynth = useRef<SpeechSynthesis | null>(null);
  const recognition = useRef<any>(null);

  useEffect(() => {
    speechSynth.current = window.speechSynthesis;
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new (window as any).webkitSpeechRecognition();
      recognition.current.lang = 'de-DE';
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
    }
  }, []);

  const takePhoto = () => {
    setState(prev => ({ ...prev, screen: 'camera' }));
  };

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setState(prev => ({ ...prev, imageSrc, screen: 'ocr' }));
      performOCR(imageSrc);
    }
  };

  const performOnlineOCR = async () => {
    // Mock online OCR
    // In real, upload to API, get result
    // For now, assume improved text
    const improvedText = state.ocrText + ' (verbessert)';
    setState(prev => ({ ...prev, ocrText: improvedText, ocrConfidence: 90 }));
  };

  const requestOnlineOCR = () => {
    if (!state.onlineConsent) {
      // Show consent
      const consent = confirm('Online AI OCR verwenden? Einmalige Zustimmung.');
      if (consent) {
        setState(prev => ({ ...prev, onlineConsent: true }));
        performOnlineOCR();
      }
    } else {
      performOnlineOCR();
    }
  };

  const performOCR = async (imageSrc: string) => {
    const worker = await createWorker('deu');
    const { data: { text, confidence } } = await worker.recognize(imageSrc);
    await worker.terminate();
    setState(prev => ({ ...prev, ocrText: text, ocrConfidence: confidence }));
  };

  const readAloud = () => {
    if (speechSynth.current && state.ocrText) {
      const utterance = new SpeechSynthesisUtterance(state.ocrText);
      utterance.lang = 'de-DE';
      utterance.rate = state.audioMode === 'langsam' ? 0.5 : state.audioMode === 'still' ? 0.3 : 1;
      speechSynth.current.speak(utterance);
      utterance.onend = () => {
        setState(prev => ({ ...prev, screen: 'postReading' }));
      };
    }
  };

  const startTalking = () => {
    if (recognition.current) {
      recognition.current.start();
      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setState(prev => ({ ...prev, userInput: transcript }));
      };
    }
  };

  const openDepth = () => {
    setState(prev => ({ ...prev, screen: 'depth', depthAvatar: 'turtle' }));
  };

  const selectAvatar = (avatar: string) => {
    setState(prev => ({ ...prev, depthAvatar: avatar }));
  };

  const backToMuseum = () => {
    setState({
      screen: 'waiting',
      imageSrc: null,
      ocrText: '',
      ocrConfidence: 0,
      audioMode: 'normal',
      depthAvatar: null,
      userInput: '',
      onlineConsent: false,
    });
  };

  if (state.screen === 'waiting') {
    return (
      <div className="waiting">
        <button onClick={takePhoto}>Foto machen</button>
        <button onClick={() => {}}>Notiz</button>
      </div>
    );
  }

  if (state.screen === 'camera') {
    return (
      <div className="camera">
        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
        <button onClick={capture}>Aufnehmen</button>
      </div>
    );
  }

  if (state.screen === 'ocr') {
    return (
      <div className="ocr" style={{ backgroundImage: `url(${state.imageSrc})` }}>
        <div className="text-overlay">{state.ocrText}</div>
        <div className="controls">
          <button onClick={readAloud}>Vorlesen</button>
          <select value={state.audioMode} onChange={(e) => setState(prev => ({ ...prev, audioMode: e.target.value as any }))}>
            <option value="langsam">langsam</option>
            <option value="normal">normal</option>
            <option value="still">still</option>
          </select>
          {state.ocrConfidence < 50 && (
            <div>
              <p>Der Text ist schwer zu lesen.</p>
              <button onClick={() => {}}>So lassen</button>
              <button onClick={requestOnlineOCR}>Besser erkennen</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (state.screen === 'postReading') {
    return (
      <div className="post-reading">
        <h1>drüber quatschen?</h1>
        <p>oder einfach weitergehen.</p>
        <textarea value={state.userInput} onChange={(e) => setState(prev => ({ ...prev, userInput: e.target.value }))} />
        <button onClick={startTalking}>Push-to-talk</button>
        <button onClick={openDepth}>Tiefe öffnen</button>
        <button onClick={backToMuseum}>Weitergehen</button>
      </div>
    );
  }

  if (state.screen === 'depth') {
    if (state.depthAvatar) {
      let content = '';
      if (state.depthAvatar === 'turtle') {
        content = 'Bleib hier. Schaue das Bild an. Atme.';
      } else if (state.depthAvatar === 'fox') {
        content = 'Vielleicht ist das ein Gedanke: Was wenn...';
      } else if (state.depthAvatar === 'owl') {
        content = 'Dieses Werk stammt aus dem 19. Jahrhundert. Der Künstler lebte in Berlin.';
      } else if (state.depthAvatar === 'bear') {
        content = 'Faulmann: Ein alter Baum im Wald, der nichts sagt.';
      }
      return (
        <div className="depth">
          <p>{content}</p>
          <button onClick={() => setState(prev => ({ ...prev, depthAvatar: null }))}>genug</button>
        </div>
      );
    }
    const avatars = [
      { id: 'turtle', name: 'Turtle', desc: 'bleiben' },
      { id: 'fox', name: 'Fox', desc: 'ein gedanke' },
      { id: 'owl', name: 'Owl', desc: 'kontext' },
    ];
    return (
      <div className="depth">
        {avatars.map(avatar => (
          <button key={avatar.id} onClick={() => selectAvatar(avatar.id)}>
            {avatar.name}: {avatar.desc}
          </button>
        ))}
        {Math.random() < 0.1 && <button onClick={() => selectAvatar('bear')}>Bear: Faulmann</button>}
        <button onClick={() => setState(prev => ({ ...prev, screen: 'postReading' }))}>genug</button>
      </div>
    );
  }

  return <div>Unknown screen</div>;
}

export default App;
