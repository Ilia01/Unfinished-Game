/**
 * Board helper utilities
 */

/**
 * Initial chess board setup
 */
export const initialBoard = [
  ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
  ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
  ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
];

/**
 * Initial castling rights
 */
export const initialCastlingRights = {
  w: { kingSide: true, queenSide: true },
  b: { kingSide: true, queenSide: true }
};

/**
 * Get piece color
 * @param {string} piece - Piece string (e.g., 'wp', 'bn')
 * @returns {string} 'w', 'b', or empty string
 */
export function getPieceColor(piece) {
  return piece ? piece[0] : '';
}

/**
 * Get piece type
 * @param {string} piece - Piece string (e.g., 'wp', 'bn')
 * @returns {string} 'p', 'r', 'n', 'b', 'q', 'k', or empty string
 */
export function getPieceType(piece) {
  return piece ? piece[1] : '';
}

/**
 * Get full piece name
 * @param {string} piece - Piece string (e.g., 'wp', 'bn')
 * @returns {string} Full name like 'white pawn'
 */
export function getPieceName(piece) {
  if (!piece) return '';

  const colors = { w: 'white', b: 'black' };
  const types = {
    p: 'pawn',
    r: 'rook',
    n: 'knight',
    b: 'bishop',
    q: 'queen',
    k: 'king'
  };

  return `${colors[piece[0]]} ${types[piece[1]]}`;
}

/**
 * Check if square is light or dark
 * @param {number} row
 * @param {number} col
 * @returns {boolean} true if light square
 */
export function isLightSquare(row, col) {
  return (row + col) % 2 === 0;
}

/**
 * Clone board (deep copy)
 * @param {Array} board
 * @returns {Array} Cloned board
 */
export function cloneBoard(board) {
  return board.map(row => [...row]);
}

/**
 * Check if coordinates are valid
 * @param {number} row
 * @param {number} col
 * @returns {boolean}
 */
export function isValidCoordinate(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}
