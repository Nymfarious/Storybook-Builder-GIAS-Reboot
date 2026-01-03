import React from 'react';
import { X, Info, Server, Zap, Database, Shield } from 'lucide-react';
import { APP_NAME, APP_VERSION, APP_CODENAME, ENVIRONMENT, API_REGISTRY, DEFAULT_FEATURE_FLAGS } from '../constants';

interface DevToolsProps {
  isOpen: boolean;
  onClose: () => void;
}

const DevTools: React.FC<DevToolsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[80vh] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Zap size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">DevTools Panel</h2>
              <p className="text-[10px] text-gray-500">Ctrl+D to toggle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          
          {/* App Info */}
          <section className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Info size={14} className="text-blue-400" />
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Application</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-500">Name</span>
                <p className="text-white font-medium">{APP_NAME}</p>
              </div>
              <div>
                <span className="text-gray-500">Version</span>
                <p className="text-white font-mono">{APP_VERSION} "{APP_CODENAME}"</p>
              </div>
              <div>
                <span className="text-gray-500">Environment</span>
                <p className={`font-medium ${ENVIRONMENT === 'localhost' ? 'text-green-400' : ENVIRONMENT === 'gh-pages' ? 'text-blue-400' : 'text-yellow-400'}`}>
                  {ENVIRONMENT}
                </p>
              </div>
              <div>
                <span className="text-gray-500">React</span>
                <p className="text-white font-mono">18.3.1</p>
              </div>
            </div>
          </section>

          {/* Feature Flags */}
          <section className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-yellow-400" />
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Feature Flags</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(DEFAULT_FEATURE_FLAGS).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-1">
                  <span className="text-xs text-gray-400">{key}</span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${value ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-500'}`}>
                    {value ? 'ON' : 'OFF'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* API Registry */}
          <section className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Server size={14} className="text-purple-400" />
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">API Registry</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500 border-b border-slate-700">
                    <th className="text-left py-2">Service</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Auth</th>
                  </tr>
                </thead>
                <tbody>
                  {API_REGISTRY.map((api, i) => (
                    <tr key={i} className="border-b border-slate-700/50">
                      <td className="py-2 text-gray-300">{api.name}</td>
                      <td className="py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          api.status === 'live' ? 'bg-green-500/20 text-green-400' :
                          api.status === 'mock' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {api.status}
                        </span>
                      </td>
                      <td className="py-2 text-gray-500 font-mono">{api.authType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Storage */}
          <section className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Database size={14} className="text-green-400" />
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Local Storage</h3>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-xs text-gray-300 transition-colors">
                Clear Story Data
              </button>
              <button className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-xs text-gray-300 transition-colors">
                Export State
              </button>
            </div>
          </section>

          {/* Security */}
          <section className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} className="text-red-400" />
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Security Notes</h3>
            </div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• API keys stored in Supabase secrets (not browser)</li>
              <li>• RLS policies enforce per-user data isolation</li>
              <li>• Edge Functions proxy all AI service calls</li>
            </ul>
          </section>

        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-800/50 border-t border-slate-700 text-[10px] text-gray-500 text-center">
          MeKu Storybook Builder • DevTools v{APP_VERSION}
        </div>
      </div>
    </div>
  );
};

export default DevTools;
