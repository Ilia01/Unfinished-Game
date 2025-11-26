/**
 * Chess Square Component
 * Individual square on the chess board with piece rendering
 */

import { ChessPiece } from './ChessPiece';

export function Square({
  row,
  col,
  piece,
  isLight,
  isSelected,
  isValidMove,
  isKingInCheck,
  onClick,
  size = 48
}) {
  const getPieceComponent = (piece) => {
    if (!piece) return null;
    const color = piece.startsWith('w') ? '#f8fafc' : '#1e293b';
    const type = {
      'p': 'pawn',
      'r': 'rook',
      'n': 'knight',
      'b': 'bishop',
      'q': 'queen',
      'k': 'king'
    }[piece[1]];
    return <ChessPiece type={type} color={color} />;
  };

  // Minimum touch target is 48px for accessibility
  const squareSize = Math.max(size, 48);

  return (
    <div
      onClick={onClick}
      style={{ width: `${squareSize}px`, height: `${squareSize}px` }}
      className={`
        flex items-center justify-center cursor-pointer
        transition-all duration-200 relative touch-manipulation
        ${isLight ? 'bg-slate-300' : 'bg-slate-600'}
        ${isSelected ? 'ring-4 ring-blue-400 ring-inset scale-95' : ''}
        ${isValidMove ? 'ring-4 ring-green-400 ring-inset' : ''}
        ${isKingInCheck ? 'ring-4 ring-red-500 ring-inset animate-pulse' : ''}
        active:brightness-90 active:scale-95 hover:brightness-110
      `}
    >
      <div className={piece ? 'animate-[piece-appear_0.3s_ease-out]' : ''}>
        {getPieceComponent(piece)}
      </div>
      {isValidMove && !piece && (
        <div className="absolute w-3 h-3 bg-green-400 rounded-full opacity-60 animate-pulse"></div>
      )}
      {isValidMove && piece && (
        <div className="absolute inset-0 bg-green-400 opacity-20 rounded-sm"></div>
      )}
    </div>
  );
}
