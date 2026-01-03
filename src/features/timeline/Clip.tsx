import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Clip as ClipType, useTimelineStore } from '../../store/timelineStore';
import { triggerHaptic } from '../../utils/haptics';
import { GripVertical } from 'lucide-react';

interface ClipProps {
  clip: ClipType;
  pps: number;
  colorClass: string;
}

export const Clip: React.FC<ClipProps> = ({ clip, pps, colorClass }) => {
  const updateClip = useTimelineStore(state => state.updateClip);
  const [isDragging, setIsDragging] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempName, setTempName] = useState(clip.content);
  const inputRef = useRef<HTMLInputElement>(null);

  const styles: Record<string, string> = {
    blue: 'bg-blue-600 border-blue-400 text-blue-100',
    green: 'bg-green-600 border-green-400 text-green-100',
    purple: 'bg-purple-600 border-purple-400 text-purple-100',
    orange: 'bg-orange-600 border-orange-400 text-orange-100',
  };

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const SNAP_SECONDS = 0.5;
  const SNAP_PX = SNAP_SECONDS * pps;

  const left = clip.startTime * pps;
  const width = clip.duration * pps;

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    
    const deltaPixels = info.offset.x;
    const currentX = left + deltaPixels;
    
    let newStartTime = Math.round(currentX / SNAP_PX) * SNAP_SECONDS;
    if (newStartTime < 0) newStartTime = 0;

    if (newStartTime !== clip.startTime) {
      triggerHaptic('tap');
      updateClip(clip.id, { startTime: newStartTime });
    }
  };

  const handleResizeEnd = (_: any, info: PanInfo) => {
    const currentWidth = width + info.offset.x;
    let newDuration = Math.round(currentWidth / SNAP_PX) * SNAP_SECONDS;
    if (newDuration < 0.5) newDuration = 0.5;

    if (newDuration !== clip.duration) {
      triggerHaptic('light');
      updateClip(clip.id, { duration: newDuration });
    }
  };

  const handleRenameSubmit = () => {
    setIsRenaming(false);
    if (tempName.trim() && tempName !== clip.content) {
      updateClip(clip.id, { content: tempName.trim() });
    } else {
      setTempName(clip.content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRenameSubmit();
    if (e.key === 'Escape') {
      setIsRenaming(false);
      setTempName(clip.content);
    }
  };

  return (
    <motion.div
      className={`absolute top-1 bottom-1 rounded-md border shadow-sm group overflow-visible select-none ${styles[colorClass] || styles.blue} ${isDragging ? 'z-20 ring-2 ring-white/50 cursor-grabbing' : 'z-10 cursor-grab'}`}
      style={{ left, width }}
      drag={!isRenaming ? "x" : false}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onDoubleClick={(e) => { e.stopPropagation(); setIsRenaming(true); }}
      whileHover={{ scale: isRenaming ? 1 : 1.01 }}
      whileTap={{ scale: isRenaming ? 1 : 0.99 }}
    >
      {/* Clip Content */}
      <div className="w-full h-full flex items-center px-2 overflow-hidden">
        {isRenaming ? (
          <input
            ref={inputRef}
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={handleKeyDown}
            className="w-full bg-black/40 text-white text-[10px] font-bold px-1 rounded outline-none border border-white/50"
          />
        ) : (
          <span className="text-[10px] font-bold truncate tracking-tight w-full" title="Double-click to rename">
            {clip.content}
          </span>
        )}
      </div>

      {/* Hover Info */}
      {!isRenaming && (
        <div className="absolute -top-5 left-0 bg-black/80 text-white text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-30 transition-opacity">
          {clip.startTime.toFixed(1)}s
        </div>
      )}

      {/* Resize Handle */}
      {!isRenaming && (
        <motion.div
          drag="x"
          dragMomentum={false}
          dragElastic={0}
          onDragEnd={handleResizeEnd}
          onClick={(e) => e.stopPropagation()} 
          className="absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize flex items-center justify-center hover:bg-black/20 group/handle"
        >
          <GripVertical size={10} className="opacity-0 group-hover/handle:opacity-100 text-white/70" />
        </motion.div>
      )}
    </motion.div>
  );
};
