import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Image, Music, Sparkles, Lock, Volume2, Eye, MoreVertical } from 'lucide-react';
import { AIStub } from '../../components/ui/AIStub';
import { useTimelineStore, TrackType } from '../../store/timelineStore';
import { Clip } from './Clip';

// --- Types ---

interface TrackProps {
  id: string;
  name: string;
  icon: React.ElementType;
  colorClass: string; // Tailwind color class for bg/accent
  aiLabel: string;
  aiContext: string;
  type: TrackType;
}

const TRACKS: TrackProps[] = [
  { 
    id: 'track-visual', 
    name: 'Visuals', 
    icon: Image, 
    colorClass: 'blue', 
    aiLabel: 'Gen', 
    aiContext: 'Timeline.VisualTrack',
    type: 'visual'
  },
  { 
    id: 'track-audio', 
    name: 'Audio / V.O.', 
    icon: Music, 
    colorClass: 'green', 
    aiLabel: 'TTS', 
    aiContext: 'Timeline.AudioTrack',
    type: 'audio'
  },
  { 
    id: 'track-fx', 
    name: 'Sound FX', 
    icon: Sparkles, 
    colorClass: 'purple', 
    aiLabel: 'Suggest FX', 
    aiContext: 'Timeline.FXTrack',
    type: 'fx'
  },
];

// --- Sub-Components ---

const TimeRuler: React.FC = () => {
  // Generate ticks for 20 segments (representing 100 seconds total at 5s per 100px)
  const ticks = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="h-8 border-b border-gray-800 bg-slate-900/50 flex items-end relative min-w-[2000px] select-none">
      {ticks.map((i) => (
        <div 
          key={i} 
          className="absolute bottom-0 border-l border-gray-700 h-full flex flex-col justify-end pl-1 pb-1"
          style={{ left: `${i * 100}px` }}
        >
          <span className="text-[10px] text-gray-500 font-mono leading-none">
            0:{String(i * 5).padStart(2, '0')}
          </span>
          <div className="h-1.5 w-px bg-gray-600 mt-1" />
        </div>
      ))}
    </div>
  );
};

const TrackHeader: React.FC<{ track: TrackProps }> = ({ track }) => {
  const Icon = track.icon;
  // Dynamic tailwind classes based on prop
  const iconColor = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
  }[track.colorClass] || 'text-gray-400';

  return (
    <div className="h-24 border-b border-gray-800 bg-slate-900 flex flex-col justify-between p-3 relative group">
      {/* Top Row: Info */}
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className={iconColor} />
        <span className="text-xs font-bold text-gray-300 tracking-wide uppercase">{track.name}</span>
      </div>

      {/* Middle: Controls */}
      <div className="flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
        <button className="p-1 hover:bg-white/10 rounded text-gray-400"><Lock size={12} /></button>
        <button className="p-1 hover:bg-white/10 rounded text-gray-400"><Eye size={12} /></button>
        <button className="p-1 hover:bg-white/10 rounded text-gray-400"><Volume2 size={12} /></button>
      </div>

      {/* Bottom: AI Action */}
      <div className="mt-1">
        <AIStub label={track.aiLabel} context={track.aiContext} />
      </div>

      {/* Left Accent Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${track.colorClass}-500/50`} />
    </div>
  );
};

const TrackLane: React.FC<{ track: TrackProps }> = ({ track }) => {
  // Select only clips belonging to this track
  const clips = useTimelineStore((state) => state.clips.filter(c => c.trackId === track.id));
  const PPS = 20; // Pixels Per Second (100px = 5s)

  // Styles for the background pattern
  const bgStyle = {
    blue: 'bg-blue-500/5',
    green: 'bg-green-500/5',
    purple: 'bg-purple-500/5',
  }[track.colorClass];

  return (
    <div className={`h-24 border-b border-gray-800 relative min-w-[2000px] ${bgStyle}`}>
       {/* Grid Lines */}
       <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
           backgroundImage: 'linear-gradient(90deg, #333 1px, transparent 1px)', 
           backgroundSize: '100px 100%' 
        }} 
      />
      
      {/* Empty State */}
      {clips.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="border-2 border-dashed border-gray-600 rounded-lg px-4 py-2 text-xs font-mono text-gray-400">
             Drag assets here
          </div>
        </div>
      )}

      {/* Clips */}
      {clips.map(clip => (
        <Clip key={clip.id} clip={clip} pps={PPS} colorClass={track.colorClass} />
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
      style={{ width: '12px', x: -6 }} // Center the hit area
    >
      {/* The visible line */}
      <div className="w-[2px] bg-red-500 h-full mx-auto relative">
        {/* The Handle */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 text-center -translate-y-6 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity bg-red-500 text-white text-[10px] font-mono px-1 rounded">
          0:00.00
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Component ---

export const TimelineRail: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col border-t border-gray-800">
      {/* Timeline Grid Container */}
      <div className="flex-1 overflow-hidden grid grid-cols-[220px_1fr]">
        
        {/* LEFT COLUMN: Headers */}
        <div className="border-r border-gray-800 bg-slate-900 z-20 shadow-xl">
          {/* Header Spacer (aligns with ruler) */}
          <div className="h-8 border-b border-gray-800 bg-slate-900 flex items-center justify-between px-3">
             <span className="text-[10px] font-mono text-gray-500">TC: 00:00:00:00</span>
             <MoreVertical size={12} className="text-gray-600" />
          </div>

          {/* Track Headers */}
          {TRACKS.map(track => (
            <TrackHeader key={track.id} track={track} />
          ))}
        </div>

        {/* RIGHT COLUMN: Canvas */}
        <div 
          ref={scrollRef}
          className="relative overflow-x-auto overflow-y-hidden custom-scrollbar bg-[#0a0a0c]"
        >
          {/* Content Wrapper */}
          <div className="relative min-w-[2000px]">
            <TimeRuler />
            
            {TRACKS.map(track => (
              <TrackLane key={track.id} track={track} />
            ))}

            {/* Playhead Overlay */}
            <div className="absolute inset-0 pointer-events-none">
               {/* Pass the scroll container ref for drag constraints */}
               <div className="absolute top-8 bottom-0 left-0 right-0 pointer-events-auto">
                 <Playhead containerRef={scrollRef} />
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};