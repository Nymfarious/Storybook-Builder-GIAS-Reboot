import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type TrackType = 'visual' | 'audio' | 'fx';

export interface Clip {
  id: string;
  trackId: string;
  startTime: number; // in seconds
  duration: number;  // in seconds
  content: string;   // Label or Asset URL
  type: TrackType;
}

interface TimelineState {
  clips: Clip[];
  
  // Actions
  addClip: (clip: Clip) => void;
  updateClip: (id: string, updates: Partial<Clip>) => void;
  removeClip: (id: string) => void;
}

// Initial Mock Data to populate the timeline
const INITIAL_CLIPS: Clip[] = [
  { 
    id: 'c1', 
    trackId: 'track-visual', 
    startTime: 0, 
    duration: 5, 
    content: 'Scene 1: Forest', 
    type: 'visual' 
  },
  { 
    id: 'c2', 
    trackId: 'track-audio', 
    startTime: 0.5, 
    duration: 8, 
    content: 'Voiceover: Intro', 
    type: 'audio' 
  },
  { 
    id: 'c3', 
    trackId: 'track-fx', 
    startTime: 2, 
    duration: 1.5, 
    content: 'Bird Chirp', 
    type: 'fx' 
  },
  { 
    id: 'c4', 
    trackId: 'track-visual', 
    startTime: 6, 
    duration: 4, 
    content: 'Scene 2: Fox', 
    type: 'visual' 
  },
];

export const useTimelineStore = create<TimelineState>()(
  immer((set) => ({
    clips: INITIAL_CLIPS,

    addClip: (clip) => set((state) => {
      state.clips.push(clip);
    }),

    updateClip: (id, updates) => set((state) => {
      const clip = state.clips.find((c) => c.id === id);
      if (clip) {
        Object.assign(clip, updates);
      }
    }),

    removeClip: (id) => set((state) => {
      state.clips = state.clips.filter((c) => c.id !== id);
    }),
  }))
);