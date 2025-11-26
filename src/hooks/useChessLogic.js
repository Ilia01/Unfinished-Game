/**
 * Chess Logic Hook
 * Wrapper around pure chess logic functions
 */

import { useMemo } from 'react';
import {
  getValidMoves,
  getValidMovesRaw,
  isKingInCheck,
  hasLegalMoves,
  checkGameEnd,
  findKing,
  isSquareUnderAttack,
  getEndGameMessage
} from '../utils/chessLogic';

export function useChessLogic(board, castlingRights, lastMove) {
  // Memoize functions with current board state
  const logic = useMemo(() => ({
    getValidMoves: (row, col, piece) =>
      getValidMoves(board, row, col, piece, castlingRights, lastMove),

    getValidMovesRaw: (row, col, piece) =>
      getValidMovesRaw(board, row, col, piece, castlingRights, lastMove),

    isKingInCheck: (color) =>
      isKingInCheck(board, color, castlingRights, lastMove),

    hasLegalMoves: (color) =>
      hasLegalMoves(board, color, castlingRights, lastMove),

    checkGameEnd: (color) =>
      checkGameEnd(board, color, castlingRights, lastMove),

    findKing: (color) =>
      findKing(board, color),

    isSquareUnderAttack: (row, col, byColor) =>
      isSquareUnderAttack(board, row, col, byColor, castlingRights, lastMove),

    getEndGameMessage: (type, winner) =>
      getEndGameMessage(type, winner)

  }), [board, castlingRights, lastMove]);

  return logic;
}
