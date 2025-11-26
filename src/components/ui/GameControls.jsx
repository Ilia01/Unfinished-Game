/**
 * Game Controls Component
 * Reset button and sound controls
 */

import { RotateCcw, Volume2, VolumeX, Music } from 'lucide-react';

export function GameControls({
  onReset,
  gameState,
  toggleMute,
  toggleMusic,
  isMuted,
  musicEnabled
}) {
  if (gameState !== 'playing') return null;

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
      <button
        onClick={toggleMute}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-200 rounded-lg transition-colors touch-manipulation min-w-[48px]"
        title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
      </button>

      <button
        onClick={toggleMusic}
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors touch-manipulation min-w-[48px] ${
          musicEnabled
            ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white'
            : 'bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-200'
        }`}
        title={musicEnabled ? 'Stop music' : 'Play music'}
        aria-label={musicEnabled ? 'Stop music' : 'Play music'}
      >
        <Music className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-200 rounded-lg transition-colors touch-manipulation"
      >
        <RotateCcw className="w-4 h-4" />
        <span className="text-sm sm:text-base">Start Over</span>
      </button>
    </div>
  );
}
