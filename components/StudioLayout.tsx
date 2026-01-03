import React, { ReactNode } from 'react';

interface StudioLayoutProps {
  leftPanel: ReactNode;
  centerStage: ReactNode;
  rightPanel: ReactNode;
}

const StudioLayout: React.FC<StudioLayoutProps> = ({ leftPanel, centerStage, rightPanel }) => {
  return (
    <div className="h-full w-full bg-background text-slate-100 overflow-hidden flex flex-col">
      {/* 
          Main Grid Area 
          Using minmax(0, 1fr) for center stage to prevent layout blowout
      */}
      <div className="flex-1 overflow-hidden grid grid-cols-[250px_minmax(0,1fr)_300px] h-full">
        
        {/* Left Sidebar */}
        <aside className="border-r border-gray-800 bg-surface/50 overflow-y-auto">
          {leftPanel}
        </aside>

        {/* Center Stage */}
        <main className="relative bg-[#0c0c0e] overflow-hidden flex flex-col">
          {centerStage}
        </main>

        {/* Right Sidebar (Properties) */}
        <aside className="border-l border-gray-800 bg-surface/50 overflow-y-auto">
          {rightPanel}
        </aside>

      </div>
    </div>
  );
};

export default StudioLayout;