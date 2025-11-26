import React, { useState, useEffect } from 'react';
import { Heart, RotateCcw, Sparkles } from 'lucide-react';

const ChessBoard = () => {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [gameState, setGameState] = useState('setup');
  const [currentMessage, setCurrentMessage] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [turn, setTurn] = useState('w');
  const [moveHistory, setMoveHistory] = useState([]);
  const [validMoves, setValidMoves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [promotionSquare, setPromotionSquare] = useState(null);
  const [pendingMove, setPendingMove] = useState(null);
  const [castlingRights, setCastlingRights] = useState({
    w: { kingSide: true, queenSide: true },
    b: { kingSide: true, queenSide: true }
  });
  const [lastMove, setLastMove] = useState(null);
  const [gameEnd, setGameEnd] = useState(null); // null, 'checkmate', 'stalemate'

  // Piece components
  const ChessPiece = ({ type, color }) => {
    const pieces = {
      pawn: (
        <svg viewBox="0 0 45 45" className="w-8 h-8 sm:w-10 sm:h-10">
          <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill={color} stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      rook: (
        <svg viewBox="0 0 45 45" className="w-8 h-8 sm:w-10 sm:h-10">
          <path d="M9 39h27v-3H9v3zm3-3v-4h21v4H12zm0-5V16h21v15H12zm1.5-13.5h18v-2h-18v2zm0-3h18V12h-18v2.5zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" fill={color} stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      knight: (
        <svg viewBox="0 0 45 45" className="w-8 h-8 sm:w-10 sm:h-10">
          <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill={color} stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill={color} stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bishop: (
        <svg viewBox="0 0 45 45" className="w-8 h-8 sm:w-10 sm:h-10">
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2zm6-4c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" fill={color} stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      queen: (
        <svg viewBox="0 0 45 45" className="w-8 h-8 sm:w-10 sm:h-10">
          <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" fill={color} stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" fill={color} stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill={color} stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      king: (
        <svg viewBox="0 0 45 45" className="w-8 h-8 sm:w-10 sm:h-10">
          <path d="M22.5 11.63V6M20 8h5" fill="none" stroke="#000" strokeWidth="1.5" strokeLinejoin="miter" strokeLinecap="round"/>
          <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill={color} stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill={color} stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return pieces[type] || null;
  };

  const initialBoard = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
  ];

  const [board, setBoard] = useState(initialBoard);

  // Helper function to check if a square is under attack
  const isSquareUnderAttack = (targetRow, targetCol, byColor, testBoard = board) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = testBoard[row][col];
        if (piece && piece[0] === byColor) {
          const moves = getValidMovesRaw(row, col, piece, testBoard);
          if (moves.some(([r, c]) => r === targetRow && c === targetCol)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Find king position
  const findKing = (color, testBoard = board) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (testBoard[row][col] === color + 'k') {
          return [row, col];
        }
      }
    }
    return null;
  };

  // Check if king is in check
  const isKingInCheck = (color, testBoard = board) => {
    const kingPos = findKing(color, testBoard);
    if (!kingPos) return false;
    const [kingRow, kingCol] = kingPos;
    const enemyColor = color === 'w' ? 'b' : 'w';
    return isSquareUnderAttack(kingRow, kingCol, enemyColor, testBoard);
  };

  useEffect(() => {
    if (currentMessage) {
      setFadeIn(false);
      setTimeout(() => setFadeIn(true), 50);
    }
  }, [currentMessage]);

  const generateMoveMessage = async (piece, from, to, capturedPiece) => {
    setLoading(true);

    try {
      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          piece,
          from,
          to,
          capturedPiece,
          moveCount
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setCurrentMessage(data.message);

    } catch (error) {
      console.error('Error generating message:', error);
      setCurrentMessage('Every move tells a story...');
    } finally {
      setLoading(false);
    }
  };

  // Get raw valid moves without checking for checks
  const getValidMovesRaw = (row, col, piece, testBoard = board) => {
    if (!piece) return [];

    const moves = [];
    const color = piece[0];
    const type = piece[1];
    
    if (type === 'p') {
      const direction = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;
      const enPassantRow = color === 'w' ? 3 : 4;

      if (!testBoard[row + direction]?.[col]) {
        moves.push([row + direction, col]);
        if (row === startRow && !testBoard[row + 2 * direction]?.[col]) {
          moves.push([row + 2 * direction, col]);
        }
      }

      if (testBoard[row + direction]?.[col - 1] && testBoard[row + direction][col - 1][0] !== color) {
        moves.push([row + direction, col - 1]);
      }
      if (testBoard[row + direction]?.[col + 1] && testBoard[row + direction][col + 1][0] !== color) {
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
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      
      knightMoves.forEach(([dr, dc]) => {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          if (!testBoard[newRow][newCol] || testBoard[newRow][newCol][0] !== color) {
            moves.push([newRow, newCol]);
          }
        }
      });
    } else if (type === 'b') {
      const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      directions.forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
          const newRow = row + dr * i;
          const newCol = col + dc * i;
          if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
          if (!testBoard[newRow][newCol]) {
            moves.push([newRow, newCol]);
          } else {
            if (testBoard[newRow][newCol][0] !== color) {
              moves.push([newRow, newCol]);
            }
            break;
          }
        }
      });
    } else if (type === 'r') {
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      directions.forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
          const newRow = row + dr * i;
          const newCol = col + dc * i;
          if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
          if (!testBoard[newRow][newCol]) {
            moves.push([newRow, newCol]);
          } else {
            if (testBoard[newRow][newCol][0] !== color) {
              moves.push([newRow, newCol]);
            }
            break;
          }
        }
      });
    } else if (type === 'q') {
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
      directions.forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
          const newRow = row + dr * i;
          const newCol = col + dc * i;
          if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
          if (!testBoard[newRow][newCol]) {
            moves.push([newRow, newCol]);
          } else {
            if (testBoard[newRow][newCol][0] !== color) {
              moves.push([newRow, newCol]);
            }
            break;
          }
        }
      });
    } else if (type === 'k') {
      const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
      directions.forEach(([dr, dc]) => {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          if (!testBoard[newRow][newCol] || testBoard[newRow][newCol][0] !== color) {
            moves.push([newRow, newCol]);
          }
        }
      });

      // Castling (only add if not in test mode or if explicitly checking on real board)
      if (testBoard === board) {
        const rights = castlingRights[color];
        const homeRow = color === 'w' ? 7 : 0;

        // Kingside castling
        if (rights.kingSide && row === homeRow && col === 4) {
          if (!testBoard[homeRow][5] && !testBoard[homeRow][6] && testBoard[homeRow][7] === color + 'r') {
            moves.push([homeRow, 6]);
          }
        }

        // Queenside castling
        if (rights.queenSide && row === homeRow && col === 4) {
          if (!testBoard[homeRow][3] && !testBoard[homeRow][2] && !testBoard[homeRow][1] && testBoard[homeRow][0] === color + 'r') {
            moves.push([homeRow, 2]);
          }
        }
      }
    }

    return moves;
  };

  // Get valid moves that don't leave king in check
  const getValidMoves = (row, col, piece) => {
    if (!piece) return [];

    const rawMoves = getValidMovesRaw(row, col, piece, board);
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

      return !isKingInCheck(color, testBoard);
    });
  };

  // Check if a player has any legal moves
  const hasLegalMoves = (color) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece[0] === color) {
          const moves = getValidMoves(row, col, piece);
          if (moves.length > 0) return true;
        }
      }
    }
    return false;
  };

  // Check for checkmate or stalemate
  const checkGameEnd = (color) => {
    if (!hasLegalMoves(color)) {
      if (isKingInCheck(color)) {
        setGameEnd('checkmate');
        const winner = color === 'w' ? 'Black' : 'White';
        const message = getEndGameMessage('checkmate', winner);
        setCurrentMessage(message);
        return 'checkmate';
      } else {
        setGameEnd('stalemate');
        const message = getEndGameMessage('stalemate');
        setCurrentMessage(message);
        return 'stalemate';
      }
    }
    return null;
  };

  // Get end game message
  const getEndGameMessage = (type, winner) => {
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
  };

  const handleSquareClick = (row, col) => {
    if (gameState === 'setup' || gameEnd) return;

    if (gameState === 'intro') {
      setGameState('playing');
      setCurrentMessage("Your move. Every piece you touch, every square you choose—each one adds to our story.");
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

        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = selectedPiece;
        newBoard[selectedRow][selectedCol] = '';

        // Handle en passant capture
        if (selectedPiece[1] === 'p' && col !== selectedCol && !capturedPiece) {
          // This is an en passant capture
          newBoard[selectedRow][col] = '';
        }

        // Handle castling
        if (selectedPiece[1] === 'k' && Math.abs(col - selectedCol) === 2) {
          // Kingside castling
          if (col === 6) {
            newBoard[row][5] = newBoard[row][7];
            newBoard[row][7] = '';
          }
          // Queenside castling
          else if (col === 2) {
            newBoard[row][3] = newBoard[row][0];
            newBoard[row][0] = '';
          }
        }

        // Update castling rights
        const newCastlingRights = { ...castlingRights };
        if (selectedPiece[1] === 'k') {
          newCastlingRights[selectedPiece[0]] = { kingSide: false, queenSide: false };
        }
        if (selectedPiece[1] === 'r') {
          const homeRow = selectedPiece[0] === 'w' ? 7 : 0;
          if (selectedRow === homeRow) {
            if (selectedCol === 0) newCastlingRights[selectedPiece[0]].queenSide = false;
            if (selectedCol === 7) newCastlingRights[selectedPiece[0]].kingSide = false;
          }
        }
        setCastlingRights(newCastlingRights);

        setBoard(newBoard);
        const moveData = { from: [selectedRow, selectedCol], to: [row, col], piece: selectedPiece };
        setMoveHistory([...moveHistory, moveData]);
        setLastMove(moveData);
        setMoveCount(moveCount + 1);

        generateMoveMessage(selectedPiece, [selectedRow, selectedCol], [row, col], capturedPiece);

        const nextTurn = turn === 'w' ? 'b' : 'w';
        setTurn(nextTurn);
        setSelectedSquare(null);
        setValidMoves([]);

        // Check for game end on next turn
        setTimeout(() => checkGameEnd(nextTurn), 100);
      } else if (piece && piece[0] === turn) {
        setSelectedSquare([row, col]);
        setValidMoves(getValidMoves(row, col, piece));
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (piece && piece[0] === turn) {
      setSelectedSquare([row, col]);
      setValidMoves(getValidMoves(row, col, piece));
    }
  };

  const handlePromotion = (pieceType) => {
    if (!pendingMove || !promotionSquare) return;

    const { from, to, capturedPiece } = pendingMove;
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;

    const newBoard = board.map(r => [...r]);
    const promotedPiece = board[fromRow][fromCol][0] + pieceType;
    newBoard[toRow][toCol] = promotedPiece;
    newBoard[fromRow][fromCol] = '';

    setBoard(newBoard);
    const moveData = { from, to, piece: promotedPiece, promotion: true };
    setMoveHistory([...moveHistory, moveData]);
    setLastMove(moveData);
    setMoveCount(moveCount + 1);

    generateMoveMessage(promotedPiece, from, to, capturedPiece);

    const nextTurn = turn === 'w' ? 'b' : 'w';
    setTurn(nextTurn);
    setSelectedSquare(null);
    setValidMoves([]);
    setPromotionSquare(null);
    setPendingMove(null);

    // Check for game end on next turn
    setTimeout(() => checkGameEnd(nextTurn), 100);
  };

  const startGame = () => {
    setGameState('intro');
  };

  const resetBoard = () => {
    setBoard(initialBoard);
    setGameState('intro');
    setCurrentMessage('');
    setSelectedSquare(null);
    setValidMoves([]);
    setTurn('w');
    setMoveHistory([]);
    setMoveCount(0);
    setCastlingRights({
      w: { kingSide: true, queenSide: true },
      b: { kingSide: true, queenSide: true }
    });
    setPromotionSquare(null);
    setPendingMove(null);
    setLastMove(null);
    setGameEnd(null);
  };

  const isValidMoveSquare = (row, col) => {
    return validMoves.some(([r, c]) => r === row && c === col);
  };

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

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/50 backdrop-blur rounded-lg p-8 border border-slate-700">
          <div className="text-center mb-6">
            <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h1 className="text-3xl font-light text-slate-100 mb-2">
              <span className="text-amber-400">The Unfinished Game</span>
            </h1>
            <p className="text-slate-400 text-sm">
              Every move will generate a unique poetic message powered by AI
            </p>
          </div>

          <button
            onClick={startGame}
            className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            Begin the Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {gameState === 'intro' && (
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl font-light text-slate-100 mb-2">
               <span className="text-amber-400">The Unfinished Game</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Every chess game is a conversation. Every move, a choice between countless possibilities.
              This is a game we're playing together—learning, teaching, and discovering new patterns with each turn.
            </p>
            <p className="text-slate-500 text-sm">Click the board to begin</p>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-slate-100 mb-2">Our Story Unfolds</h2>
            <p className="text-slate-400 text-sm">
              {turn === 'w' ? "White's turn" : "Black's turn"} • Move {moveCount}
            </p>
          </div>
        )}

        <div className="flex flex-col items-center gap-8">
          <div className="inline-block bg-slate-800 p-4 rounded-lg shadow-2xl">
            <div className="grid grid-cols-8 gap-0 border-2 border-slate-700">
              {board.map((row, rowIndex) => (
                row.map((piece, colIndex) => {
                  const isLight = (rowIndex + colIndex) % 2 === 0;
                  const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex;
                  const isValidMove = isValidMoveSquare(rowIndex, colIndex);
                  const isKingInCheckHere = piece && piece[1] === 'k' && isKingInCheck(piece[0]);

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                      className={`
                        w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center cursor-pointer
                        transition-all duration-200 relative
                        ${isLight ? 'bg-slate-300' : 'bg-slate-600'}
                        ${isSelected ? 'ring-4 ring-blue-400 ring-inset' : ''}
                        ${isValidMove ? 'ring-4 ring-green-400 ring-inset' : ''}
                        ${isKingInCheckHere ? 'ring-4 ring-red-500 ring-inset animate-pulse' : ''}
                        hover:brightness-110
                      `}
                    >
                      {getPieceComponent(piece)}
                      {isValidMove && !piece && (
                        <div className="absolute w-3 h-3 bg-green-400 rounded-full opacity-50"></div>
                      )}
                    </div>
                  );
                })
              ))}
            </div>
          </div>

          {currentMessage && (
            <div className={`max-w-2xl mx-auto transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
              <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-slate-700">
                {loading ? (
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-150"></div>
                  </div>
                ) : (
                  <p className="text-slate-200 text-lg leading-relaxed text-center italic">
                    "{currentMessage}"
                  </p>
                )}
              </div>
            </div>
          )}

          {gameState === 'playing' && (
            <button
              onClick={resetBoard}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </button>
          )}
        </div>

        {promotionSquare && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 max-w-md">
              <h3 className="text-xl font-light text-slate-100 mb-4 text-center">Choose Promotion</h3>
              <p className="text-slate-400 text-sm mb-6 text-center">
                Your pawn has reached the end. Choose a piece to promote to:
              </p>
              <div className="grid grid-cols-4 gap-4">
                {['q', 'r', 'b', 'n'].map((pieceType) => {
                  const color = turn === 'w' ? '#f8fafc' : '#1e293b';
                  const names = { q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight' };
                  const types = { q: 'queen', r: 'rook', b: 'bishop', n: 'knight' };
                  return (
                    <button
                      key={pieceType}
                      onClick={() => handlePromotion(pieceType)}
                      className="flex flex-col items-center gap-2 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <ChessPiece type={types[pieceType]} color={color} />
                      <span className="text-slate-300 text-xs">{names[pieceType]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChessBoard;