import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { temporal } from 'zundo';
import { Page, Block, BlockType, LayoutType, PageSize, Tag } from '../types';
import { INITIAL_PAGE } from '../constants';

interface StoryState {
  // Data
  pages: Page[];
  activePageIndex: number;
  selectedBlockId: string | null;
  pageSize: PageSize;
  
  // Actions
  addPage: () => void;
  setActivePage: (index: number) => void;
  setPageSize: (size: PageSize) => void;
  
  // Block Actions
  addBlockToPage: (pageId: string, type: BlockType, content?: string, tags?: Tag[]) => void;
  updateBlockContent: (pageId: string, blockId: string, content: string) => void;
  updateBlockStyle: (pageId: string, blockId: string, style: Record<string, any>) => void;
  updateBlockPosition: (pageId: string, blockId: string, x: number, y: number) => void;
  updateBlockRotation: (pageId: string, blockId: string, rotation: number) => void;
  updateBlockZIndex: (pageId: string, blockId: string, zIndex: number) => void;
  updateBlockTags: (pageId: string, blockId: string, tags: Tag[]) => void;
  toggleBlockPin: (pageId: string, blockId: string) => void;
  deleteBlock: (pageId: string, blockId: string) => void;
  selectBlock: (blockId: string | null) => void;
}

export const useStoryStore = create<StoryState>()(
  temporal(
    immer((set) => ({
      pages: [INITIAL_PAGE],
      activePageIndex: 0,
      selectedBlockId: null,
      pageSize: PageSize.A4,

      addPage: () => set((state) => {
        const newPage: Page = {
          id: `pg_${Date.now()}`,
          projectId: state.pages[0].projectId,
          index: state.pages.length,
          layoutType: LayoutType.SINGLE,
          blocks: [],
          background: '#ffffff'
        };
        state.pages.push(newPage);
        state.activePageIndex = state.pages.length - 1;
        state.selectedBlockId = null;
      }),

      setActivePage: (index) => set((state) => {
        if (index >= 0 && index < state.pages.length) {
          state.activePageIndex = index;
          state.selectedBlockId = null;
        }
      }),

      setPageSize: (size) => set((state) => {
        state.pageSize = size;
      }),

      addBlockToPage: (pageId, type, content, tags) => set((state) => {
        const page = state.pages.find(p => p.id === pageId);
        if (page) {
          const newBlock: Block = {
            id: `blk_${Date.now()}`,
            type,
            content: content || (type === BlockType.TEXT ? 'Double-click to edit...' : 'https://picsum.photos/400/300'),
            style: {
              fontFamily: 'Inter',
              fontSize: '16px',
              color: '#333333',
            },
            position: { x: 50, y: 50 + (page.blocks.length * 20) }, // Stagger new blocks
            rotation: 0,
            zIndex: page.blocks.length + 1,
            isPinned: false,
            tags: tags || []
          };
          page.blocks.push(newBlock);
          state.selectedBlockId = newBlock.id;
        }
      }),

      updateBlockContent: (pageId, blockId, content) => set((state) => {
        const page = state.pages.find(p => p.id === pageId);
        const block = page?.blocks.find(b => b.id === blockId);
        if (block) {
          block.content = content;
        }
      }),
      
      updateBlockStyle: (pageId, blockId, style) => set((state) => {
        const page = state.pages.find(p => p.id === pageId);
        const block = page?.blocks.find(b => b.id === blockId);
        if (block) {
          block.style = { ...block.style, ...style };
        }
      }),

      updateBlockPosition: (pageId, blockId, x, y) => set((state) => {
        const page = state.pages.find(p => p.id === pageId);
        const block = page?.blocks.find(b => b.id === blockId);
        if (block && !block.isPinned) {
          block.position = { x, y };
        }
      }),

      updateBlockRotation: (pageId, blockId, rotation) => set((state) => {
        const page = state.pages.find(p => p.id === pageId);
        const block = page?.blocks.find(b => b.id === blockId);
        if (block) {
          // Normalize rotation to 0-360
          block.rotation = ((rotation % 360) + 360) % 360;
        }
      }),

      updateBlockZIndex: (pageId, blockId, zIndex) => set((state) => {
        const page = state.pages.find(p => p.id === pageId);
        const block = page?.blocks.find(b => b.id === blockId);
        if (block) {
          block.zIndex = zIndex;
        }
      }),

      updateBlockTags: (pageId, blockId, tags) => set((state) => {
        const page = state.pages.find(p => p.id === pageId);
        const block = page?.blocks.find(b => b.id === blockId);
        if (block) {
          block.tags = tags;
        }
      }),

      toggleBlockPin: (pageId, blockId) => set((state) => {
        const page = state.pages.find(p => p.id === pageId);
        const block = page?.blocks.find(b => b.id === blockId);
        if (block) {
          block.isPinned = !block.isPinned;
        }
      }),

      deleteBlock: (pageId, blockId) => set((state) => {
        const page = state.pages.find(p => p.id === pageId);
        if (page) {
          page.blocks = page.blocks.filter(b => b.id !== blockId);
          if (state.selectedBlockId === blockId) {
            state.selectedBlockId = null;
          }
        }
      }),

      selectBlock: (blockId) => set((state) => {
        state.selectedBlockId = blockId;
      }),
    })),
    {
      limit: 50, // Undo history limit
      partialize: (state) => ({
        pages: state.pages,
        pageSize: state.pageSize,
        activePageIndex: state.activePageIndex
      })
    }
  )
);
