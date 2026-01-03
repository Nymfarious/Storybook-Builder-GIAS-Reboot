import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface DevToolsState {
  // Toggles the visibility of "Teal Stub" AI opportunity buttons
  showAIStubs: boolean;
  
  // Actions
  toggleAIStubs: () => void;
  setAIStubs: (visible: boolean) => void;
}

export const useDevToolsStore = create<DevToolsState>()(
  immer((set) => ({
    showAIStubs: true, // Default to true for development visibility

    toggleAIStubs: () => set((state) => {
      state.showAIStubs = !state.showAIStubs;
    }),

    setAIStubs: (visible) => set((state) => {
      state.showAIStubs = visible;
    }),
  }))
);