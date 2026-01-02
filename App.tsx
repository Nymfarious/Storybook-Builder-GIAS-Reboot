import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import DevTools from './components/DevTools';
import { Page, PageSize, BlockType, Block } from './types';
import { INITIAL_PAGE, MOCK_USER } from './constants';
import { User as UserIcon, ZoomIn, ZoomOut, Monitor } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [currentPage, setCurrentPage] = useState<Page>(INITIAL_PAGE);
  const [pageSize, setPageSize] = useState<PageSize>(PageSize.A4);
  const [scale, setScale] = useState(0.8);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  // Keyboard shortcut for DevTools (Ctrl+D / Cmd+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        // Only allow if user is dev (mocked logic)
        if (MOCK_USER.isDev) {
          setIsDevToolsOpen(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleUpdatePage = (updatedPage: Page) => {
    setCurrentPage(updatedPage);
  };

  const handleAddBlock = (type: BlockType) => {
     // Direct logic reuse for adding block via sidebar
     const newBlock: Block = {
      id: `blk_${Date.now()}`,
      type: type === 'text' ? BlockType.TEXT : BlockType.IMAGE,
      content: type === 'text' ? 'Double-click to edit text...' : 'https://picsum.photos/400/300',
      style: {
        fontFamily: 'Inter',
        fontSize: '16px',
        color: '#333333',
        marginBottom: '1rem'
      }
    };
    setCurrentPage(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden text-slate-100 font-sans">
      
      {/* Left Sidebar */}
      <Sidebar 
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        onAddBlock={(type) => handleAddBlock(type === 'text' ? BlockType.TEXT : BlockType.IMAGE)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Top Navbar (Mini) */}
        <div className="h-14 bg-surface/50 border-b border-gray-700 flex items-center justify-between px-6 backdrop-blur-md z-10">
          <div className="flex items-center space-x-4">
             {/* Breadcrumbs or Project Title could go here */}
             <span className="text-sm text-gray-400 font-medium">My Projects / <span className="text-white">The Lost Fox</span></span>
          </div>

          <div className="flex items-center space-x-3">
             <button onClick={() => setScale(s => Math.max(0.2, s - 0.1))} className="p-2 text-gray-400 hover:text-white"><ZoomOut size={18} /></button>
             <span className="text-xs font-mono text-gray-500 w-12 text-center">{Math.round(scale * 100)}%</span>
             <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-2 text-gray-400 hover:text-white"><ZoomIn size={18} /></button>
             <div className="h-4 w-px bg-gray-700 mx-2"></div>
             <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-700 text-sm transition-colors">
               <Monitor size={14} />
               <span>Preview</span>
             </button>
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-700 flex items-center justify-center text-xs font-bold border border-white/10 shadow-lg ml-2">
               TS
             </div>
          </div>
        </div>

        {/* Canvas Area */}
        <Canvas 
          page={currentPage}
          pageSize={pageSize}
          onUpdatePage={handleUpdatePage}
          scale={scale}
        />
        
        {/* DevTools Hint (Only visible if dev) */}
        {MOCK_USER.isDev && !isDevToolsOpen && (
          <div className="absolute bottom-2 right-2 text-[10px] text-gray-600 font-mono pointer-events-none select-none">
            Ctrl+D for DevTools
          </div>
        )}

      </div>

      {/* DevTools Overlay */}
      <DevTools isOpen={isDevToolsOpen} onClose={() => setIsDevToolsOpen(false)} />
    </div>
  );
};

export default App;