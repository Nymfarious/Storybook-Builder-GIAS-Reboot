import React, { useState } from 'react';
import { Users, Zap, Image as ImageIcon, Box, Music, Tag as TagIcon, Check, X, Search, Plus } from 'lucide-react';
import { Tag } from '../../types';

// --- Interfaces ---

export type AssetCategory = 'character' | 'background' | 'prop' | 'audio';

export interface AssetProfile {
  id: string;
  category: AssetCategory;
  name: string;
  thumbnail: string; // URL for the list/grid
  previewUrl?: string; // High-res or main usage URL
  color: string; // UI accent color
  tags: Tag[];
  // For characters only
  stack?: {
    emotions: Record<string, string>;
    poses: Record<string, string>;
  };
}

// --- Mock Data ---

const MOCK_ASSETS: AssetProfile[] = [
  // Characters
  { 
    id: 'char_fox', category: 'character', name: 'Felix', color: '#f97316',
    thumbnail: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=ffdfbf',
    tags: [{ label: 'Hero', color: '#f97316', type: 'main_char' }],
    stack: {
      emotions: {
        'Neutral': 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&eyebrows=default',
        'Happy': 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&eyebrows=raisedExcited&mouth=smile',
        'Sad': 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&eyebrows=sadConcerned&mouth=sad',
      },
      poses: {}
    }
  },
  { 
    id: 'char_robot', category: 'character', name: 'Z-400', color: '#a855f7',
    thumbnail: 'https://api.dicebear.com/9.x/bottts/svg?seed=Zeta&backgroundColor=c0aede',
    tags: [{ label: 'Sidekick', color: '#a855f7', type: 'name' }],
    stack: {
      emotions: {
        'Idle': 'https://api.dicebear.com/9.x/bottts/svg?seed=Zeta&eyes=bulging',
        'Error': 'https://api.dicebear.com/9.x/bottts/svg?seed=Zeta&eyes=shade01',
      },
      poses: {}
    }
  },
  // Backgrounds
  {
    id: 'bg_forest', category: 'background', name: 'Mystic Forest', color: '#22c55e',
    thumbnail: 'https://picsum.photos/seed/forest/100',
    previewUrl: 'https://picsum.photos/seed/forest/800/600',
    tags: [{ label: 'Nature', color: '#22c55e', type: 'background' }]
  },
  {
    id: 'bg_city', category: 'background', name: 'Cyber City', color: '#3b82f6',
    thumbnail: 'https://picsum.photos/seed/city/100',
    previewUrl: 'https://picsum.photos/seed/city/800/600',
    tags: [{ label: 'Sci-Fi', color: '#3b82f6', type: 'background' }]
  },
  // Props
  {
    id: 'prop_sword', category: 'prop', name: 'Laser Sword', color: '#ef4444',
    thumbnail: 'https://picsum.photos/seed/sword/100',
    previewUrl: 'https://picsum.photos/seed/sword/300',
    tags: [{ label: 'Weapon', color: '#ef4444', type: 'prop' }]
  },
  // Audio
  {
    id: 'sfx_jump', category: 'audio', name: 'Jump Sound', color: '#eab308',
    thumbnail: 'https://placehold.co/100x100/eab308/white?text=SFX',
    previewUrl: 'mock-audio.mp3',
    tags: [{ label: 'Movement', color: '#eab308', type: 'custom' }]
  }
];

const TAG_TYPES: { type: Tag['type']; color: string }[] = [
  { type: 'name', color: '#10b981' },
  { type: 'sex', color: '#ec4899' },
  { type: 'prop', color: '#f59e0b' },
  { type: 'background', color: '#6366f1' },
  { type: 'main_char', color: '#ef4444' },
  { type: 'custom', color: '#64748b' },
];

// --- Component ---

export const AssetLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AssetCategory>('character');
  const [assets, setAssets] = useState<AssetProfile[]>(MOCK_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>('char_fox');

  // Tag Editing State
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [newTagType, setNewTagType] = useState<Tag['type']>('custom');

  const filteredAssets = assets.filter(a => a.category === activeTab);
  const selectedAsset = assets.find(a => a.id === selectedAssetId);

  const handleDragStart = (e: React.DragEvent, url: string, type: 'image' | 'audio') => {
    e.dataTransfer.setData('application/meku-block', JSON.stringify({
      type,
      content: url,
      tags: selectedAsset?.tags || []
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const saveTag = () => {
    if (!selectedAssetId || !newTagLabel.trim()) return;
    const typeDef = TAG_TYPES.find(t => t.type === newTagType);
    const tagData: Tag = {
      label: newTagLabel.trim(),
      type: newTagType,
      color: typeDef?.color || '#64748b'
    };

    setAssets(prev => prev.map(a => {
      if (a.id === selectedAssetId) {
        let updatedTags = [...a.tags];
        if (editingTagIndex !== null && editingTagIndex >= 0) updatedTags[editingTagIndex] = tagData;
        else updatedTags.push(tagData);
        return { ...a, tags: updatedTags };
      }
      return a;
    }));
    
    setNewTagLabel('');
    setEditingTagIndex(null);
    setIsAddingTag(false);
  };

  const removeTag = (e: React.MouseEvent, tagIndex: number) => {
    e.stopPropagation();
    if (!selectedAssetId) return;
    setAssets(prev => prev.map(a => {
      if (a.id === selectedAssetId) {
        const newTags = [...a.tags];
        newTags.splice(tagIndex, 1);
        return { ...a, tags: newTags };
      }
      return a;
    }));
  };

  const Tabs = () => (
    <div className="flex gap-1 mb-3 bg-black/20 p-1 rounded-lg">
      {[
        { id: 'character', icon: Users, label: 'Cast' },
        { id: 'background', icon: ImageIcon, label: 'Scene' },
        { id: 'prop', icon: Box, label: 'Props' },
        { id: 'audio', icon: Music, label: 'SFX' },
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => { setActiveTab(tab.id as AssetCategory); setSelectedAssetId(null); }}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded transition-all ${
            activeTab === tab.id ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
          }`}
          title={tab.label}
        >
          <tab.icon size={14} />
          <span className="text-[9px] font-bold mt-0.5">{tab.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-primary text-xs font-bold uppercase tracking-wider mb-1">
        <div className="flex items-center gap-2">
          <Search size={14} />
          <span>Library</span>
        </div>
        <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-400">{filteredAssets.length} Items</span>
      </div>

      <Tabs />

      {/* Asset Grid (Horizontal Scroll) */}
      <div className="flex gap-2 overflow-x-auto pb-2 min-h-[60px] scrollbar-thin scrollbar-thumb-gray-700">
        {filteredAssets.map(asset => (
          <button
            key={asset.id}
            onClick={() => { setSelectedAssetId(asset.id); setIsAddingTag(false); }}
            className={`flex-shrink-0 relative w-12 h-12 rounded-lg border-2 transition-all overflow-hidden group ${
              selectedAssetId === asset.id 
                ? 'border-white scale-105 shadow-lg ring-2 ring-primary/50' 
                : 'border-gray-700 opacity-70 hover:opacity-100 hover:border-gray-500'
            }`}
          >
            <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-0.5 ${selectedAssetId === asset.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
               <span className="text-[8px] text-white truncate w-full text-center">{asset.name}</span>
            </div>
          </button>
        ))}
        {filteredAssets.length === 0 && <div className="text-[10px] text-gray-600 italic p-2">No items found</div>}
      </div>

      {/* Selected Asset Details / Stack */}
      {selectedAsset && (
        <div 
          className="bg-black/20 rounded-lg p-3 border border-white/5 animate-in fade-in slide-in-from-bottom-2"
          style={{ borderLeft: `3px solid ${selectedAsset.color}`}}
        >
          {/* Header & Tag Toggle */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-xs font-bold text-gray-200">{selectedAsset.name}</h4>
              <span className="text-[9px] text-gray-500 uppercase font-mono">{selectedAsset.category}</span>
            </div>
             <button 
                onClick={() => setIsAddingTag(!isAddingTag)}
                className={`p-1 rounded-full transition-colors ${isAddingTag ? 'bg-white text-black' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                title="Manage Tags"
             >
                <TagIcon size={12} />
             </button>
          </div>

          {/* Tag List */}
          <div className="flex flex-wrap gap-1.5 mb-3">
             {selectedAsset.tags.map((tag, i) => (
               <div 
                 key={i} 
                 onClick={() => { setEditingTagIndex(i); setNewTagLabel(tag.label); setNewTagType(tag.type); setIsAddingTag(true); }}
                 className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium text-white shadow-sm cursor-pointer border ${editingTagIndex === i ? 'ring-1 ring-white border-white' : 'border-transparent'}`}
                 style={{ backgroundColor: tag.color }}
               >
                 <span>{tag.label}</span>
                 <button onClick={(e) => removeTag(e, i)} className="hover:text-black/50"><X size={8} /></button>
               </div>
             ))}
             {selectedAsset.tags.length === 0 && !isAddingTag && <span className="text-[9px] text-gray-600 italic">No tags</span>}
          </div>

          {/* Tag Form */}
          {isAddingTag && (
            <div className="mb-3 p-2 bg-black/40 rounded border border-gray-700 space-y-2">
               <input 
                 type="text" placeholder="Tag Label..." value={newTagLabel} onChange={(e) => setNewTagLabel(e.target.value)}
                 className="w-full bg-gray-800 text-white text-[10px] px-2 py-1 rounded border border-gray-600 outline-none" autoFocus
               />
               <div className="flex gap-1">
                 <select value={newTagType} onChange={(e) => setNewTagType(e.target.value as Tag['type'])} className="flex-1 bg-gray-800 text-white text-[10px] px-1 rounded border border-gray-600">
                   {TAG_TYPES.map(t => <option key={t.type} value={t.type}>{t.type}</option>)}
                 </select>
                 <button onClick={saveTag} disabled={!newTagLabel.trim()} className="px-2 bg-green-600 text-white rounded"><Check size={12} /></button>
               </div>
            </div>
          )}

          {/* View: Character Stack OR Single Asset */}
          {selectedAsset.category === 'character' && selectedAsset.stack ? (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(selectedAsset.stack.emotions).map(([emotion, url]) => (
                <div 
                  key={emotion} draggable onDragStart={(e) => handleDragStart(e, url, 'image')}
                  className="group relative aspect-square bg-white/5 rounded-md cursor-grab active:cursor-grabbing hover:bg-white/10 border border-transparent hover:border-primary/30 overflow-hidden"
                >
                  <img src={url} alt={emotion} className="w-full h-full object-contain p-1" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-[9px] text-center text-white">{emotion}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              draggable onDragStart={(e) => handleDragStart(e, (selectedAsset.previewUrl || selectedAsset.thumbnail) as string, selectedAsset.category === 'audio' ? 'audio' : 'image')}
              className="group relative aspect-video bg-white/5 rounded-md cursor-grab active:cursor-grabbing hover:bg-white/10 border border-transparent hover:border-primary/30 overflow-hidden flex items-center justify-center"
            >
              {selectedAsset.category === 'audio' ? <Music size={32} className="text-gray-500 group-hover:text-white" /> : <img src={selectedAsset.previewUrl} alt="Preview" className="w-full h-full object-cover" />}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 backdrop-blur-[1px]">
                 <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded-full">Drag to Stage</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};