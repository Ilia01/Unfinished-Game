/**
 * Game Container Component
 * Main playing screen layout with board, messages, and controls
 */

import { useState, useEffect } from 'react';
import { GameHeader } from '../ui/GameHeader';
import { MessageDisplay } from '../ui/MessageDisplay';
import { GameControls } from '../ui/GameControls';
import { MoveHistory } from '../ui/MoveHistory';
import { ChessBoard } from '../game/ChessBoard';
import { PromotionModal } from '../game/PromotionModal';
import { RosePetals } from '../effects/RosePetals';

export function GameContainer({
  gameState,
  board,
  turn,
  moveCount,
  moveHistory,
  selectedSquare,
  validMoves,
  promotionSquare,
  currentMessage,
  loading,
  logic,
  onSquareClick,
  onPromotion,
  onReset,
  toggleMute,
  toggleMusic,
  isMuted,
  musicEnabled
}) {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (currentMessage) {
      setFadeIn(false);
      setTimeout(() => setFadeIn(true), 50);
    }
  }, [currentMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-3 sm:p-4 relative">
      <RosePetals count={20} />
      <div className="max-w-4xl w-full relative z-10">
        <GameHeader gameState={gameState} turn={turn} moveCount={moveCount} />

        <div className="flex flex-col lg:flex-row items-start justify-center gap-4 sm:gap-6 md:gap-8 w-full">
          <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 w-full lg:w-auto">
            <ChessBoard
              board={board}
              selectedSquare={selectedSquare}
              validMoves={validMoves}
              onSquareClick={onSquareClick}
              logic={logic}
            />

            <MessageDisplay message={currentMessage} loading={loading} fadeIn={fadeIn} />

            <GameControls
              onReset={onReset}
              gameState={gameState}
              toggleMute={toggleMute}
              toggleMusic={toggleMusic}
              isMuted={isMuted}
              musicEnabled={musicEnabled}
            />
          </div>

          <div className="w-full lg:w-auto lg:min-w-[280px] flex justify-center">
            <MoveHistory moves={moveHistory} gameState={gameState} />
          </div>
        </div>

        {promotionSquare && (
          <PromotionModal turn={turn} onPromotion={onPromotion} />
        )}
      </div>
    </div>
  );
}
