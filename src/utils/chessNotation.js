/**
 * Chess notation utilities
 * Convert between array coordinates and algebraic notation
 */

/**
 * Convert row/col to algebraic notation
 * @param {number} row - 0-7
 * @param {number} col - 0-7
 * @returns {string} Algebraic notation (e.g., 'e4')
 */
export function positionToAlgebraic(row, col) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  return files[col] + ranks[row];
}

/**
 * Convert algebraic notation to row/col
 * @param {string} notation - Algebraic notation (e.g., 'e4')
 * @returns {Array} [row, col]
 */
export function algebraicToPosition(notation) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const col = files.indexOf(notation[0]);
  const row = 8 - parseInt(notation[1]);
  return [row, col];
}

/**
 * Convert move to algebraic notation
 * @param {Array} from - [row, col]
 * @param {Array} to - [row, col]
 * @param {string} piece - Piece string
 * @param {boolean} isCapture - Whether move captures
 * @param {boolean} isCheck - Whether move results in check
 * @param {boolean} isCheckmate - Whether move results in checkmate
 * @param {string} promotion - Promoted piece type (q/r/b/n)
 * @returns {string} Algebraic notation (e.g., 'Nf3', 'exd5')
 */
export function moveToNotation(
  from,
  to,
  piece,
  isCapture = false,
  isCheck = false,
  isCheckmate = false,
  promotion = null
) {
  const pieceSymbols = {
    p: '',
    r: 'R',
    n: 'N',
    b: 'B',
    q: 'Q',
    k: 'K'
  };

  const pieceType = piece[1];
  const symbol = pieceSymbols[pieceType];
  const toSquare = positionToAlgebraic(to[0], to[1]);

  let notation = '';

  // Castling
  if (pieceType === 'k' && Math.abs(from[1] - to[1]) === 2) {
    return to[1] === 6 ? 'O-O' : 'O-O-O';
  }

  // Piece symbol (except pawns)
  notation += symbol;

  // For pawn captures, include the file
  if (pieceType === 'p' && isCapture) {
    notation += positionToAlgebraic(from[0], from[1])[0];
  }

  // Capture symbol
  if (isCapture) {
    notation += 'x';
  }

  // Destination square
  notation += toSquare;

  // Promotion
  if (promotion) {
    notation += '=' + pieceSymbols[promotion];
  }

  // Check/checkmate
  if (isCheckmate) {
    notation += '#';
  } else if (isCheck) {
    notation += '+';
  }

  return notation;
}

/**
 * Get move description in plain English
 * @param {string} piece - Piece string
 * @param {Array} from - [row, col]
 * @param {Array} to - [row, col]
 * @param {boolean} isCapture - Whether move captures
 * @returns {string} Plain English description
 */
export function getMoveDescription(piece, from, to, isCapture) {
  const pieceNames = {
    p: 'pawn',
    r: 'rook',
    n: 'knight',
    b: 'bishop',
    q: 'queen',
    k: 'king'
  };

  const color = piece[0] === 'w' ? 'White' : 'Black';
  const pieceName = pieceNames[piece[1]];
  const fromSquare = positionToAlgebraic(from[0], from[1]);
  const toSquare = positionToAlgebraic(to[0], to[1]);

  if (isCapture) {
    return `${color} ${pieceName} from ${fromSquare} captures on ${toSquare}`;
  } else {
    return `${color} ${pieceName} from ${fromSquare} to ${toSquare}`;
  }
}
