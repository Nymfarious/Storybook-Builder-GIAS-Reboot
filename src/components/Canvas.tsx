import React, { useState, useRef, useCallback } from 'react';
import { Page, PageSize, Block, BlockType, Tag } from '../types';
import { PAGE_SIZES } from '../constants';
import { Trash2, Pin, PinOff, RotateCw, Layers, Tag as TagIcon } from 'lucide-react';
import { useStoryStore } from '../store/storyStore';

interface CanvasProps {
  page: Page;
  pageSize: PageSize;
  scale: number;
}

const Canvas: React.FC<CanvasProps> = ({ page, pageSize, scale }) => {
  const size = PAGE_SIZES[pageSize];
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const { 
    selectedBlockId, 
    selectBlock, 
    updateBlockPosition, 
    updateBlockRotation,
    updateBlockZIndex,
    toggleBlockPin,
    deleteBlock 
  } = useStoryStore();

  // Drag state
  const [dragState, setDragState] = useState<{
    blockId: string;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  // Rotation state
  const [rotatingBlockId, setRotatingBlockId] = useState<string | null>(null);

  // Handle block drag start
  const handleDragStart = (e: React.MouseEvent, block: Block) => {
    if (block.isPinned) return;
    e.preventDefault();
    e.stopPropagation();
    
    selectBlock(block.id);
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragState({
      blockId: block.id,
      startX: block.position?.x || 0,
      startY: block.position?.y || 0,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
  };

  // Handle drag move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState || !canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const scaledX = (e.clientX - canvasRect.left) / scale - dragState.offsetX;
    const scaledY = (e.clientY - canvasRect.top) / scale - dragState.offsetY;
    
    // Clamp to canvas bounds
    const x = Math.max(0, Math.min(size.width - 100, scaledX));
    const y = Math.max(0, Math.min(size.height - 100, scaledY));
    
    updateBlockPosition(page.id, dragState.blockId, x, y);
  }, [dragState, scale, size, page.id, updateBlockPosition]);

  // Handle drag end
  const handleMouseUp = useCallback(() => {
    setDragState(null);
    setRotatingBlockId(null);
  }, []);

  // Handle rotation
  const handleRotationStart = (e: React.MouseEvent, block: Block) => {
    e.preventDefault();
    e.stopPropagation();
    setRotatingBlockId(block.id);
    selectBlock(block.id);
  };

  const handleRotationMove = useCallback((e: React.MouseEvent, block: Block) => {
    if (rotatingBlockId !== block.id || !canvasRef.current) return;
    
    const blockEl = document.getElementById(`block-${block.id}`);
    if (!blockEl) return;
    
    const rect = blockEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const degrees = (angle * 180 / Math.PI) + 90; // Adjust so top is 0
    
    updateBlockRotation(page.id, block.id, degrees);
  }, [rotatingBlockId, page.id, updateBlockRotation]);

  // Bring to front
  const bringToFront = (blockId: string) => {
    const maxZ = Math.max(...page.blocks.map(b => b.zIndex || 0));
    updateBlockZIndex(page.id, blockId, maxZ + 1);
  };

  // Render tag dots
  const renderTagDots = (tags?: Tag[]) => {
    if (!tags || tags.length === 0) return null;
    return (
      <div className="absolute -top-1 -right-1 flex gap-0.5">
        {tags.slice(0, 3).map((tag, i) => (
          <div 
            key={i}
            className="w-2 h-2 rounded-full border border-white/50 shadow-sm"
            style={{ backgroundColor: tag.color }}
            title={tag.label}
          />
        ))}
        {tags.length > 3 && (
          <div className="w-2 h-2 rounded-full bg-gray-500 text-[6px] text-white flex items-center justify-center">
            +
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="relative overflow-hidden"
      onMouseMove={(e) => {
        if (dragState) handleMouseMove(e);
        if (rotatingBlockId) {
          const block = page.blocks.find(b => b.id === rotatingBlockId);
          if (block) handleRotationMove(e, block);
        }
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* The Paper Canvas */}
      <div 
        ref={canvasRef}
        className="relative bg-white shadow-2xl transition-transform duration-300"
        style={{
          width: size.width,
          height: size.height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        onClick={() => selectBlock(null)}
      >
        {/* Render Blocks */}
        {page.blocks.map((block) => {
          const isSelected = selectedBlockId === block.id;
          const isDragging = dragState?.blockId === block.id;
          const isRotating = rotatingBlockId === block.id;
          
          return (
            <div
              key={block.id}
              id={`block-${block.id}`}
              className={`
                absolute group
                ${isDragging ? 'cursor-grabbing' : block.isPinned ? 'cursor-not-allowed' : 'cursor-grab'}
                ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                ${block.isPinned ? 'opacity-90' : ''}
              `}
              style={{
                left: block.position?.x || 0,
                top: block.position?.y || 0,
                transform: `rotate(${block.rotation || 0}deg)`,
                zIndex: block.zIndex || 1,
                transition: isDragging || isRotating ? 'none' : 'box-shadow 0.2s',
              }}
              onMouseDown={(e) => handleDragStart(e, block)}
              onClick={(e) => {
                e.stopPropagation();
                selectBlock(block.id);
              }}
            >
              {/* Block Content */}
              <div className="relative">
                {block.type === BlockType.TEXT ? (
                  <div 
                    className="p-3 min-w-[100px] min-h-[40px] bg-white/80 border border-gray-200 rounded shadow-sm"
                    style={block.style}
                    contentEditable
                    suppressContentEditableWarning
                  >
                    {block.content}
                  </div>
                ) : (
                  <img 
                    src={block.content} 
                    alt="Story asset" 
                    className="max-w-[300px] max-h-[300px] rounded shadow-lg object-contain"
                    draggable={false}
                  />
                )}

                {/* Tag Indicator Dots */}
                {renderTagDots(block.tags)}

                {/* Pin Indicator */}
                {block.isPinned && (
                  <div className="absolute -top-2 -left-2 bg-red-500 rounded-full p-1">
                    <Pin size={10} className="text-white" />
                  </div>
                )}

                {/* Selection Controls - Only visible when selected */}
                {isSelected && (
                  <>
                    {/* Control Bar */}
                    <div className="absolute -top-10 left-0 flex gap-1 bg-slate-800 rounded-lg p-1 shadow-xl z-50">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleBlockPin(page.id, block.id); }}
                        className={`p-1.5 rounded hover:bg-slate-700 ${block.isPinned ? 'text-red-400' : 'text-gray-300'}`}
                        title={block.isPinned ? 'Unpin' : 'Pin in place'}
                      >
                        {block.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                      </button>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); bringToFront(block.id); }}
                        className="p-1.5 rounded hover:bg-slate-700 text-gray-300"
                        title="Bring to front"
                      >
                        <Layers size={14} />
                      </button>
                      
                      <button
                        className="p-1.5 rounded hover:bg-slate-700 text-gray-300"
                        title="Tags"
                      >
                        <TagIcon size={14} />
                      </button>
                      
                      <div className="w-px bg-slate-600 mx-1" />
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteBlock(page.id, block.id); }}
                        className="p-1.5 rounded hover:bg-red-500/20 text-red-400"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Rotation Handle (Lollipop style) */}
                    <div 
                      className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer z-50"
                      onMouseDown={(e) => handleRotationStart(e, block)}
                    >
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-400 hover:scale-110 transition-transform">
                        <RotateCw size={10} className="text-white" />
                      </div>
                      <div className="w-px h-4 bg-green-500" />
                    </div>

                    {/* Resize Handles */}
                    <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-blue-500 rounded-sm cursor-se-resize shadow" />
                    <div className="absolute -left-1 -bottom-1 w-3 h-3 bg-blue-500 rounded-sm cursor-sw-resize shadow" />
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {page.blocks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center opacity-30">
              <p className="font-story italic text-3xl text-gray-400">Start your story...</p>
              <p className="text-sm text-gray-500 mt-2">Drag assets from the library or add blocks</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
