
import {useState, useEffect, useRef} from 'react';

import DigitalClock from "./DigitalClock.jsx";
import Header from "./Header.jsx";
import SettingsModal from "./SettingsModal.jsx";
import trackUrl from "./audio/magical-moments.mp3";
import Timer from "./Timer.jsx";
function App() {
  const audioRef = useRef(null);

  // prop passed to SettingsModal to
  const [showSettings, setShowSettings] = useState(false);
  // prop passed to DigitalClock & SettingsModal
  const [is24h, setIs24h] = useState(()=> {
    // restore user pref from ls
    const saved = localStorage.getItem("clock:is24h");
    // "true" if saved exists, else false
    return saved ? JSON.parse(saved) : false;
  });

  // toggle music playing
  const [isPlaying, setIsPlaying] = useState(false);
  // toggle music on/off
  function toggleMusic() {
    setIsPlaying(p => !p);
  }

  // hook the audio element up to isPlaying
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.play().catch(()=>{
        el.play().catch(()=>{
          setIsPlaying(false);
        });
      })
    } else {
      el.pause();
    }
  }, [isPlaying]);

  // set local storage every time is24h is changed
  useEffect(() => {
    localStorage.setItem("clock:is24h", JSON.stringify(is24h));
  }, [is24h]);

  // lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showSettings ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [showSettings]);
  return (
  <>
    <audio ref={audioRef} src={trackUrl} loop preload="none"/>
    <Header 
      onSettingsClick={() => setShowSettings(prev => !prev)}
      player={{isPlaying, toggleMusic,}}
      />
    <DigitalClock is24h={is24h}/>
    {showSettings && (
      <SettingsModal
        is24h={is24h}
        onChangeIs24h={setIs24h}
        onClose={() => setShowSettings(false)}
      />
    )}
    <Timer/>

  </>
  );
}

export default App;