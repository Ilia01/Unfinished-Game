/**
 * Pure chess logic functions
 * All functions are pure - no side effects, no state mutations
 */

/**
 * Get raw valid moves for a piece without considering check
 * @param {Array} board - 8x8 board array
 * @param {number} row - Piece row
 * @param {number} col - Piece column
 * @param {string} piece - Piece string (e.g., 'wp', 'bn')
 * @param {Object} castlingRights - Castling rights object
 * @param {Object} lastMove - Last move object for en passant
 * @returns {Array} Array of [row, col] valid moves
 */
export function getValidMovesRaw(board, row, col, piece, castlingRights = null, lastMove = null) {
  if (!piece) return [];

  const moves = [];
  const color = piece[0];
  const type = piece[1];

  if (type === 'p') {
    const direction = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;
    const enPassantRow = color === 'w' ? 3 : 4;

    // Forward move
    if (!board[row + direction]?.[col]) {
      moves.push([row + direction, col]);
      // Double move from start
      if (row === startRow && !board[row + 2 * direction]?.[col]) {
        moves.push([row + 2 * direction, col]);
      }
    }

    // Captures
    if (board[row + direction]?.[col - 1] && board[row + direction][col - 1][0] !== color) {
      moves.push([row + direction, col - 1]);
    }
    if (board[row + direction]?.[col + 1] && board[row + direction][col + 1][0] !== color) {
      moves.push([row + direction, col + 1]);
    }

    // En passant
    if (row === enPassantRow && lastMove) {
      const { from, to, piece: movedPiece } = lastMove;
      if (movedPiece[1] === 'p' && Math.abs(from[0] - to[0]) === 2) {
        if (to[0] === row && Math.abs(to[1] - col) === 1) {
          moves.push([row + direction, to[1]]);
        }
      }
    }
  } else if (type === 'n') {
    // Knight moves
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    knightMoves.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        if (!board[newRow][newCol] || board[newRow][newCol][0] !== color) {
          moves.push([newRow, newCol]);
        }
      }
    });
  } else if (type === 'b') {
    // Bishop moves - diagonals
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    directions.forEach(([dr, dc]) => {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
        if (!board[newRow][newCol]) {
          moves.push([newRow, newCol]);
        } else {
          if (board[newRow][newCol][0] !== color) {
            moves.push([newRow, newCol]);
          }
          break;
        }
      }
    });
  } else if (type === 'r') {
    // Rook moves - straight lines
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    directions.forEach(([dr, dc]) => {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
        if (!board[newRow][newCol]) {
          moves.push([newRow, newCol]);
        } else {
          if (board[newRow][newCol][0] !== color) {
            moves.push([newRow, newCol]);
          }
          break;
        }
      }
    });
  } else if (type === 'q') {
    // Queen moves - all directions
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
    directions.forEach(([dr, dc]) => {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
        if (!board[newRow][newCol]) {
          moves.push([newRow, newCol]);
        } else {
          if (board[newRow][newCol][0] !== color) {
            moves.push([newRow, newCol]);
          }
          break;
        }
      }
    });
  } else if (type === 'k') {
    // King moves - one square any direction
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        if (!board[newRow][newCol] || board[newRow][newCol][0] !== color) {
          moves.push([newRow, newCol]);
        }
      }
    });

    // Castling (only if castlingRights provided)
    if (castlingRights) {
      const rights = castlingRights[color];
      const homeRow = color === 'w' ? 7 : 0;

      // Kingside castling
      if (rights?.kingSide && row === homeRow && col === 4) {
        if (!board[homeRow][5] && !board[homeRow][6] && board[homeRow][7] === color + 'r') {
          moves.push([homeRow, 6]);
        }
      }

      // Queenside castling
      if (rights?.queenSide && row === homeRow && col === 4) {
        if (!board[homeRow][3] && !board[homeRow][2] && !board[homeRow][1] && board[homeRow][0] === color + 'r') {
          moves.push([homeRow, 2]);
        }
      }
    }
  }

  return moves;
}

/**
 * Check if a square is under attack by a color
 */
export function isSquareUnderAttack(board, targetRow, targetCol, byColor, castlingRights = null, lastMove = null) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece[0] === byColor) {
        // Get moves without castling to avoid circular dependency
        const moves = getValidMovesRaw(board, row, col, piece, null, lastMove);
        if (moves.some(([r, c]) => r === targetRow && c === targetCol)) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Find the king position for a color
 */
export function findKing(board, color) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === color + 'k') {
        return [row, col];
      }
    }
  }
  return null;
}

/**
 * Check if a king is in check
 */
export function isKingInCheck(board, color, castlingRights = null, lastMove = null) {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const [kingRow, kingCol] = kingPos;
  const enemyColor = color === 'w' ? 'b' : 'w';
  return isSquareUnderAttack(board, kingRow, kingCol, enemyColor, castlingRights, lastMove);
}

/**
 * Get valid moves that don't leave king in check
 */
export function getValidMoves(board, row, col, piece, castlingRights, lastMove) {
  if (!piece) return [];

  const rawMoves = getValidMovesRaw(board, row, col, piece, castlingRights, lastMove);
  const color = piece[0];

  // Filter out moves that would leave king in check
  return rawMoves.filter(([toRow, toCol]) => {
    const testBoard = board.map(r => [...r]);
    testBoard[toRow][toCol] = piece;
    testBoard[row][col] = '';

    // Handle en passant capture in test
    if (piece[1] === 'p' && toCol !== col && !board[toRow][toCol]) {
      testBoard[row][toCol] = '';
    }

    return !isKingInCheck(testBoard, color, castlingRights, lastMove);
  });
}

/**
 * Check if a player has any legal moves
 */
export function hasLegalMoves(board, color, castlingRights, lastMove) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece[0] === color) {
        const moves = getValidMoves(board, row, col, piece, castlingRights, lastMove);
        if (moves.length > 0) return true;
      }
    }
  }
  return false;
}

/**
 * Check for checkmate or stalemate
 * @returns {string|null} 'checkmate', 'stalemate', or null
 */
export function checkGameEnd(board, color, castlingRights, lastMove) {
  if (!hasLegalMoves(board, color, castlingRights, lastMove)) {
    if (isKingInCheck(board, color, castlingRights, lastMove)) {
      return 'checkmate';
    } else {
      return 'stalemate';
    }
  }
  return null;
}

/**
 * Get end game message based on game outcome
 */
export function getEndGameMessage(type, winner) {
  if (type === 'checkmate') {
    if (winner === 'White') {
      return "Some victories feel quieter than others. Not everything needs to be won, but every game teaches us something about patience and timing.";
    } else {
      return "You're learning faster than you think. Every piece you've captured, every tactic you've seen—it's all building something. Keep playing.";
    }
  } else {
    // Stalemate
    return "Some games aren't meant to be finished. Not every story needs a winner—some are beautiful precisely because they remain open, full of possibility.";
  }
}
