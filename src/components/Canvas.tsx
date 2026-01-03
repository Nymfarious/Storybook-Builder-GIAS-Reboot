import React from 'react';
import { Page, PageSize, Block, BlockType } from '../types';
import { PAGE_SIZES } from '../constants';
import { Plus, Image as ImageIcon, Type, Trash2 } from 'lucide-react';

interface CanvasProps {
  page: Page;
  pageSize: PageSize;
  onUpdatePage: (updatedPage: Page) => void;
  scale: number;
}

const Canvas: React.FC<CanvasProps> = ({ page, pageSize, onUpdatePage, scale }) => {
  const size = PAGE_SIZES[pageSize];

  const handleAddBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: `blk_${Date.now()}`,
      type,
      content: type === BlockType.TEXT ? 'Double-click to edit text...' : 'https://picsum.photos/400/300',
      style: {
        fontFamily: 'Inter',
        fontSize: '16px',
        color: '#333333'
      }
    };
    onUpdatePage({
      ...page,
      blocks: [...page.blocks, newBlock]
    });
  };

  const handleDeleteBlock = (blockId: string) => {
    onUpdatePage({
      ...page,
      blocks: page.blocks.filter(b => b.id !== blockId)
    });
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
          minWidth: size.width, // Prevent shrinking
          minHeight: size.height
        }}
      >
        {/* Render Blocks */}
        {page.blocks.map((block) => (
          <div 
            key={block.id}
            className="group relative border border-transparent hover:border-accent/50 hover:bg-accent/5 transition-colors p-2 cursor-move"
            style={{ 
              marginBottom: '1rem',
              ...block.style 
            }}
          >
            {/* Block Controls (Hover) */}
            <div className="absolute -right-8 top-0 hidden group-hover:flex flex-col gap-1">
              <button 
                onClick={() => handleDeleteBlock(block.id)}
                className="p-1.5 bg-red-500 text-white rounded shadow-sm hover:bg-red-600"
                title="Delete Block"
              >
                <Trash2 size={12} />
              </button>
            </div>

            {block.type === BlockType.TEXT ? (
              <p 
                contentEditable 
                suppressContentEditableWarning
                className="outline-none"
                style={{ fontFamily: block.style?.fontFamily }}
              >
                {block.content}
              </p>
            ) : (
              <img 
                src={block.content} 
                alt="Story asset" 
                className="w-full h-auto rounded-sm object-cover"
              />
            )}
          </div>
        ))}

        {/* Empty State / Add Area */}
        {page.blocks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <span className="font-story italic text-4xl text-gray-300">Start your story...</span>
          </div>
        )}

        {/* Floating Action Button for Adding Blocks (Mocking DnD for now) */}
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