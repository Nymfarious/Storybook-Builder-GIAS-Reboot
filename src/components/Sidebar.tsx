import React from 'react';
import { BookOpen, FolderOpen, Save, Undo, Redo, Plus, Image as ImageIcon, Type } from 'lucide-react';
import { PageSize, BlockType } from '../types';
import { PAGE_SIZES, AVAILABLE_FONTS } from '../constants';
import { useStoryStore } from '../store/storyStore';
import { CharacterPicker } from '../features/assets/CharacterStack';

const Sidebar: React.FC = () => {
  // Select state from store
  const { 
    pageSize, 
    setPageSize, 
    pages, 
    activePageIndex, 
    addPage, 
    addBlockToPage 
  } = useStoryStore();

  // Temporal (Time Travel) controls
  const { undo, redo, pastStates, futureStates } = useStoryStore.temporal.getState();
  
  // Use subscription to update button state automatically
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);

  React.useEffect(() => {
    return useStoryStore.temporal.subscribe((state) => {
      setCanUndo(state.pastStates.length > 0);
      setCanRedo(state.futureStates.length > 0);
    });
  }, []);

  const currentPage = pages[activePageIndex];

  const handleAddBlock = (type: BlockType) => {
    if (currentPage) {
      addBlockToPage(currentPage.id, type);
    }
  };

  return (
    <div className="w-full flex flex-col h-full text-gray-200">
      
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Toolkit</h2>
        
        {/* Quick Actions Toolbar */}
        <div className="grid grid-cols-4 gap-1">
          <button 
            onClick={addPage}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white flex justify-center" 
            title="New Page"
          >
            <Plus size={14} />
          </button>
          
          <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white flex justify-center" title="Open Project">
            <FolderOpen size={14} />
          </button>
          
          <button 
            onClick={() => undo()}
            disabled={!canUndo}
            className={`p-2 rounded flex justify-center transition-colors ${canUndo ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
            title="Undo"
          >
            <Undo size={14} />
          </button>
          
          <button 
            onClick={() => redo()}
            disabled={!canRedo}
            className={`p-2 rounded flex justify-center transition-colors ${canRedo ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
            title="Redo"
          >
            <Redo size={14} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        
        {/* Character Rolodex */}
        <section className="border-b border-gray-800 pb-4">
           <CharacterPicker />
        </section>

        {/* Insert Section */}
        <section>
          <h3 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Insert</h3>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => handleAddBlock(BlockType.TEXT)}
              className="flex items-center gap-3 p-2 bg-black/20 hover:bg-white/5 border border-gray-700 hover:border-primary/50 rounded-lg transition-all text-left"
            >
              <div className="p-2 bg-blue-500/10 rounded text-blue-400"><Type size={16} /></div>
              <span className="text-xs font-medium">Text Block</span>
            </button>
            <button 
              onClick={() => handleAddBlock(BlockType.IMAGE)}
              className="flex items-center gap-3 p-2 bg-black/20 hover:bg-white/5 border border-gray-700 hover:border-primary/50 rounded-lg transition-all text-left"
            >
              <div className="p-2 bg-green-500/10 rounded text-green-400"><ImageIcon size={16} /></div>
              <span className="text-xs font-medium">Image Asset</span>
            </button>
          </div>
        </section>

        {/* Page Settings */}
        <section>
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Canvas</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] text-secondary mb-1">Format</label>
              <select 
                value={pageSize} 
                onChange={(e) => setPageSize(e.target.value as PageSize)}
                className="w-full bg-black/30 border border-gray-700 rounded px-2 py-1.5 text-xs focus:border-primary outline-none"
              >
                {Object.entries(PAGE_SIZES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] text-secondary mb-1">Active Page</label>
               <div className="flex items-center justify-between text-xs text-gray-300 bg-black/30 px-2 py-1.5 rounded border border-gray-700">
                  <span>Page {activePageIndex + 1} of {pages.length}</span>
               </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
           <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Fonts</h3>
           <div className="space-y-1">
             {AVAILABLE_FONTS.slice(0, 4).map(font => (
               <div key={font.name} className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-white/5 cursor-pointer group">
                 <span style={{ fontFamily: font.name }} className="text-sm text-gray-300 group-hover:text-white">Aa</span>
                 <span className="text-[10px] text-gray-600 group-hover:text-gray-400">{font.label}</span>
               </div>
             ))}
           </div>
        </section>

      </div>
    </div>
  );
};

export default Sidebar;