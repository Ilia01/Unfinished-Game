/**
 * Game Messages Hook
 * Manages AI-generated message state and API calls
 */

import { useState } from 'react';
import { generateMessage, getFallbackMessage } from '../services/messageService';

export function useGameMessages() {
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMessage = async (piece, from, to, capturedPiece, moveCount) => {
    setLoading(true);

    try {
      const message = await generateMessage(piece, from, to, capturedPiece, moveCount);
      setCurrentMessage(message);
    } catch (error) {
      console.error('Error fetching message:', error);
      setCurrentMessage(getFallbackMessage());
    } finally {
      setLoading(false);
    }
  };

  const setMessage = (message) => {
    setCurrentMessage(message);
  };

  const clearMessage = () => {
    setCurrentMessage('');
  };

  return {
    currentMessage,
    loading,
    fetchMessage,
    setMessage,
    clearMessage
  };
}
