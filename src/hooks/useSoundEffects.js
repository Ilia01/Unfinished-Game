/**
 * Sound Effects Hook
 * Manages sound service state and provides controls
 */

import { useState, useEffect } from 'react';
import soundService from '../services/soundService';

export function useSoundEffects() {
  const [isMuted, setIsMuted] = useState(soundService.isMuted());
  const [isInitialized, setIsInitialized] = useState(soundService.isInitialized());
  const [musicEnabled, setMusicEnabled] = useState(false);

  // Initialize sound service on first user interaction
  useEffect(() => {
    const handleFirstInteraction = async () => {
      if (!soundService.isInitialized()) {
        await soundService.init();
        setIsInitialized(true);
      }
    };

    // Listen for first click anywhere on document
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const playMove = () => {
    soundService.playMove();
  };

  const playCapture = () => {
    soundService.playCapture();
  };

  const playCheck = () => {
    soundService.playCheck();
  };

  const playCheckmate = () => {
    soundService.playCheckmate();
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    soundService.setMuted(newMuted);
    setIsMuted(newMuted);
  };

  const toggleMusic = async () => {
    const enabled = await soundService.toggleMusic();
    setMusicEnabled(enabled);
  };

  return {
    playMove,
    playCapture,
    playCheck,
    playCheckmate,
    toggleMute,
    toggleMusic,
    isMuted,
    isInitialized,
    musicEnabled
  };
}
