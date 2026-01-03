import React, { useState } from 'react';
import { Users, Smile, Frown, Zap, User } from 'lucide-react';

// --- Interfaces ---

export interface CharacterProfile {
  id: string;
  name: string;
  defaultScale: number;
  voiceId?: string; // For future TTS
  avatar: string; // Thumbnail URL for the list
  color: string; // UI accent color
}

export interface PoseStack {
  characterId: string;
  // A mapping of emotion/pose names to Image URLs
  emotions: Record<string, string>;
  poses: Record<string, string>;
}

// --- Mock Data ---

const CHARACTERS: CharacterProfile[] = [
  { 
    id: 'char_fox', 
    name: 'Felix the Fox', 
    defaultScale: 1.0, 
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=ffdfbf',
    color: '#f97316'
  },
  { 
    id: 'char_robot', 
    name: 'Z-400', 
    defaultScale: 0.9, 
    avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=Zeta&backgroundColor=c0aede',
    color: '#a855f7'
  },
  { 
    id: 'char_hero', 
    name: 'Captain Val', 
    defaultScale: 1.2, 
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Val&backgroundColor=b6e3f4',
    color: '#0ea5e9'
  },
];

const STACKS: Record<string, PoseStack> = {
  'char_fox': {
    characterId: 'char_fox',
    emotions: {
      'Neutral': 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&eyebrows=default&mouth=default',
      'Happy': 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&eyebrows=raisedExcited&mouth=smile',
      'Sad': 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&eyebrows=sadConcerned&mouth=sad',
      'Surprised': 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&eyebrows=up&mouth=screamOpen',
    },
    poses: {
      'Running': 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&clothing=hoodie', // Mocking poses with clothing changes for now
    }
  },
  'char_robot': {
    characterId: 'char_robot',
    emotions: {
      'Idle': 'https://api.dicebear.com/9.x/bottts/svg?seed=Zeta&eyes=bulging&mouth=square01',
      'Computing': 'https://api.dicebear.com/9.x/bottts/svg?seed=Zeta&eyes=roundFrame01&mouth=diagram',
      'Error': 'https://api.dicebear.com/9.x/bottts/svg?seed=Zeta&eyes=shade01&mouth=grimace',
    },
    poses: {}
  },
  'char_hero': {
    characterId: 'char_hero',
    emotions: {
      'Heroic': 'https://api.dicebear.com/9.x/avataaars/svg?seed=Val&eyebrows=default&mouth=smile',
      'Determined': 'https://api.dicebear.com/9.x/avataaars/svg?seed=Val&eyebrows=angry&mouth=serious',
    },
    poses: {}
  }
};

// --- Component ---

export const CharacterPicker: React.FC = () => {
  const [selectedCharId, setSelectedCharId] = useState<string | null>(CHARACTERS[0].id);

  const handleDragStart = (e: React.DragEvent, url: string) => {
    // Standardize data transfer for the Canvas drop zone
    e.dataTransfer.setData('application/meku-block', JSON.stringify({
      type: 'image',
      content: url
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const selectedStack = selectedCharId ? STACKS[selectedCharId] : null;
  const selectedProfile = CHARACTERS.find(c => c.id === selectedCharId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
        <Users size={14} />
        <span>Cast & Crew</span>
      </div>

      {/* 1. Character List (Horizontal scroll for compactness in Sidebar) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
        {CHARACTERS.map(char => (
          <button
            key={char.id}
            onClick={() => setSelectedCharId(char.id)}
            className={`flex-shrink-0 relative w-12 h-12 rounded-full border-2 transition-all overflow-hidden ${
              selectedCharId === char.id 
                ? 'border-white scale-110 shadow-lg ring-2 ring-primary/50' 
                : 'border-gray-600 opacity-60 hover:opacity-100 hover:border-gray-400'
            }`}
            title={char.name}
          >
            <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
            {selectedCharId === char.id && (
              <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
            )}
          </button>
        ))}
      </div>

      {/* 2. The "Rolodex" Stack View */}
      {selectedStack && selectedProfile && (
        <div 
          className="bg-black/20 rounded-lg p-2 border border-white/5 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ borderLeft: `3px solid ${selectedProfile.color}`}}
        >
          <div className="flex justify-between items-center mb-2 px-1">
            <h4 className="text-xs font-bold text-gray-300">{selectedProfile.name}</h4>
            <span className="text-[10px] text-gray-500 font-mono">STACK: {Object.keys(selectedStack.emotions).length}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {Object.entries(selectedStack.emotions).map(([emotion, url]) => (
              <div 
                key={emotion}
                draggable
                onDragStart={(e) => handleDragStart(e, url)}
                className="group relative aspect-square bg-white/5 rounded-md cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors border border-transparent hover:border-primary/30 overflow-hidden"
              >
                <img src={url} alt={emotion} className="w-full h-full object-contain p-1" />
                
                {/* Hover Label */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-[9px] text-center text-white truncate">{emotion}</p>
                </div>

                {/* Drag Indicator */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-black/50 p-1 rounded">
                   <Zap size={8} className="text-yellow-400" fill="currentColor" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-2 text-[10px] text-gray-500 text-center italic">
            Drag pose to canvas
          </div>
        </div>
      )}
    </div>
  );
};