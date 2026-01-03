import React from 'react';
import { Sparkles } from 'lucide-react';
import { useDevToolsStore } from '../../store/devToolsStore';

interface AIStubProps {
  label: string;
  context?: string;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export const AIStub: React.FC<AIStubProps> = ({ 
  label, 
  context = 'unknown', 
  onClick,
  size = 'sm' 
}) => {
  const showAIStubs = useDevToolsStore((state) => state.showAIStubs);

  if (!showAIStubs) return null;

  const handleClick = () => {
    console.log(`[AI Stub] Context: ${context}, Label: ${label}`);
    onClick?.();
  };

  const sizeClasses = size === 'sm' 
    ? 'text-[9px] px-1.5 py-0.5 gap-1'
    : 'text-xs px-2 py-1 gap-1.5';

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center ${sizeClasses}
        bg-teal-500/10 text-teal-400 
        border border-teal-500/20 
        rounded-full 
        hover:bg-teal-500/20 hover:border-teal-500/40
        transition-all duration-200
        font-medium tracking-wide
        group
      `}
      title={`AI Feature: ${label}`}
    >
      <Sparkles size={size === 'sm' ? 10 : 12} className="group-hover:animate-pulse" />
      <span>{label}</span>
    </button>
  );
};
