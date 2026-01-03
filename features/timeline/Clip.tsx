import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Clip as ClipType } from '../../store/timelineStore';
import { useTimelineStore } from '../../store/timelineStore';
import { triggerHaptic } from '../../utils/haptics';
import { GripVertical } from 'lucide-react';

interface ClipProps {
  clip: ClipType;
  pps: number; // Pixels Per Second
  colorClass: string;
}

export const Clip: React.FC<ClipProps> = ({ clip, pps, colorClass }) => {
  const updateClip = useTimelineStore(state => state.updateClip);
  const [isDragging, setIsDragging] = useState(false);

  // Styling based on track type
  const styles = {
    blue: 'bg-blue-600 border-blue-400 text-blue-100',
    green: 'bg-green-600 border-green-400 text-green-100',
    purple: 'bg-purple-600 border-purple-400 text-purple-100',
  }[colorClass] || 'bg-gray-600 border-gray-400';

  // --- Logic ---
  
  const SNAP_SECONDS = 0.5;
  const SNAP_PX = SNAP_SECONDS * pps;

  // Calculate position
  const left = clip.startTime * pps;
  const width = clip.duration * pps;

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    
    // Calculate new start time based on drag delta
    // Note: This simple addition assumes drag starts from current position. 
    // Framer motion's onDragEnd provides offset relative to start of drag.
    // However, since we update the store which updates 'left', we need to be careful not to double count.
    // Framer motion handles the visual drag, but resets transform on re-render if we don't update state.
    
    // Logic: The element's visual x (transform) is added to the base 'left'.
    // We want to apply that delta to the startTime.
    const deltaPixels = info.offset.x;
    const currentX = left + deltaPixels;
    
    // Snap Logic
    let newStartTime = Math.round(currentX / SNAP_PX) * SNAP_SECONDS;
    if (newStartTime < 0) newStartTime = 0;

    if (newStartTime !== clip.startTime) {
      triggerHaptic('tap');
      updateClip(clip.id, { startTime: newStartTime });
    }
  };

  const handleResizeEnd = (_: any, info: PanInfo) => {
    // Calculate new duration
    const currentWidth = width + info.offset.x;
    
    // Snap Logic for Duration
    let newDuration = Math.round(currentWidth / SNAP_PX) * SNAP_SECONDS;
    if (newDuration < 0.5) newDuration = 0.5; // Min duration

    if (newDuration !== clip.duration) {
      triggerHaptic('light');
      updateClip(clip.id, { duration: newDuration });
    }
  };

  return (
    <motion.div
      className={`absolute top-2 bottom-2 rounded-md border shadow-sm group overflow-visible select-none ${styles} ${isDragging ? 'z-20 ring-2 ring-white/50 cursor-grabbing' : 'z-10 cursor-grab'}`}
      style={{ 
        left, 
        width,
      }}
      drag="x"
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Clip Content */}
      <div className="w-full h-full flex items-center px-2 overflow-hidden">
        <span className="text-[10px] font-bold truncate tracking-tight">{clip.content}</span>
      </div>

      {/* Hover Info (Start Time) */}
      <div className="absolute -top-5 left-0 bg-black/80 text-white text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-30 transition-opacity">
        {clip.startTime.toFixed(1)}s
      </div>

      {/* Resize Handle (Right) */}
      <motion.div
        drag="x"
        dragMomentum={false}
        dragElastic={0}
        onDragEnd={handleResizeEnd}
        onClick={(e) => e.stopPropagation()} // Prevent selecting clip when resizing
        className="absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize flex items-center justify-center hover:bg-black/20 group/handle"
      >
        <GripVertical size={10} className="opacity-0 group-hover/handle:opacity-100 text-white/70" />
      </motion.div>
    </motion.div>
  );
};