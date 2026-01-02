import React from 'react';
import { BookOpen, FolderOpen, Save, Undo, Redo, Layout, Monitor, Download, Plus, Layers, Settings, FileText, Image as ImageIcon, Type } from 'lucide-react';
import { PageSize, Page } from '../types';
import { PAGE_SIZES, AVAILABLE_FONTS } from '../constants';

interface SidebarProps {
  pageSize: PageSize;
  setPageSize: (size: PageSize) => void;
  currentPage: Page;
  onAddBlock: (type: 'text' | 'image') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ pageSize, setPageSize, currentPage, onAddBlock }) => {
  return (
    <div className="w-80 bg-surface border-r border-gray-700 flex flex-col h-full overflow-hidden text-gray-200">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2 text-primary mb-4">
          <BookOpen size={24} />
          <h1 className="font-bold text-lg text-white">Storybook Builder</h1>
        </div>

        {/* Quick Actions Toolbar */}
        <div className="flex flex-wrap gap-2">
          <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white" title="New Page"><Plus size={16} /></button>
          <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white" title="Open Project"><FolderOpen size={16} /></button>
          <div className="w-px h-8 bg-gray-600 mx-1"></div>
          <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white" title="Undo"><Undo size={16} /></button>
          <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white" title="Redo"><Redo size={16} /></button>
          <button className="px-3 py-2 bg-primary hover:bg-orange-600 text-white rounded text-sm font-medium flex items-center gap-2 ml-auto">
            <Save size={14} /> Save
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Insert Section */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Insert</h3>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onAddBlock('text')}
              className="flex flex-col items-center justify-center p-4 bg-black/20 hover:bg-white/5 border border-gray-700 hover:border-primary/50 rounded-lg transition-all"
            >
              <Type className="text-blue-400 mb-2" size={24} />
              <span className="text-sm">Text Block</span>
            </button>
            <button 
              onClick={() => onAddBlock('image')}
              className="flex flex-col items-center justify-center p-4 bg-black/20 hover:bg-white/5 border border-gray-700 hover:border-primary/50 rounded-lg transition-all"
            >
              <ImageIcon className="text-green-400 mb-2" size={24} />
              <span className="text-sm">Image Asset</span>
            </button>
          </div>
        </section>

        {/* Page Settings */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Page Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-secondary mb-1">Page Size</label>
              <select 
                value={pageSize} 
                onChange={(e) => setPageSize(e.target.value as PageSize)}
                className="w-full bg-black/30 border border-gray-700 rounded px-3 py-2 text-sm focus:border-primary outline-none"
              >
                {Object.entries(PAGE_SIZES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            
             <div>
              <label className="block text-xs text-secondary mb-1">Orientation</label>
              <select className="w-full bg-black/30 border border-gray-700 rounded px-3 py-2 text-sm focus:border-primary outline-none">
                <option>Portrait</option>
                <option>Landscape</option>
              </select>
            </div>
          </div>
        </section>

        {/* Layout Presets */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Layout Presets</h3>
            <span className="text-[10px] bg-gray-700 px-1.5 rounded text-gray-300">Basic</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '1x1', icon: <div className="border border-current w-4 h-5"></div>, label: '1x1' },
              { id: '1x2', icon: <div className="border border-current w-4 h-5 flex flex-col"><div className="h-1/2 border-b border-current"></div></div>, label: '1x2' },
              { id: '2x1', icon: <div className="border border-current w-4 h-5 flex"><div className="w-1/2 border-r border-current"></div></div>, label: '2x1' },
              { id: '2x2', icon: <div className="border border-current w-4 h-5 grid grid-cols-2 grid-rows-2"><div className="border-r border-b border-current"></div><div className="border-b border-current"></div><div className="border-r border-current"></div></div>, label: '2x2' },
            ].map(preset => (
              <button key={preset.id} className="flex flex-col items-center justify-center p-2 bg-black/20 hover:bg-white/5 border border-gray-700 hover:border-primary rounded transition-colors group">
                <div className="text-gray-500 group-hover:text-primary mb-1">{preset.icon}</div>
                <span className="text-[10px] text-gray-400">{preset.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Typography (For active selection) */}
        <section>
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Typography Styles</h3>
           <div className="space-y-2">
             {AVAILABLE_FONTS.map(font => (
               <div key={font.name} className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer border border-transparent hover:border-gray-700">
                 <span style={{ fontFamily: font.name }} className="text-lg text-white">Story Text</span>
                 <span className="text-[10px] text-gray-500">{font.label}</span>
               </div>
             ))}
           </div>
        </section>

      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
        <span>Page {currentPage.index + 1} / 1</span>
        <span>Unsaved changes</span>
      </div>
    </div>
  );
};

export default Sidebar;