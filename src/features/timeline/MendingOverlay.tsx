import React, { useEffect } from 'react';

interface MendingOverlayProps {
  xPosition: number;
  onComplete: () => void;
}

export const MendingOverlay: React.FC<MendingOverlayProps> = ({ xPosition, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="absolute top-6 bottom-0 w-1 z-40 pointer-events-none"
      style={{ left: xPosition }}
    >
      {/* The "Stitch" line */}
      <div 
        className="absolute inset-0 w-[2px] animate-pulse"
        style={{
          background: 'linear-gradient(180deg, #a855f7 0%, #fbbf24 50%, #a855f7 100%)',
          boxShadow: '0 0 10px #a855f7, 0 0 20px #fbbf24',
          animation: 'mending-glow 0.8s ease-out forwards'
        }}
      />
      
      {/* Expanding Ring Effect */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-purple-400"
        style={{ animation: 'mending-ring 0.8s ease-out forwards' }}
      />

      <style>{`
        @keyframes mending-glow {
          0% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.1); }
          100% { opacity: 0; transform: scaleY(0); }
        }
        @keyframes mending-ring {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
