/**
 * Setup Screen Component
 * Initial welcome screen before game starts
 */

import { Heart, Sparkles } from 'lucide-react';
import { RosePetals } from '../effects/RosePetals';

export function SetupScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative">
      <RosePetals count={15} />
      <div className="max-w-md w-full bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border-2 border-slate-700/50 shadow-2xl mx-3 animate-[fade-in-up_0.6s_ease-out]">
        <div className="text-center mb-8">
          <div className="animate-[pulse-glow_2s_ease-in-out_infinite] inline-block">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mx-auto mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-100 mb-3">
            <span className="text-amber-400">The Unfinished Game</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base px-2 leading-relaxed">
            Every move will generate a unique poetic message
          </p>
        </div>

        <button
          onClick={onStart}
          className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:from-amber-700 active:to-amber-800 text-slate-900 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 touch-manipulation shadow-lg hover:shadow-amber-500/30 hover:scale-105 active:scale-100"
        >
          <Heart className="w-5 h-5" />
          <span className="text-base sm:text-lg">Begin the Game</span>
        </button>
      </div>
    </div>
  );
}
