import React, { ReactNode } from 'react';

interface StudioLayoutProps {
  leftPanel: ReactNode;
  centerStage: ReactNode;
  rightPanel: ReactNode;
}

const StudioLayout: React.FC<StudioLayoutProps> = ({ 
  leftPanel, 
  centerStage, 
  rightPanel 
}) => {
  return (
    <div className="h-full w-full grid grid-cols-[250px_minmax(0,1fr)_280px] bg-slate-950">
      {/* Left Panel - Sidebar */}
      <aside className="bg-slate-900 border-r border-slate-800 overflow-hidden flex flex-col">
        {leftPanel}
      </aside>

      {/* Center Stage - Canvas */}
      <main className="relative overflow-hidden bg-slate-900">
        {centerStage}
      </main>

      {/* Right Panel - Properties */}
      <aside className="bg-slate-900 border-l border-slate-800 overflow-hidden flex flex-col">
        {rightPanel}
      </aside>
    </div>
  );
};

export default StudioLayout;
