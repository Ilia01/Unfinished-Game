/**
 * Promotion Modal Component
 * Modal dialog for pawn promotion piece selection
 */

import { ChessPiece } from './ChessPiece';

export function PromotionModal({ turn, onPromotion }) {
  const pieceTypes = ['q', 'r', 'b', 'n'];
  const color = turn === 'w' ? '#f8fafc' : '#1e293b';
  const names = { q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight' };
  const types = { q: 'queen', r: 'rook', b: 'bishop', n: 'knight' };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-[fade-in-up_0.3s_ease-out] p-4">
      <div className="bg-slate-800/95 rounded-xl p-6 sm:p-8 border-2 border-amber-500/30 shadow-2xl max-w-md w-full mx-4 animate-[fade-in-up_0.4s_ease-out]">
        <h3 className="text-2xl sm:text-3xl font-light text-slate-100 mb-3 text-center">
          <span className="text-amber-400">Promotion!</span>
        </h3>
        <p className="text-slate-400 text-sm sm:text-base mb-6 text-center">
          Your pawn has reached the end. Choose a piece to promote to:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {pieceTypes.map((pieceType, index) => (
            <button
              key={pieceType}
              onClick={() => onPromotion(pieceType)}
              className="flex flex-col items-center gap-2 p-4 sm:p-5 bg-slate-700/80 hover:bg-slate-600 active:bg-slate-500 hover:scale-105 active:scale-95 rounded-xl transition-all duration-200 border border-slate-600 hover:border-amber-500/50 touch-manipulation animate-[fade-in-up_0.5s_ease-out]"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="transform hover:scale-110 transition-transform">
                <ChessPiece type={types[pieceType]} color={color} />
              </div>
              <span className="text-slate-300 text-xs sm:text-sm font-medium">{names[pieceType]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
