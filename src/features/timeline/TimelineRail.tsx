import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Image, Music, Sparkles, Lock, Eye, 
  Scissors, Crop, Users, Box, MousePointerClick, 
  ChevronRight, ChevronDown, Plus, Speaker
} from 'lucide-react';
import { AIStub } from '../../components/ui/AIStub';
import { useTimelineStore, TimelineTrack, TrackType } from '../../store/timelineStore';
import { Clip } from './Clip';
import { triggerHaptic } from '../../utils/haptics';
import { MendingOverlay } from './MendingOverlay';

interface TimelineRailProps {
  isExpanded: boolean;
}

// --- Sub-Components ---

const Equalizer: React.FC = () => (
  <div className="flex items-end gap-[2px] h-3 opacity-50">
    {[...Array(5)].map((_, i) => (
      <div 
        key={i}
        className="w-0.5 bg-green-500 animate-pulse rounded-t-sm"
        style={{ 
          height: `${30 + Math.random() * 70}%`,
          animationDuration: `${0.5 + Math.random()}s`
        }} 
      />
    ))}
  </div>
);

const PageMarkers: React.FC<{ pps: number }> = ({ pps }) => {
  const markers = useTimelineStore(state => state.markers);
  return (
    <>
      {markers.map(marker => (
        <div 
          key={marker.id}
          className="absolute top-0 bottom-0 z-10 pointer-events-none border-l border-yellow-500/50"
          style={{ left: marker.time * pps }}
        >
          <div className="absolute top-0 -translate-x-1/2 bg-yellow-900/80 text-yellow-200 text-[8px] px-1 rounded-b font-mono whitespace-nowrap border border-yellow-700/50">
            {marker.label}
          </div>
        </div>
      ))}
    </>
  );
};

const TimeRuler: React.FC<{ 
  pps: number; 
  onSelectRange: (start: number, end: number) => void;
  onClearRange: () => void;
}> = ({ pps, onSelectRange, onClearRange }) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);

  const ticks = Array.from({ length: 40 }, (_, i) => i);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!rulerRef.current) return;
    const startX = e.nativeEvent.offsetX;
    setDragStart(startX);
    setIsDragging(true);
    onClearRange();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStart === null) return;
    const currentX = e.nativeEvent.offsetX;
    const startPixel = Math.min(dragStart, currentX);
    const endPixel = Math.max(dragStart, currentX);
    onSelectRange(startPixel / pps, endPixel / pps);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  return (
    <div 
      ref={rulerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="h-5 border-b border-gray-800 bg-slate-900/50 flex items-end relative min-w-[2000px] select-none cursor-text"
    >
      {ticks.map((i) => (
        <div 
          key={i} 
          className="absolute bottom-0 border-l border-gray-700 h-full flex flex-col justify-end pl-1 pb-0.5 pointer-events-none"
          style={{ left: `${i * 100}px` }}
        >
          <span className="text-[8px] text-gray-500 font-mono leading-none">
            0:{String(i * 5).padStart(2, '0')}
          </span>
        </div>
      ))}
    </div>
  );
};

const TrackHeader: React.FC<{ track: TimelineTrack; hasChildren?: boolean }> = ({ track, hasChildren }) => {
  const toggleCollapse = useTimelineStore(state => state.toggleTrackCollapse);
  
  const Icons: Record<TrackType, React.ElementType> = {
    background: Image,
    character: Users,
    prop: Box,
    audio: Music,
    sfx: Sparkles,
    interaction: MousePointerClick
  };
  const Icon = Icons[track.type] || Box;

  const colors: Record<string, string> = {
    visual: 'text-blue-400 border-l-blue-500/50',
    audio: 'text-green-400 border-l-green-500/50',
    interaction: 'text-orange-400 border-l-orange-500/50'
  };
  const colorClass = colors[track.category] || 'text-gray-400 border-l-gray-500';

  const heightClass = hasChildren ? 'h-6 bg-slate-800/50' : 'h-5 bg-slate-900';
  const paddingClass = track.parentId ? 'pl-5' : 'pl-2';

  return (
    <div className={`${heightClass} ${paddingClass} border-b border-gray-800 flex items-center justify-between pr-2 relative group hover:bg-white/5 transition-colors border-l-2 ${colorClass.split(' ')[1]}`}>
      <div className="flex items-center gap-1.5 overflow-hidden">
        {hasChildren && (
          <button onClick={() => toggleCollapse(track.id)} className="text-gray-500 hover:text-white">
            {track.isCollapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
          </button>
        )}
        <Icon size={10} className={colorClass.split(' ')[0]} />
        <span className="text-[9px] font-bold text-gray-300 tracking-wide truncate">{track.name}</span>
      </div>

      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-0.5 text-gray-500 hover:text-white"><Lock size={9} /></button>
        <button className="p-0.5 text-gray-500 hover:text-white"><Eye size={9} /></button>
        {track.category !== 'visual' && (
          <button className="p-0.5 text-gray-500 hover:text-white"><Speaker size={9} /></button>
        )}
      </div>
    </div>
  );
};

const TrackLane: React.FC<{ track: TimelineTrack }> = ({ track }) => {
  const clips = useTimelineStore((state) => state.clips.filter(c => c.trackId === track.id));
  const PPS = 20;

  const bgStyle: Record<string, string> = {
    visual: 'bg-blue-500/5',
    audio: 'bg-green-500/5',
    interaction: 'bg-orange-500/5',
  };
  
  const clipColorClass: Record<string, string> = {
    visual: 'blue',
    audio: 'green',
    interaction: 'orange'
  };

  return (
    <div className={`h-5 border-b border-gray-800 relative min-w-[2000px] ${bgStyle[track.category]}`}>
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(90deg, #333 1px, transparent 1px)', 
          backgroundSize: '100px 100%' 
        }} 
      />
      
      {(track.type === 'audio' || track.type === 'sfx') && clips.length > 0 && (
        <div className="absolute right-0 top-0.5 bottom-0.5 flex items-center pr-2 pointer-events-none">
          <Equalizer />
        </div>
      )}

      {track.type === 'interaction' && clips.length === 0 && (
        <div className="absolute inset-0 flex items-center ml-4 opacity-30">
          <span className="text-[8px] text-orange-300 italic">Double-click to add interaction...</span>
        </div>
      )}

      {clips.map(clip => (
        <Clip key={clip.id} clip={clip} pps={PPS} colorClass={clipColorClass[track.category] || 'blue'} />
      ))}
    </div>
  );
};

const Playhead: React.FC<{ containerRef: React.RefObject<HTMLDivElement> }> = ({ containerRef }) => {
  return (
    <motion.div
      drag="x"
      dragConstraints={containerRef}
      dragElastic={0}
      dragMomentum={false}
      initial={{ x: 0 }}
      className="absolute top-0 bottom-0 z-50 group cursor-grab active:cursor-grabbing"
      style={{ width: '12px', x: -6 }}
    >
      <div className="w-[1px] bg-red-500 h-full mx-auto relative shadow-[0_0_4px_rgba(239,68,68,0.5)]">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-red-500" />
      </div>
    </motion.div>
  );
};

// --- Main Component ---

export const TimelineRail: React.FC<TimelineRailProps> = ({ isExpanded }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const PPS = 20; 

  const tracks = useTimelineStore(state => state.tracks);
  const cutInside = useTimelineStore(state => state.cutInside);
  const cutOutside = useTimelineStore(state => state.cutOutside);
  const addTrack = useTimelineStore(state => state.addTrack);

  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  const [mendingPoint, setMendingPoint] = useState<number | null>(null);

  const rootTracks = tracks.filter(t => !t.parentId);
  const getChildTracks = (parentId: string) => tracks.filter(t => t.parentId === parentId);

  const handleCutInside = () => {
    if (!selection) return;
    triggerHaptic('heavy');
    cutInside(selection.start, selection.end);
    setMendingPoint(selection.start * PPS);
    setSelection(null);
  };

  const handleCutOutside = () => {
    if (!selection) return;
    triggerHaptic('heavy');
    cutOutside(selection.start, selection.end);
    setSelection(null);
  };

  const handleAddTrack = () => {
    addTrack({
      id: `t-custom-${Date.now()}`,
      name: 'New Audio Track',
      type: 'audio',
      category: 'audio'
    });
  };
  
  return (
    <div className="h-full w-full bg-slate-950 flex flex-col">
      <div className="flex-1 overflow-hidden grid grid-cols-[180px_1fr]">
        
        {/* LEFT: Track Headers */}
        <div className="border-r border-gray-800 bg-slate-900 z-20 shadow-xl overflow-y-auto scrollbar-none">
          <div className="h-5 border-b border-gray-800 bg-slate-900 flex items-center justify-between px-2 sticky top-0 z-10">
            <span className="text-[8px] font-mono text-gray-500">TC: 00:00:00:00</span>
            <button onClick={handleAddTrack} className="text-gray-500 hover:text-green-400">
              <Plus size={10} />
            </button>
          </div>
          
          {rootTracks.map(track => {
            const children = getChildTracks(track.id);
            return (
              <React.Fragment key={track.id}>
                <TrackHeader track={track} hasChildren={children.length > 0} />
                {!track.isCollapsed && children.map(child => (
                  <TrackHeader key={child.id} track={child} />
                ))}
              </React.Fragment>
            );
          })}
        </div>

        {/* RIGHT: Canvas Lanes */}
        <div 
          ref={scrollRef}
          className="relative overflow-x-auto overflow-y-auto custom-scrollbar bg-[#0a0a0c]"
        >
          <div className="relative min-w-[2000px] h-full">
            <TimeRuler 
              pps={PPS} 
              onSelectRange={(s, e) => setSelection({ start: s, end: e })}
              onClearRange={() => setSelection(null)}
            />
            
            <PageMarkers pps={PPS} />
            
            {/* Selection Overlay */}
            {selection && (
              <div 
                className="absolute top-5 bottom-0 bg-yellow-400/10 border-x border-yellow-400/30 z-30 pointer-events-none"
                style={{
                  left: selection.start * PPS,
                  width: (selection.end - selection.start) * PPS
                }}
              >
                {/* Floating Toolbar */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 bg-slate-800 border border-gray-700 p-1 rounded shadow-xl pointer-events-auto z-50">
                  <button onClick={handleCutInside} className="p-1 hover:bg-slate-700 rounded text-red-400 hover:text-red-300" title="Cut Inside"><Scissors size={12} /></button>
                  <button onClick={handleCutOutside} className="p-1 hover:bg-slate-700 rounded text-gray-400 hover:text-white" title="Cut Outside"><Crop size={12} /></button>
                  <div className="w-px h-4 bg-gray-700 mx-1" />
                  <AIStub label="Trim" context="Timeline.CutTool" onClick={handleCutInside} />
                </div>
              </div>
            )}

            {/* Mending Effect */}
            {mendingPoint !== null && (
              <MendingOverlay xPosition={mendingPoint} onComplete={() => setMendingPoint(null)} />
            )}

            {/* Render Tracks */}
            {rootTracks.map(track => {
              const children = getChildTracks(track.id);
              return (
                <React.Fragment key={track.id}>
                  <div className={`${children.length > 0 ? 'h-6 bg-slate-800/20' : 'h-5'} border-b border-gray-800 w-full relative`} />
                  {!track.isCollapsed && children.map(child => (
                    <TrackLane key={child.id} track={child} />
                  ))}
                </React.Fragment>
              );
            })}

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-5 bottom-0 left-0 right-0 pointer-events-auto">
                <Playhead containerRef={scrollRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
