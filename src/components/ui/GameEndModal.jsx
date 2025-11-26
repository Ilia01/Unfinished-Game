/**
 * Game End Modal Component
 * Shows game end message (checkmate or stalemate)
 * Note: Currently not used in original App.jsx, but prepared for future use
 */

export function GameEndModal({ gameEnd, winner, onClose }) {
  if (!gameEnd) return null;

  const getMessage = () => {
    if (gameEnd === 'checkmate') {
      if (winner === 'White') {
        return "Some victories feel quieter than others. Not everything needs to be won, but every game teaches us something about patience and timing.";
      } else {
        return "You're learning faster than you think. Every piece you've captured, every tactic you've seen—it's all building something. Keep playing.";
      }
    } else {
      // Stalemate
      return "Some games aren't meant to be finished. Not every story needs a winner—some are beautiful precisely because they remain open, full of possibility.";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 max-w-md">
        <h2 className="text-2xl font-light text-slate-100 mb-4 text-center">
          {gameEnd === 'checkmate' ? `${winner} Wins!` : 'Stalemate'}
        </h2>
        <p className="text-slate-400 text-base mb-6 text-center italic">
          {getMessage()}
        </p>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
