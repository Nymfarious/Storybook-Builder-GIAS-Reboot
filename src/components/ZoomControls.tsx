import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ZoomControlsProps {
  scale: number;
  setScale: (scale: number) => void;
}

const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

const ZoomControls: React.FC<ZoomControlsProps> = ({ scale, setScale }) => {
  const handleZoomIn = () => {
    const nextPreset = ZOOM_PRESETS.find(z => z > scale);
    setScale(nextPreset || scale);
  };

  const handleZoomOut = () => {
    const prevPresets = ZOOM_PRESETS.filter(z => z < scale);
    setScale(prevPresets[prevPresets.length - 1] || scale);
  };

  const handleFitToScreen = () => {
    setScale(0.6);
  };

  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-slate-800/90 backdrop-blur-sm rounded-lg p-1 shadow-xl border border-slate-700">
      <button
        onClick={handleZoomOut}
        disabled={scale <= ZOOM_PRESETS[0]}
        className="p-2 hover:bg-slate-700 rounded text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Zoom Out"
      >
        <ZoomOut size={16} />
      </button>
      
      <div className="px-2 min-w-[50px] text-center">
        <span className="text-xs font-mono text-gray-400">
          {Math.round(scale * 100)}%
        </span>
      </div>
      
      <button
        onClick={handleZoomIn}
        disabled={scale >= ZOOM_PRESETS[ZOOM_PRESETS.length - 1]}
        className="p-2 hover:bg-slate-700 rounded text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Zoom In"
      >
        <ZoomIn size={16} />
      </button>
      
      <div className="w-px h-6 bg-slate-600 mx-1" />
      
      <button
        onClick={handleFitToScreen}
        className="p-2 hover:bg-slate-700 rounded text-gray-300 transition-colors"
        title="Fit to Screen"
      >
        <Maximize2 size={16} />
      </button>
    </div>
  );
};

export default ZoomControls;
