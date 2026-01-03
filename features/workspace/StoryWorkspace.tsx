import React, { ReactNode } from 'react';
import { AIStub } from '../../components/ui/AIStub';
import { TimelineRail } from '../timeline/TimelineRail';

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
  return (
    <div className="grid grid-rows-[auto_1fr_320px] h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* 1. Header Row */}
      <header className="flex items-center gap-4 px-4 py-3 border-b border-gray-800 bg-slate-900/50 backdrop-blur-sm z-30">
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

        {/* Right side controls spacer */}
        <div className="ml-auto">
          {/* User/Settings could go here */}
        </div>
      </header>

      {/* 2. Main Stage (1fr) */}
      <main className="relative overflow-hidden w-full h-full">
        {children}
      </main>

      {/* 3. Bottom Rail (Timeline) */}
      <footer className="border-t border-gray-800 bg-slate-900 z-10 relative shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <TimelineRail />
      </footer>
    </div>
  );
};