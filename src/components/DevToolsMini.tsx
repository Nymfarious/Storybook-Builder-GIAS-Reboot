import React, { useState } from 'react';
import { Wrench, X, Sparkles, Brain } from 'lucide-react';
import { useDevToolsStore } from '../store/devToolsStore';
import { analyzeStoryBeat } from '../utils/cognitiveEngine';
import { AIStub } from './ui/AIStub';

type TabId = 'stubs' | 'cognitive';

const DevToolsMini: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('stubs');
  
  const { 
    showAIStubs, 
    toggleAIStubs,
    lexicalLevel,
    conceptualLevel,
    setLexicalLevel,
    setConceptualLevel
  } = useDevToolsStore();

  const handleAnalyze = () => {
    const mockText = "The little fox ran through the forest. He was looking for his friend.";
    const result = analyzeStoryBeat(mockText);
    console.log('[Cognitive Engine] Analysis:', result);
    alert(`Analysis Complete!\n\nReading Age: ${result.estimatedReadingAge}\nLexical: ${result.lexicalScore}/5\nConceptual: ${result.conceptualScore}/5`);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-4 right-4 z-50
          p-3 rounded-full
          bg-slate-800 hover:bg-slate-700
          border border-slate-600 hover:border-primary
          text-gray-400 hover:text-primary
          shadow-xl hover:shadow-primary/20
          transition-all duration-200
          ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
        title="Open DevTools Mini"
      >
        <Wrench size={18} />
      </button>

      {/* Slide-up Panel */}
      {isOpen && (
        <div 
          className="fixed bottom-0 right-4 z-50 w-80 animate-in"
          style={{ animation: 'slideUp 0.2s ease-out' }}
        >
          <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-700 rounded-t-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Wrench size={14} className="text-primary" />
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">DevTools Mini</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-700 rounded text-gray-400 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => setActiveTab('stubs')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs transition-colors ${
                  activeTab === 'stubs' ? 'bg-slate-800 text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Sparkles size={12} />
                AI Stubs
              </button>
              <button
                onClick={() => setActiveTab('cognitive')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs transition-colors ${
                  activeTab === 'cognitive' ? 'bg-slate-800 text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Brain size={12} />
                Cognitive
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-64 overflow-y-auto custom-scrollbar">
              {activeTab === 'stubs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-300">Show AI Stubs</p>
                      <p className="text-[10px] text-gray-500">Toggle teal AI opportunity indicators</p>
                    </div>
                    <button
                      onClick={toggleAIStubs}
                      className={`w-10 h-5 rounded-full transition-colors relative ${showAIStubs ? 'bg-teal-500' : 'bg-gray-600'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${showAIStubs ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-700">
                    <p className="text-[10px] text-gray-500 mb-2">Preview:</p>
                    <AIStub label="Sample Stub" context="DevToolsMini.Preview" />
                  </div>
                </div>
              )}

              {activeTab === 'cognitive' && (
                <div className="space-y-4">
                  {/* Lexical Level */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-300">Lexical Level</span>
                      <span className="text-xs text-primary font-mono">{lexicalLevel}/5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={lexicalLevel}
                      onChange={(e) => setLexicalLevel(parseInt(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-[9px] text-gray-500">
                      <span>Sight Words</span>
                      <span>Advanced</span>
                    </div>
                  </div>

                  {/* Conceptual Level */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-300">Conceptual Level</span>
                      <span className="text-xs text-primary font-mono">{conceptualLevel}/5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={conceptualLevel}
                      onChange={(e) => setConceptualLevel(parseInt(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-[9px] text-gray-500">
                      <span>Concrete</span>
                      <span>Abstract</span>
                    </div>
                  </div>

                  {/* Analyze Button */}
                  <div className="pt-2 border-t border-slate-700">
                    <AIStub 
                      label="Analyze Current Page" 
                      context="Cognitive.Analyze" 
                      onClick={handleAnalyze}
                      size="md"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default DevToolsMini;
