import React, { useState } from 'react';
import { Settings, Sparkles, X, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDevToolsStore } from '../store/devToolsStore';

const DevToolsMini: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { showAIStubs, toggleAIStubs } = useDevToolsStore();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-12 right-0 mb-2 w-64 bg-[#1a1b1e] border border-gray-700 rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-orange-500" />
                <span className="text-xs font-bold text-gray-200">DevTools Mini</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="p-3 space-y-3">
              {/* AI Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-300">
                  <Sparkles size={14} className={showAIStubs ? "text-teal-400" : "text-gray-600"} />
                  <span className="text-xs font-medium">Show AI Stubs</span>
                </div>
                
                <button
                  onClick={toggleAIStubs}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    showAIStubs ? 'bg-teal-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      showAIStubs ? 'translate-x-4.5' : 'translate-x-1'
                    }`}
                    style={{ translateX: showAIStubs ? '20px' : '2px' }}
                  />
                </button>
              </div>
              
              <div className="text-[10px] text-gray-500 italic pt-1 border-t border-gray-800">
                Mëku Studio v0.1.2 (Dev)
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg border transition-colors ${
          isOpen 
            ? 'bg-orange-600 border-orange-400 text-white' 
            : 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
        }`}
      >
        <Settings size={20} className={isOpen ? "animate-spin-slow" : ""} />
      </motion.button>
    </div>
  );
};

export default DevToolsMini;