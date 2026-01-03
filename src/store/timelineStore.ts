import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type TrackCategory = 'visual' | 'audio' | 'interaction';
export type TrackType = 'background' | 'character' | 'prop' | 'audio' | 'sfx' | 'interaction';

export interface TimelineTrack {
  id: string;
  name: string;
  type: TrackType;
  category: TrackCategory;
  isCollapsed?: boolean;
  parentId?: string;
}

export interface Clip {
  id: string;
  trackId: string;
  startTime: number;
  duration: number;
  content: string;
}

export interface PageMarker {
  id: string;
  time: number;
  label: string;
}

interface TimelineState {
  tracks: TimelineTrack[];
  clips: Clip[];
  markers: PageMarker[];
  
  addClip: (clip: Clip) => void;
  updateClip: (id: string, updates: Partial<Clip>) => void;
  removeClip: (id: string) => void;
  
  addTrack: (track: TimelineTrack) => void;
  toggleTrackCollapse: (trackId: string) => void;
  
  addMarker: (marker: PageMarker) => void;
  
  cutInside: (start: number, end: number) => void;
  cutOutside: (start: number, end: number) => void;
}

const INITIAL_TRACKS: TimelineTrack[] = [
  { id: 'grp-visuals', name: 'Visuals', type: 'background', category: 'visual', isCollapsed: false },
  { id: 't-bg', name: 'Backgrounds', type: 'background', category: 'visual', parentId: 'grp-visuals' },
  { id: 't-chars', name: 'Characters', type: 'character', category: 'visual', parentId: 'grp-visuals' },
  { id: 't-props', name: 'Props', type: 'prop', category: 'visual', parentId: 'grp-visuals' },
  { id: 't-audio', name: 'Music / Ambience', type: 'audio', category: 'audio' },
  { id: 't-sfx', name: 'Sound FX', type: 'sfx', category: 'audio' },
  { id: 't-interact', name: 'Interactions', type: 'interaction', category: 'interaction' },
];

const INITIAL_CLIPS: Clip[] = [
  { id: 'c1', trackId: 't-bg', startTime: 0, duration: 5, content: 'Forest Scene' },
  { id: 'c2', trackId: 't-audio', startTime: 0.5, duration: 8, content: 'Intro Music' },
  { id: 'c3', trackId: 't-sfx', startTime: 2, duration: 1.5, content: 'Bird Chirp' },
  { id: 'c4', trackId: 't-chars', startTime: 1, duration: 4, content: 'Fox Run' },
  { id: 'c5', trackId: 't-interact', startTime: 3, duration: 1, content: 'Boop Nose' },
];

const INITIAL_MARKERS: PageMarker[] = [
  { id: 'm1', time: 5, label: 'Page 1 End' },
  { id: 'm2', time: 5.5, label: 'Page 2 Start' },
];

export const useTimelineStore = create<TimelineState>()(
  immer((set) => ({
    tracks: INITIAL_TRACKS,
    clips: INITIAL_CLIPS,
    markers: INITIAL_MARKERS,

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

    addTrack: (track) => set((state) => {
      state.tracks.push(track);
    }),

    toggleTrackCollapse: (trackId) => set((state) => {
      const track = state.tracks.find(t => t.id === trackId);
      if (track) {
        track.isCollapsed = !track.isCollapsed;
      }
    }),

    addMarker: (marker) => set((state) => {
      state.markers.push(marker);
    }),

    cutInside: (rangeStart, rangeEnd) => set((state) => {
      const gap = rangeEnd - rangeStart;
      const newClips: Clip[] = [];

      state.clips.forEach(clip => {
        const clipEnd = clip.startTime + clip.duration;

        if (clipEnd <= rangeStart) {
          newClips.push(clip);
          return;
        }

        if (clip.startTime >= rangeEnd) {
          clip.startTime -= gap;
          newClips.push(clip);
          return;
        }
        
        if (clip.startTime < rangeStart) {
          clip.duration = rangeStart - clip.startTime;
          newClips.push(clip);
        }
      });
      state.clips = newClips;
    }),

    cutOutside: (rangeStart, rangeEnd) => set((state) => {
      const newClips: Clip[] = [];
      state.clips.forEach(clip => {
        const clipEnd = clip.startTime + clip.duration;
        if (clipEnd <= rangeStart || clip.startTime >= rangeEnd) return;
        
        if (clip.startTime < rangeStart) {
          clip.duration -= (rangeStart - clip.startTime);
          clip.startTime = rangeStart;
        }
        const currentEnd = clip.startTime + clip.duration;
        if (currentEnd > rangeEnd) {
          clip.duration -= (currentEnd - rangeEnd);
        }
        newClips.push(clip);
      });
      state.clips = newClips;
    })
  }))
);
