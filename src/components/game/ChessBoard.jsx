/**
 * Chess Board Component
 * Renders the 8x8 chess board with all squares and pieces
 */

import { Square } from './Square';
import { useBoardSize } from '../../hooks/useBoardSize';

export function ChessBoard({ board, selectedSquare, validMoves, onSquareClick, logic }) {
  const { squareSize, boardPadding } = useBoardSize();

  const isValidMoveSquare = (row, col) => {
    return validMoves.some(([r, c]) => r === row && c === col);
  };

  return (
    <div
      className="inline-block bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 animate-[fade-in-up_0.5s_ease-out]"
      style={{ padding: `${boardPadding}px` }}
    >
      <div className="grid grid-cols-8 gap-0 border-2 border-slate-700/80 rounded-md overflow-hidden shadow-inner">
        {board.map((row, rowIndex) => (
          row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex;
            const isValidMove = isValidMoveSquare(rowIndex, colIndex);
            const isKingInCheckHere = piece && piece[1] === 'k' && logic.isKingInCheck(piece[0]);

            return (
              <Square
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                piece={piece}
                isLight={isLight}
                isSelected={isSelected}
                isValidMove={isValidMove}
                isKingInCheck={isKingInCheckHere}
                onClick={() => onSquareClick(rowIndex, colIndex)}
                size={squareSize}
              />
            );
          })
        ))}
      </div>
    </div>
  );
}
