import React, { useState } from 'react';
import { useStoryStore } from '../store/storyStore';
import { BlockType } from '../types';
import { PAGE_SIZES } from '../constants';
import Canvas from './Canvas';
import ZoomControls from './ZoomControls';

interface StoryStageProps {
  scale: number;
  setScale: (scale: number) => void;
}

const StoryStage: React.FC<StoryStageProps> = ({ scale, setScale }) => {
  const { pages, activePageIndex, pageSize, addBlockToPage } = useStoryStore();
  const currentPage = pages[activePageIndex];
  const size = PAGE_SIZES[pageSize];
  
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle drop from Asset Library
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const data = e.dataTransfer.getData('application/meku-block');
    if (!data || !currentPage) return;
    
    try {
      const payload = JSON.parse(data);
      const { type, content, tags } = payload;
      
      if (type === 'image' || type === 'audio') {
        addBlockToPage(
          currentPage.id, 
          type === 'image' ? BlockType.IMAGE : BlockType.TEXT,
          content,
          tags || []
        );
      }
    } catch (err) {
      console.error('Drop parse error:', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  if (!currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900 text-gray-500">
        No page selected
      </div>
    );
  }

  return (
    <div 
      className={`
        relative flex-1 overflow-auto bg-slate-900 
        flex items-center justify-center p-8
        transition-colors duration-200
        ${isDragOver ? 'bg-blue-900/20' : ''}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Drop Zone Indicator */}
      {isDragOver && (
        <div className="absolute inset-4 border-2 border-dashed border-blue-400 rounded-xl pointer-events-none z-10 flex items-center justify-center">
          <div className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg font-medium">
            Drop to add to canvas
          </div>
        </div>
      )}

      {/* Canvas Container - Centers the page */}
      <div 
        className="relative"
        style={{
          width: size.width * scale,
          height: size.height * scale,
        }}
      >
        <Canvas 
          page={currentPage}
          pageSize={pageSize}
          scale={scale}
        />
      </div>

      {/* Zoom Controls Overlay */}
      <ZoomControls scale={scale} setScale={setScale} />
      
      {/* Page Info Badge */}
      <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs text-gray-400 font-mono">
        Page {activePageIndex + 1} • {pageSize} • {Math.round(scale * 100)}%
      </div>
    </div>
  );
};

export default StoryStage;
