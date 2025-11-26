export default async function handler(req, res) {
  // CORS headers for frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { piece, from, to, capturedPiece, moveCount } = req.body;

  if (!piece || !from || !to || moveCount === undefined) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const pieceNames = {
      'p': 'pawn',
      'r': 'rook',
      'n': 'knight',
      'b': 'bishop',
      'q': 'queen',
      'k': 'king'
    };

    const pieceName = pieceNames[piece[1]];
    const color = piece[0] === 'w' ? 'white' : 'black';
    const captured = capturedPiece ? `capturing a ${pieceNames[capturedPiece[1]]}` : '';

    const systemPrompt = `You are a poetic narrator of a chess game between two people who share a deep connection. The person playing white is teaching chess to someone special to them - someone thoughtful, patient, and careful about love. Every move is a metaphor for their relationship.

Generate a short, poetic, emotionally resonant message (1-2 sentences max) about this move that subtly connects it to themes of: patience, taking your time, building something meaningful, risk and reward, vulnerability, trust, or the beauty of unfinished stories.

Be subtle, never too heavy-handed. Sometimes be playful, sometimes thoughtful, sometimes wistful. Vary your tone. Make it feel natural and intimate.`;

    const userPrompt = `Move #${moveCount + 1}: ${color} ${pieceName} moves from ${String.fromCharCode(97 + from[1])}${8 - from[0]} to ${String.fromCharCode(97 + to[1])}${8 - to[0]}${captured ? ', ' + captured : ''}.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.9,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API error:', errorData);
      return res.status(response.status).json({
        error: 'Failed to generate message',
        details: errorData
      });
    }

    const data = await response.json();
    const message = data.choices[0].message.content.trim();

    return res.status(200).json({ message });

  } catch (error) {
    console.error('Error generating message:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate message'
    });
  }
}
