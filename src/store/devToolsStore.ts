import { create } from 'zustand';

interface DevToolsState {
  showAIStubs: boolean;
  toggleAIStubs: () => void;
  
  // Cognitive Engine Settings
  lexicalLevel: number;
  conceptualLevel: number;
  setLexicalLevel: (level: number) => void;
  setConceptualLevel: (level: number) => void;
}

export const useDevToolsStore = create<DevToolsState>((set) => ({
  showAIStubs: true,
  toggleAIStubs: () => set((state) => ({ showAIStubs: !state.showAIStubs })),
  
  lexicalLevel: 3,
  conceptualLevel: 3,
  setLexicalLevel: (level) => set({ lexicalLevel: Math.max(1, Math.min(5, level)) }),
  setConceptualLevel: (level) => set({ conceptualLevel: Math.max(1, Math.min(5, level)) }),
}));
