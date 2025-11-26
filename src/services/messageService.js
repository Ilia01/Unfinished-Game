/**
 * Message Service for AI-generated chess move messages
 * Handles API calls to the serverless function
 */

/**
 * Generate a poetic message for a chess move
 * @param {string} piece - Piece that moved
 * @param {Array} from - Starting position [row, col]
 * @param {Array} to - Ending position [row, col]
 * @param {string} capturedPiece - Piece that was captured (if any)
 * @param {number} moveCount - Current move number
 * @returns {Promise<string>} Generated message
 */
export async function generateMessage(piece, from, to, capturedPiece, moveCount) {
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
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.message;

  } catch (error) {
    console.error('Error generating message:', error);
    // Return fallback message
    return 'Every move tells a story...';
  }
}

/**
 * Get a fallback message (used when API fails)
 */
export function getFallbackMessage() {
  const fallbacks = [
    'Every move tells a story...',
    'The game continues, one piece at a time.',
    'Another step in our unfinished game.',
    'Each choice shapes what comes next.',
    'The board remembers every decision.'
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
