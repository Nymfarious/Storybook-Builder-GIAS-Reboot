import React, { useState, useEffect } from 'react';
import StudioLayout from './components/StudioLayout';
import Sidebar from './components/Sidebar';
import StoryStage from './components/StoryStage';
import DevTools from './components/DevTools';
import DevToolsMini from './components/DevToolsMini';
import { AIStub } from './components/ui/AIStub';
import { MOCK_USER, MOCK_PROJECT } from './constants';
import { Sliders, LayoutDashboard } from 'lucide-react';
import { useStoryStore } from './store/storyStore';
import { StoryWorkspace } from './features/workspace/StoryWorkspace';

type ViewState = 'dashboard' | 'workspace';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('workspace');
  const [scale, setScale] = useState(0.6);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  
  const { pages, activePageIndex, selectedBlockId } = useStoryStore();
  const currentPage = pages[activePageIndex];

  // Keyboard shortcut for DevTools (Ctrl+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (MOCK_USER.isDev) {
          setIsDevToolsOpen(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Dashboard View ---
  const renderDashboard = () => (
    <div className="h-screen w-screen bg-slate-900 flex items-center justify-center flex-col gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-display text-primary tracking-wide">MeKu Studio</h1>
        <p className="text-slate-500">Select a project to begin</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
        <button 
          onClick={() => setCurrentView('workspace')}
          className="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-primary hover:bg-slate-800/80 transition-all group text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white group-hover:text-primary transition-colors">{MOCK_PROJECT.title}</span>
            <LayoutDashboard size={18} className="text-slate-600 group-hover:text-primary" />
          </div>
          <p className="text-sm text-slate-400">{MOCK_PROJECT.description}</p>
        </button>
        
        <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-center border-dashed">
          <span className="text-slate-600 text-sm">Create New Project</span>
        </div>
      </div>
    </div>
  );

  // --- Workspace View ---
  const renderWorkspace = () => {
    const leftPanel = <Sidebar />;

    const centerStage = (
      <StoryStage 
        scale={scale}
        setScale={setScale}
      />
    );

    const rightPanel = (
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-400 uppercase text-xs font-bold tracking-wider">
            <Sliders size={14} />
            <span>Properties</span>
          </div>
          <AIStub label="Auto-Layout" context="RightPanel.Header" />
        </div>
        
        {selectedBlockId ? (
          <div className="flex-1 space-y-4">
            <div className="bg-black/30 p-3 rounded border border-gray-700 relative">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white text-sm font-bold">Selected Block</h3>
                <AIStub label="Enhance" context="Properties.BlockSelected" />
              </div>
              <p className="text-xs text-primary font-mono mb-1">ID: {selectedBlockId.slice(0, 8)}...</p>
              <p className="text-[10px] text-gray-500">
                Rotation: {currentPage?.blocks.find(b => b.id === selectedBlockId)?.rotation?.toFixed(0) || 0}°
              </p>
              <p className="text-[10px] text-gray-500">
                Z-Index: {currentPage?.blocks.find(b => b.id === selectedBlockId)?.zIndex || 1}
              </p>
              <div className="text-xs text-gray-400 italic mt-2">Drag to move • Use handle to rotate</div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600 text-center space-y-2 opacity-50 border-2 border-dashed border-gray-800 rounded-lg m-2">
            <span className="text-sm">Select an element</span>
            <span className="text-xs">Properties will appear here</span>
          </div>
        )}

        <div className="mt-auto bg-gray-900/50 p-3 rounded border border-gray-800">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-xs font-bold text-gray-400">Story Stats</h4>
            <AIStub label="Analyze" context="StoryStats.Footer" />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Total Pages</span>
            <span>{pages.length}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Blocks (Current)</span>
            <span>{currentPage?.blocks.length || 0}</span>
          </div>
        </div>
      </div>
    );

    return (
      <StoryWorkspace 
        onNavigateBack={() => setCurrentView('dashboard')}
        projectTitle={MOCK_PROJECT.title}
      >
        <StudioLayout 
          leftPanel={leftPanel}
          centerStage={centerStage}
          rightPanel={rightPanel}
        />
      </StoryWorkspace>
    );
  };

  return (
    <>
      {currentView === 'dashboard' ? renderDashboard() : renderWorkspace()}
      
      {/* Global DevTools */}
      <DevTools isOpen={isDevToolsOpen} onClose={() => setIsDevToolsOpen(false)} />
      <DevToolsMini />
    </>
  );
};

export default App;
