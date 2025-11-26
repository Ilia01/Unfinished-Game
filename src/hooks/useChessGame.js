/**
 * Chess Game Hook
 * Main game state and logic
 */

import { useState, useCallback } from 'react';
import { initialBoard, initialCastlingRights, cloneBoard } from '../utils/boardHelpers';
import { useChessLogic } from './useChessLogic';
import { moveToNotation, getMoveDescription } from '../utils/chessNotation';

export function useChessGame() {
  // Game state
  const [board, setBoard] = useState(initialBoard);
  const [gameState, setGameState] = useState('setup'); // 'setup', 'intro', 'playing'
  const [turn, setTurn] = useState('w');
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [castlingRights, setCastlingRights] = useState(initialCastlingRights);
  const [lastMove, setLastMove] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [gameEnd, setGameEnd] = useState(null); // null, 'checkmate', 'stalemate'

  // Promotion state
  const [promotionSquare, setPromotionSquare] = useState(null);
  const [pendingMove, setPendingMove] = useState(null);

  // Chess logic
  const logic = useChessLogic(board, castlingRights, lastMove);

  // Start game
  const startGame = useCallback(() => {
    setGameState('intro');
  }, []);

  // Handle square click
  const handleSquareClick = useCallback((row, col) => {
    if (gameState === 'setup' || gameEnd) return;

    if (gameState === 'intro') {
      setGameState('playing');
      return;
    }

    const piece = board[row][col];

    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = board[selectedRow][selectedCol];

      const isValidMove = validMoves.some(([r, c]) => r === row && c === col);

      if (isValidMove) {
        const capturedPiece = board[row][col];

        // Check if pawn promotion
        if (selectedPiece[1] === 'p' && (row === 0 || row === 7)) {
          setPendingMove({ from: [selectedRow, selectedCol], to: [row, col], capturedPiece });
          setPromotionSquare([row, col]);
          return;
        }

        // Make the move
        makeMove(selectedRow, selectedCol, row, col, selectedPiece, capturedPiece);
      } else if (piece && piece[0] === turn) {
        // Select different piece
        setSelectedSquare([row, col]);
        setValidMoves(logic.getValidMoves(row, col, piece));
      } else {
        // Deselect
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (piece && piece[0] === turn) {
      // Select piece
      setSelectedSquare([row, col]);
      setValidMoves(logic.getValidMoves(row, col, piece));
    }
  }, [board, gameState, gameEnd, selectedSquare, validMoves, turn, logic]);

  // Make a move
  const makeMove = useCallback((fromRow, fromCol, toRow, toCol, piece, capturedPiece) => {
    const newBoard = cloneBoard(board);
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = '';

    // Handle en passant capture
    if (piece[1] === 'p' && toCol !== fromCol && !capturedPiece) {
      newBoard[fromRow][toCol] = '';
    }

    // Handle castling
    if (piece[1] === 'k' && Math.abs(toCol - fromCol) === 2) {
      // Kingside castling
      if (toCol === 6) {
        newBoard[toRow][5] = newBoard[toRow][7];
        newBoard[toRow][7] = '';
      }
      // Queenside castling
      else if (toCol === 2) {
        newBoard[toRow][3] = newBoard[toRow][0];
        newBoard[toRow][0] = '';
      }
    }

    // Update castling rights
    const newCastlingRights = { ...castlingRights };
    if (piece[1] === 'k') {
      newCastlingRights[piece[0]] = { kingSide: false, queenSide: false };
    }
    if (piece[1] === 'r') {
      const homeRow = piece[0] === 'w' ? 7 : 0;
      if (fromRow === homeRow) {
        if (fromCol === 0) newCastlingRights[piece[0]].queenSide = false;
        if (fromCol === 7) newCastlingRights[piece[0]].kingSide = false;
      }
    }

    // Check if this move results in check
    const nextTurn = turn === 'w' ? 'b' : 'w';
    const isCheck = logic.isKingInCheck(nextTurn);

    // Create move notation
    const notation = moveToNotation(
      [fromRow, fromCol],
      [toRow, toCol],
      piece,
      !!capturedPiece,
      isCheck,
      false, // checkmate will be determined later
      null   // promotion handled separately
    );

    const description = getMoveDescription(piece, [fromRow, fromCol], [toRow, toCol], !!capturedPiece);

    const moveData = {
      from: [fromRow, fromCol],
      to: [toRow, toCol],
      piece,
      capturedPiece,
      notation,
      description,
      moveNumber: Math.floor(moveCount / 2) + 1,
      isWhite: piece[0] === 'w'
    };

    setBoard(newBoard);
    setMoveHistory([...moveHistory, moveData]);
    setLastMove(moveData);
    setMoveCount(moveCount + 1);
    setCastlingRights(newCastlingRights);
    setTurn(nextTurn);
    setSelectedSquare(null);
    setValidMoves([]);

    return moveData;
  }, [board, castlingRights, moveHistory, moveCount, turn, logic]);

  // Handle promotion
  const handlePromotion = useCallback((pieceType) => {
    if (!pendingMove || !promotionSquare) return;

    const { from, to, capturedPiece } = pendingMove;
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;

    const newBoard = cloneBoard(board);
    const promotedPiece = board[fromRow][fromCol][0] + pieceType;
    newBoard[toRow][toCol] = promotedPiece;
    newBoard[fromRow][fromCol] = '';

    const nextTurn = turn === 'w' ? 'b' : 'w';
    const isCheck = logic.isKingInCheck(nextTurn);

    const notation = moveToNotation(from, to, promotedPiece, !!capturedPiece, isCheck, false, pieceType);
    const description = getMoveDescription(promotedPiece, from, to, !!capturedPiece);

    const moveData = {
      from,
      to,
      piece: promotedPiece,
      capturedPiece,
      promotion: true,
      notation,
      description,
      moveNumber: Math.floor(moveCount / 2) + 1,
      isWhite: promotedPiece[0] === 'w'
    };

    setBoard(newBoard);
    setMoveHistory([...moveHistory, moveData]);
    setLastMove(moveData);
    setMoveCount(moveCount + 1);

    setTurn(nextTurn);
    setSelectedSquare(null);
    setValidMoves([]);
    setPromotionSquare(null);
    setPendingMove(null);

    return moveData;
  }, [board, pendingMove, promotionSquare, moveHistory, moveCount, turn, logic]);

  // Check for game end
  const checkForGameEnd = useCallback((color) => {
    const result = logic.checkGameEnd(color);
    if (result) {
      setGameEnd(result);
      const winner = result === 'checkmate' ? (color === 'w' ? 'Black' : 'White') : null;
      return { result, winner };
    }
    return null;
  }, [logic]);

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(initialBoard);
    setGameState('intro');
    setTurn('w');
    setSelectedSquare(null);
    setValidMoves([]);
    setCastlingRights(initialCastlingRights);
    setLastMove(null);
    setMoveHistory([]);
    setMoveCount(0);
    setGameEnd(null);
    setPromotionSquare(null);
    setPendingMove(null);
  }, []);

  // Check if square has valid move
  const isValidMoveSquare = useCallback((row, col) => {
    return validMoves.some(([r, c]) => r === row && c === col);
  }, [validMoves]);

  return {
    // State
    board,
    gameState,
    turn,
    selectedSquare,
    validMoves,
    moveCount,
    moveHistory,
    gameEnd,
    promotionSquare,
    pendingMove,

    // Chess logic
    logic,

    // Actions
    startGame,
    handleSquareClick,
    makeMove,
    handlePromotion,
    checkForGameEnd,
    resetGame,
    isValidMoveSquare
  };
}
