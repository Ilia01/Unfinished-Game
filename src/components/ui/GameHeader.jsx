/**
 * Game Header Component
 * Displays game state and current turn information
 */

export function GameHeader({ gameState, turn, moveCount }) {
  if (gameState === 'intro') {
    return (
      <div className="text-center mb-6 sm:mb-10 md:mb-12 space-y-3 sm:space-y-4 px-2">
        <h1 className="text-3xl sm:text-4xl font-light text-slate-100 mb-2">
          <span className="text-amber-400">The Unfinished Game</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-2">
          Every chess game is a conversation. Every move, a choice between countless possibilities.
          This is a game we're playing together—learning, teaching, and discovering new patterns with each turn.
        </p>
        <p className="text-slate-500 text-xs sm:text-sm">Click the board to begin</p>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="text-center mb-4 sm:mb-6 md:mb-8 px-2">
        <h2 className="text-xl sm:text-2xl font-light text-slate-100 mb-2">Our Story Unfolds</h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          {turn === 'w' ? "White's turn" : "Black's turn"} • Move {moveCount}
        </p>
      </div>
    );
  }

  return null;
}
