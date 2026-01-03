import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
      className="absolute top-0 bottom-0 pointer-events-none z-50 flex flex-col justify-center items-center"
      style={{ left: xPosition, width: 2, transform: 'translateX(-1px)' }}
    >
      {/* The Central Stitch Line */}
      <motion.div 
        initial={{ height: '0%', opacity: 1 }}
        animate={{ height: '100%', opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-[2px] bg-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
      />

      {/* The Burst Effect */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-1/2 -translate-y-1/2 w-4 h-96 bg-yellow-400/20 blur-xl rounded-full"
      />

      {/* Stitch Cross-hatch particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, x: i % 2 === 0 ? -10 : 10, y: (i - 3) * 20 }}
          animate={{ opacity: 0, x: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="absolute w-4 h-0.5 bg-purple-300 top-1/2"
        />
      ))}
    </div>
  );
};