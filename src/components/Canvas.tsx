import React, { useRef } from 'react';
import { Page, PageSize, Block, BlockType } from '../types';
import { PAGE_SIZES } from '../constants';
import { Plus, Image as ImageIcon, Type, Trash2, Layers, Tag as TagIcon, RefreshCw } from 'lucide-react';

interface CanvasProps {
  page: Page;
  pageSize: PageSize;
  onUpdatePage: (updatedPage: Page) => void;
  scale: number;
}

const Canvas: React.FC<CanvasProps> = ({ page, pageSize, onUpdatePage, scale }) => {
  const size = PAGE_SIZES[pageSize];
  const pageRef = useRef(page);
  pageRef.current = page;

  const handleAddBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: `blk_${Date.now()}`,
      type,
      content: type === BlockType.TEXT ? 'Double-click to edit text...' : 'https://picsum.photos/400/300',
      style: {
        fontFamily: 'Inter',
        fontSize: '16px',
        color: '#333333'
      },
      rotation: 0,
      zIndex: 1,
      tags: []
    };
    onUpdatePage({
      ...page,
      blocks: [...page.blocks, newBlock]
    });
  };

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    onUpdatePage({
      ...page,
      blocks: page.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b)
    });
  };

  const handleDeleteBlock = (blockId: string) => {
    onUpdatePage({
      ...page,
      blocks: page.blocks.filter(b => b.id !== blockId)
    });
  };

  const handleRotateMouseDown = (e: React.MouseEvent, blockId: string, currentRotation: number) => {
    e.stopPropagation();
    e.preventDefault();

    const handle = e.currentTarget as HTMLElement;
    // The handle is inside the block div. We need the center of the block div.
    // The block div is the parent of the handle's container, or we can look for .group
    const blockEl = handle.closest('.group');
    if (!blockEl) return;

    const rect = blockEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const startMouseAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const initialBlockRotation = currentRotation || 0;

    const onMouseMove = (ev: MouseEvent) => {
      const angle = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
      const angleDelta = angle - startMouseAngle;
      const degDelta = angleDelta * (180 / Math.PI);
      
      const newRotation = initialBlockRotation + degDelta;

      const currentPage = pageRef.current;
      onUpdatePage({
        ...currentPage,
        blocks: currentPage.blocks.map(b => b.id === blockId ? { ...b, rotation: newRotation } : b)
      });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="flex-1 overflow-auto bg-[#0f172a] relative flex items-center justify-center p-12 transition-all">
      {/* The Paper */}
      <div 
        className="relative bg-white shadow-2xl transition-all duration-300 ease-out"
        style={{
          width: size.width,
          height: size.height,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          minWidth: size.width,
          minHeight: size.height
        }}
      >
        {/* Render Blocks */}
        {page.blocks.map((block) => (
          <div 
            key={block.id}
            className="group absolute hover:ring-2 hover:ring-accent/50 p-1 cursor-move selection-none"
            style={{ 
              top: block.position?.y || '10%',
              left: block.position?.x || '10%',
              width: block.type === BlockType.IMAGE ? '200px' : 'auto',
              transform: `rotate(${block.rotation || 0}deg)`,
              zIndex: block.zIndex || 1,
              ...block.style 
            }}
          >
            {/* Rotation Handle (Lollipop) */}
            <div 
              className="absolute -top-8 left-1/2 -translate-x-1/2 flex-col items-center hidden group-hover:flex cursor-grab active:cursor-grabbing z-50"
              onMouseDown={(e) => handleRotateMouseDown(e, block.id, block.rotation || 0)}
            >
               <div className="w-2.5 h-2.5 bg-white border-2 border-primary rounded-full shadow-sm hover:scale-125 transition-transform" />
               <div className="w-px h-4 bg-primary" />
            </div>

            {/* Block Controls (Hover Toolbar) */}
            <div className="absolute -top-8 right-0 hidden group-hover:flex gap-1 bg-black/80 p-1 rounded z-50 shadow-lg">
               {/* Layering */}
               <button 
                onClick={() => updateBlock(block.id, { zIndex: (block.zIndex || 1) + 1 })}
                className="p-1 text-white hover:text-accent"
                title="Bring Forward"
               >
                 <Layers size={12} />
               </button>

               {/* Tags */}
               <button 
                onClick={() => alert(`Tags: ${block.tags?.map(t => t.label).join(', ') || 'None'}`)}
                className="p-1 text-white hover:text-accent"
                title="View Tags"
               >
                 <TagIcon size={12} />
               </button>

               <div className="w-px h-3 bg-gray-600 mx-1 self-center" />

              <button 
                onClick={() => handleDeleteBlock(block.id)}
                className="p-1 text-red-400 hover:text-red-200"
                title="Delete Block"
              >
                <Trash2 size={12} />
              </button>
            </div>

            {block.type === BlockType.TEXT ? (
              <p 
                contentEditable 
                suppressContentEditableWarning
                className="outline-none min-w-[100px]"
                style={{ fontFamily: block.style?.fontFamily }}
              >
                {block.content}
              </p>
            ) : (
              <div className="relative">
                 <img 
                  src={block.content} 
                  alt="Story asset" 
                  className="w-full h-auto rounded-sm object-cover pointer-events-none"
                />
                {/* Visual indicator of tags */}
                {block.tags && block.tags.length > 0 && (
                  <div className="absolute bottom-1 right-1 flex gap-0.5">
                    {block.tags.map((tag, i) => (
                      <div key={i} className="w-2 h-2 rounded-full border border-white shadow-sm" style={{ backgroundColor: tag.color }} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Empty State / Add Area */}
        {page.blocks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <span className="font-story italic text-4xl text-gray-300">Start your story...</span>
          </div>
        )}

        {/* Floating Action Button for Adding Blocks */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 hover:opacity-100 transition-opacity bg-white/90 p-2 rounded-full shadow-lg border border-gray-200">
           <button 
            onClick={() => handleAddBlock(BlockType.TEXT)}
            className="p-2 hover:bg-orange-100 text-orange-600 rounded-full transition-colors"
            title="Add Text"
           >
             <Type size={20} />
           </button>
           <button 
            onClick={() => handleAddBlock(BlockType.IMAGE)}
            className="p-2 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
            title="Add Image"
           >
             <ImageIcon size={20} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;