/**
 * Rose Petals Effect
 * Romantic falling rose petals animation
 */

import { useEffect, useState } from 'react';

export function RosePetals({ count = 20 }) {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    // Generate random petals with different properties
    const newPetals = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 10,
      size: 0.6 + Math.random() * 0.8,
      rotation: Math.random() * 360,
      swing: Math.random() * 40 - 20,
      opacity: 0.3 + Math.random() * 0.4
    }));
    setPetals(newPetals);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-fall-petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            '--swing-amount': `${petal.swing}px`,
            opacity: petal.opacity
          }}
        >
          <svg
            width={20 * petal.size}
            height={24 * petal.size}
            viewBox="0 0 20 24"
            className="animate-rotate-petal"
            style={{
              animationDelay: `${petal.delay}s`,
              animationDuration: `${petal.duration * 0.8}s`,
              transform: `rotate(${petal.rotation}deg)`
            }}
          >
            {/* Rose petal shape */}
            <path
              d="M10 0 C 15 2, 20 8, 18 14 C 16 18, 12 20, 10 24 C 8 20, 4 18, 2 14 C 0 8, 5 2, 10 0 Z"
              fill="url(#petal-gradient)"
              opacity="0.9"
            />
            <defs>
              <linearGradient id="petal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b9d" />
                <stop offset="50%" stopColor="#ffa8c5" />
                <stop offset="100%" stopColor="#ff8cb4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
}
