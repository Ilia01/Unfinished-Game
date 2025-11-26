/**
 * Main App Component
 * The Unfinished Game - A Chess App with AI-Generated Messages
 */

import { useChessGame } from './hooks/useChessGame';
import { useGameMessages } from './hooks/useGameMessages';
import { useSoundEffects } from './hooks/useSoundEffects';
import { SetupScreen } from './components/layout/SetupScreen';
import { GameContainer } from './components/layout/GameContainer';

function App() {
  // Game state and logic
  const {
    board,
    gameState,
    turn,
    selectedSquare,
    validMoves,
    moveCount,
    moveHistory,
    promotionSquare,
    logic,
    startGame,
    handleSquareClick,
    handlePromotion,
    checkForGameEnd,
    resetGame
  } = useChessGame();

  // Message system
  const {
    currentMessage,
    loading,
    fetchMessage,
    setMessage
  } = useGameMessages();

  // Sound effects
  const {
    playMove,
    playCapture,
    playCheck,
    playCheckmate,
    toggleMute,
    toggleMusic,
    isMuted,
    musicEnabled
  } = useSoundEffects();

  // Handle square clicks with message generation and sound
  const handleSquareClickWithMessage = async (row, col) => {

    // Handle intro click
    if (gameState === 'intro') {
      handleSquareClick(row, col);
      setMessage("Your move. Every piece you touch, every square you choose—each one adds to our story.");
      return;
    }

    // Check if this is a valid move
    if (selectedSquare) {
      const isValidMove = validMoves.some(([r, c]) => r === row && c === col);
      if (isValidMove) {
        const [selectedRow, selectedCol] = selectedSquare;
        const selectedPiece = board[selectedRow][selectedCol];
        const capturedPiece = board[row][col];

        // Don't generate message for promotion moves (will be handled after promotion)
        if (selectedPiece[1] === 'p' && (row === 0 || row === 7)) {
          handleSquareClick(row, col);
          return;
        }

        // Make the move
        handleSquareClick(row, col);

        // Play sound based on move type
        if (capturedPiece) {
          playCapture();
        } else {
          playMove();
        }

        // Generate message for the move
        await fetchMessage(selectedPiece, [selectedRow, selectedCol], [row, col], capturedPiece, moveCount);

        // Check for game end after move
        const nextTurn = turn === 'w' ? 'b' : 'w';
        setTimeout(() => {
          const gameEndResult = checkForGameEnd(nextTurn);
          if (gameEndResult) {
            if (gameEndResult === 'checkmate') {
              playCheckmate();
            }
          } else if (logic.isKingInCheck(nextTurn)) {
            playCheck();
          }
        }, 100);
        return;
      }
    }

    // Default click handling
    handleSquareClick(row, col);
  };

  // Handle promotion with message generation and sound
  const handlePromotionWithMessage = async (pieceType) => {
    const pendingMove = promotionSquare;
    if (!pendingMove) return;

    handlePromotion(pieceType);

    // Play move sound for promotion
    playMove();

    // Generate message for promotion
    const promotedPiece = turn + pieceType;
    await fetchMessage(promotedPiece, null, null, null, moveCount);

    // Check for game end after promotion
    const nextTurn = turn === 'w' ? 'b' : 'w';
    setTimeout(() => {
      const gameEndResult = checkForGameEnd(nextTurn);
      if (gameEndResult) {
        if (gameEndResult === 'checkmate') {
          playCheckmate();
        }
      } else if (logic.isKingInCheck(nextTurn)) {
        playCheck();
      }
    }, 100);
  };

  // Setup screen
  if (gameState === 'setup') {
    return <SetupScreen onStart={startGame} />;
  }

  // Main game screen
  return (
    <GameContainer
      gameState={gameState}
      board={board}
      turn={turn}
      moveCount={moveCount}
      moveHistory={moveHistory}
      selectedSquare={selectedSquare}
      validMoves={validMoves}
      promotionSquare={promotionSquare}
      currentMessage={currentMessage}
      loading={loading}
      logic={logic}
      onSquareClick={handleSquareClickWithMessage}
      onPromotion={handlePromotionWithMessage}
      onReset={resetGame}
      toggleMute={toggleMute}
      toggleMusic={toggleMusic}
      isMuted={isMuted}
      musicEnabled={musicEnabled}
    />
  );
}

export default App;
