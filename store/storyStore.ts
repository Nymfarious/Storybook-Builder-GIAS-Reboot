import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { temporal } from 'zundo';
import { Page, Block, BlockType, LayoutType, PageSize } from '../types';
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
  addBlockToPage: (pageId: string, type: BlockType) => void;
  updateBlockContent: (pageId: string, blockId: string, content: string) => void;
  updateBlockStyle: (pageId: string, blockId: string, style: Record<string, any>) => void;
  updateBlockPosition: (pageId: string, blockId: string, x: number, y: number) => void;
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
          blocks: []
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

      addBlockToPage: (pageId, type) => set((state) => {
        const page = state.pages.find(p => p.id === pageId);
        if (page) {
           const newBlock: Block = {
            id: `blk_${Date.now()}`,
            type,
            content: type === BlockType.TEXT ? 'Double-click to edit text...' : 'https://picsum.photos/400/300',
            style: {
              fontFamily: 'Inter',
              fontSize: '16px',
              color: '#333333',
              marginBottom: '1rem'
            },
            position: { x: 0, y: 0 }
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
        if (block) {
          block.position = { x, y };
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
      // Don't save history when selecting blocks, only when modifying them
      partialize: (state) => ({
        pages: state.pages,
        pageSize: state.pageSize,
        activePageIndex: state.activePageIndex
      })
    }
  )
);