/**
 * Move History Component
 * Displays the list of moves in chess notation
 */

import { ScrollText } from 'lucide-react';

export function MoveHistory({ moves, gameState }) {
  if (gameState !== 'playing' || moves.length === 0) return null;

  // Group moves by move number (white + black = 1 move number)
  const groupedMoves = [];
  for (let i = 0; i < moves.length; i += 2) {
    const whiteMove = moves[i];
    const blackMove = moves[i + 1];
    groupedMoves.push({
      number: whiteMove.moveNumber,
      white: whiteMove,
      black: blackMove || null
    });
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-slate-800/50 backdrop-blur rounded-lg border border-slate-700 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 border-b border-slate-600">
          <ScrollText className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-medium text-slate-200">Move History</h3>
        </div>

        <div className="max-h-48 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          {groupedMoves.map((move) => (
            <div
              key={move.number}
              className="grid grid-cols-[auto_1fr_1fr] gap-2 px-2 py-1.5 hover:bg-slate-700/30 rounded transition-colors text-sm"
            >
              <span className="text-slate-500 font-mono text-xs self-center">
                {move.number}.
              </span>
              <div className="text-slate-300 font-mono text-xs self-center">
                {move.white.notation}
              </div>
              <div className="text-slate-300 font-mono text-xs self-center">
                {move.black ? move.black.notation : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
