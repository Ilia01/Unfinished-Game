/**
 * Board Size Hook
 * Calculates responsive board and square sizes for mobile-first design
 */

import { useState, useEffect } from 'react';

export function useBoardSize() {
  const [squareSize, setSquareSize] = useState(48);
  const [boardPadding, setBoardPadding] = useState(16);

  useEffect(() => {
    const calculateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Mobile-first sizing (375px - 428px target)
      if (width < 640) {
        // Small mobile (e.g., iPhone SE: 375px)
        if (width < 380) {
          setSquareSize(40);  // 40 * 8 = 320px board + padding
          setBoardPadding(12);
        }
        // Standard mobile (e.g., iPhone 12-15: 390px-430px)
        else {
          setSquareSize(48);  // 48 * 8 = 384px board + padding
          setBoardPadding(16);
        }
      }
      // Tablet
      else if (width < 1024) {
        setSquareSize(56);  // 56 * 8 = 448px
        setBoardPadding(16);
      }
      // Desktop
      else {
        setSquareSize(64);  // 64 * 8 = 512px
        setBoardPadding(16);
      }
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, []);

  return {
    squareSize,
    boardPadding,
    boardSize: squareSize * 8
  };
}
