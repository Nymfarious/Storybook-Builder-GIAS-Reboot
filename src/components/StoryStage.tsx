import React from 'react';
import { Page, BlockType } from '../types';
import { PAGE_SIZES } from '../constants';
import { Trash2, Type, Image as ImageIcon } from 'lucide-react';
import ZoomControls from './ZoomControls';
import { useStoryStore } from '../store/storyStore';

interface StoryStageProps {
  scale: number;
  setScale: (s: number) => void;
}

const StoryStage: React.FC<StoryStageProps> = ({ scale, setScale }) => {
  // Store
  const { 
    pages, 
    activePageIndex, 
    pageSize, 
    selectedBlockId,
    addBlockToPage, 
    deleteBlock,
    selectBlock,
    updateBlockContent
  } = useStoryStore();

  const page = pages[activePageIndex];
  const size = PAGE_SIZES[pageSize];
  
  if (!page) return <div className="text-white">No active page</div>;

  const handleBlockClick = (e: React.MouseEvent, blockId: string) => {
    e.stopPropagation();
    selectBlock(blockId);
  };

  const handleStageClick = () => {
    selectBlock(null);
  };

  // --- Drag and Drop Handlers ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/meku-block');
    
    if (data) {
      try {
        const payload = JSON.parse(data);
        if (payload.type === 'image' && payload.content) {
          // Add the block
          // Note: Real impl would calculate x/y based on drop coordinates relative to the scaled stage
          addBlockToPage(page.id, BlockType.IMAGE);
          
          // Hack: Since addBlockToPage doesn't let us pass content immediately in the store signature yet,
          // we wait a tick or use a more specific action. 
          // For now, we'll let it create the block, and the user sees a placeholder they can update.
          // Ideally, addBlockToPage should accept initial content.
          
          // Let's do a quick hack to update the LAST block added (which is the one we just made)
          // Since Zustand actions are synchronous in this setup:
          const state = useStoryStore.getState();
          const updatedPage = state.pages.find(p => p.id === page.id);
          if (updatedPage) {
            const lastBlock = updatedPage.blocks[updatedPage.blocks.length - 1];
            if (lastBlock) {
              // Update the content to the dropped URL
              updateBlockContent(page.id, lastBlock.id, payload.content);
            }
          }
        }
      } catch (err) {
        console.error('Failed to parse drop data', err);
      }
    }
  };

  return (
    <div className="relative h-full w-full bg-[#09090b] overflow-hidden flex flex-col" onClick={handleStageClick}>
       {/* Dot Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }} 
      />

      {/* Viewport */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center">
        
        {/* The Scalable Wrapper */}
        <div 
          style={{
            transform: `scale(${scale})`,
            transition: 'transform 0.1s ease-out',
            width: size.width,
            height: size.height,
            transformOrigin: 'center center',
          }}
          className="relative shadow-2xl shrink-0"
        >
          {/* The Actual Page / Drop Zone */}
          <div 
            className="w-full h-full bg-white relative overflow-hidden ring-1 ring-gray-900/5 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            
            {/* Blocks */}
            <div className="p-8 h-full w-full relative">
              {page.blocks.map((block) => {
                const isSelected = selectedBlockId === block.id;
                
                return (
                  <div 
                    key={block.id}
                    onClick={(e) => handleBlockClick(e, block.id)}
                    className={`group relative transition-all duration-200 p-2 cursor-move ${
                      isSelected 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'border border-transparent hover:border-accent/50 hover:bg-accent/5'
                    }`}
                    style={block.style}
                  >
                     {/* Block Controls */}
                    <div className={`absolute -right-8 top-0 flex flex-col gap-1 z-10 ${isSelected ? 'flex' : 'hidden group-hover:flex'}`}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBlock(page.id, block.id);
                        }}
                        className="p-1.5 bg-red-500 text-white rounded shadow-sm hover:bg-red-600"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {block.type === BlockType.TEXT ? (
                      <p 
                        contentEditable 
                        suppressContentEditableWarning
                        onBlur={(e) => updateBlockContent(page.id, block.id, e.currentTarget.textContent || '')}
                        className="outline-none"
                      >
                        {block.content}
                      </p>
                    ) : (
                      <img 
                        src={block.content} 
                        alt="Story asset" 
                        className="w-full h-auto rounded-sm object-cover pointer-events-none" // prevent img drag interfering with block drag
                      />
                    )}
                  </div>
                );
              })}

              {page.blocks.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none text-gray-400">
                  <span className="font-display text-6xl mb-4">?</span>
                  <span className="font-story italic text-2xl">Drop character here...</span>
                </div>
              )}
            </div>

             {/* Quick Add Overlay */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 hover:opacity-100 transition-opacity bg-white/90 p-2 rounded-full shadow-lg border border-gray-200 z-20">
               <button onClick={(e) => { e.stopPropagation(); addBlockToPage(page.id, BlockType.TEXT); }} className="p-2 hover:bg-orange-100 text-orange-600 rounded-full"><Type size={20} /></button>
               <button onClick={(e) => { e.stopPropagation(); addBlockToPage(page.id, BlockType.IMAGE); }} className="p-2 hover:bg-blue-100 text-blue-600 rounded-full"><ImageIcon size={20} /></button>
            </div>

          </div>
        </div>
      </div>

      <ZoomControls 
        scale={scale} 
        setScale={setScale} 
        onFit={() => setScale(0.6)}
      />
    </div>
  );
};

export default StoryStage;