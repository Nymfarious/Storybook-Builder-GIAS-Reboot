import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIStub } from '../../components/ui/AIStub';
import { TimelineRail } from '../timeline/TimelineRail';
import { ChevronUp, X, GripHorizontal } from 'lucide-react';

interface StoryWorkspaceProps {
  children: ReactNode;
  onNavigateBack: () => void;
  projectTitle?: string;
}

export const StoryWorkspace: React.FC<StoryWorkspaceProps> = ({ 
  children, 
  onNavigateBack,
  projectTitle = "Untitled Project"
}) => {
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden relative">
      {/* 1. Header Row */}
      <header className="flex items-center gap-4 px-4 py-3 border-b border-gray-800 bg-slate-900/50 backdrop-blur-sm z-30 shrink-0 h-14">
        {/* Navigation "Dots" */}
        <button 
          onClick={onNavigateBack} 
          className="text-xl font-bold tracking-widest text-slate-500 hover:text-purple-400 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all cursor-pointer outline-none"
          title="Back to Editors"
        >
          ◦◦◦
        </button>

        <div className="h-4 w-px bg-gray-700 mx-2" />

        {/* Project Context */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-200 tracking-wide">{projectTitle}</span>
          <AIStub label="Generate Scene Layout" context="Workspace.Header" />
        </div>
      </header>

      {/* 2. Main Stage (Flex Grow to fill available space) */}
      <main className="relative w-full flex-1 overflow-hidden">
        {children}
      </main>

      {/* 3. Bottom Rail (Timeline) - Animated Container */}
      {/* 
         We use a fixed height for the collapsed state to ensure it shows just the title/controls.
         When expanded, it takes up 60% of the viewport height.
      */}
      <motion.footer 
        initial={false}
        animate={{ 
          height: isTimelineExpanded ? '60vh' : '10vh',
          boxShadow: isTimelineExpanded ? '0 -10px 40px rgba(0,0,0,0.5)' : '0 -4px 10px rgba(0,0,0,0.2)'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="border-t border-gray-800 bg-slate-900 z-40 relative flex flex-col shrink-0"
      >
        {/* Resize Handle / Title Bar */}
        <div 
          onClick={() => !isTimelineExpanded && setIsTimelineExpanded(true)}
          className={`h-8 w-full flex items-center justify-between px-4 bg-slate-800/50 border-b border-gray-800 cursor-pointer hover:bg-slate-800 transition-colors ${isTimelineExpanded ? 'cursor-default' : ''}`}
        >
          <div className="flex items-center gap-2">
             <GripHorizontal size={14} className="text-gray-500" />
             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Timeline</span>
          </div>

          <div className="flex items-center gap-2">
            {!isTimelineExpanded && (
               <span className="text-[10px] text-gray-500 mr-2 animate-pulse">Click to expand</span>
            )}
            
            {/* Close / Minimize Button - Only visible when expanded */}
            {isTimelineExpanded ? (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTimelineExpanded(false);
                }}
                className="p-1 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded transition-colors"
                title="Minimize Timeline"
              >
                <X size={14} />
              </button>
            ) : (
              <ChevronUp size={14} className="text-gray-500" />
            )}
          </div>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-hidden relative">
          <TimelineRail isExpanded={isTimelineExpanded} />
        </div>
      </motion.footer>
    </div>
  );
};