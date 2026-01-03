import React from 'react';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';

interface ZoomControlsProps {
  scale: number;
  setScale: (scale: number) => void;
  onFit: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ scale, setScale, onFit }) => {
  return (
    <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-surface/90 backdrop-blur border border-gray-700 p-1.5 rounded-lg shadow-xl z-50">
      <button 
        onClick={() => setScale(Math.max(0.1, scale - 0.1))}
        className="p-2 hover:bg-white/10 rounded text-gray-300 hover:text-white transition-colors"
        title="Zoom Out"
      >
        <ZoomOut size={18} />
      </button>
      
      <span className="w-12 text-center text-xs font-mono font-medium text-primary">
        {Math.round(scale * 100)}%
      </span>
      
      <button 
        onClick={() => setScale(Math.min(5, scale + 0.1))}
        className="p-2 hover:bg-white/10 rounded text-gray-300 hover:text-white transition-colors"
        title="Zoom In"
      >
        <ZoomIn size={18} />
      </button>

      <div className="w-px h-4 bg-gray-700 mx-1" />

      <button 
        onClick={onFit}
        className="p-2 hover:bg-white/10 rounded text-gray-300 hover:text-white transition-colors"
        title="Fit to Screen"
      >
        <Maximize size={18} />
      </button>
      
       <button 
        onClick={() => setScale(1)}
        className="p-2 hover:bg-white/10 rounded text-gray-300 hover:text-white transition-colors"
        title="Reset 100%"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
};

export default ZoomControls;