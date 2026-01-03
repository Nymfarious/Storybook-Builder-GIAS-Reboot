import React from 'react';
import { Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useDevToolsStore } from '../../store/devToolsStore';
import { motion, AnimatePresence } from 'framer-motion';

// Utility for cleaner tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AIStubProps {
  label: string;
  context: string;
  className?: string;
  onClick?: () => void;
}

/**
 * AIStub ("Teal Stub")
 * A visual placeholder indicating where an AI opportunity exists.
 * Controlled globally by DevTools.
 */
export const AIStub: React.FC<AIStubProps> = ({ label, context, className, onClick }) => {
  const showAIStubs = useDevToolsStore((state) => state.showAIStubs);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`[AI Stub] Context: ${context}`);
    if (onClick) onClick();
  };

  return (
    <AnimatePresence>
      {showAIStubs && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={handleClick}
          className={cn(
            "group relative inline-flex items-center gap-1.5 px-2 py-1",
            "rounded-full text-[10px] font-medium transition-all duration-200",
            // Teal Scheme
            "bg-teal-500/10 text-teal-400 border border-teal-500/20",
            "hover:bg-teal-500/20 hover:border-teal-500/40 hover:shadow-[0_0_10px_rgba(20,184,166,0.2)]",
            className
          )}
          title={`AI Opportunity: ${context}`}
        >
          <Sparkles size={12} className="animate-pulse" />
          <span>{label}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};