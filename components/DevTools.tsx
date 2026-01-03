import React, { useState, useEffect } from 'react';
import { X, Activity, Database, Palette, Flag, Terminal, Info, Globe, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { INITIAL_FLAGS, API_REGISTRY, MOCK_USER } from '../constants';

interface DevToolsProps {
  isOpen: boolean;
  onClose: () => void;
}

const DevTools: React.FC<DevToolsProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'env' | 'flags' | 'api' | 'colors'>('env');
  const [flags, setFlags] = useState(INITIAL_FLAGS);
  const [masterLinkStatus, setMasterLinkStatus] = useState<'disconnected' | 'connecting' | 'linked'>('disconnected');
  
  // Simple heuristic to detect environment
  const hostname = window.location.hostname;
  const isGithubPages = hostname.includes('github.io');
  const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  const detectedEnv = isGithubPages ? 'GitHub Pages' : isLocal ? 'Localhost' : 'Unknown / GIAS';

  // Integration: Listen for Master DevTools
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // In a real implementation, you would check event.origin for security
      if (event.data?.type === 'MASTER_DEVTOOLS_PING') {
        setMasterLinkStatus('linked');
        console.log("MeKu Builder: Connected to Master DevTools");
      }
    };
    
    // Simulate a check/listen
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!isOpen) return null;

  const toggleFlag = (key: string) => {
    setFlags(prev => prev.map(f => f.key === key ? { ...f, value: !f.value } : f));
  };

  const TabButton = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
        activeTab === id 
          ? 'bg-surface text-primary border-t-2 border-primary' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={14} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl h-[600px] bg-background border border-gray-700 shadow-2xl rounded-t-xl sm:rounded-xl pointer-events-auto flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-black/20">
          <div className="flex items-center space-x-3">
            <Terminal className="text-primary" size={20} />
            <h2 className="text-lg font-bold text-white tracking-wide">MeKu DevTools</h2>
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/30">v0.1.2</span>
            
            {/* Master Link Status */}
            <div className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
              masterLinkStatus === 'linked' ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-gray-800 text-gray-500 border border-gray-700'
            }`}>
              <LinkIcon size={10} />
              <span>{masterLinkStatus === 'linked' ? 'Master Linked' : 'Standalone'}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 border-b border-gray-700 bg-black/10 mt-2">
          <TabButton id="env" icon={Info} label="Environment" />
          <TabButton id="flags" icon={Flag} label="Feature Flags" />
          <TabButton id="api" icon={Database} label="API Registry" />
          <TabButton id="colors" icon={Palette} label="Color Tokens" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-surface/50">
          
          {activeTab === 'env' && (
            <div className="space-y-6">
              <div className="bg-black/30 p-4 rounded-lg border border-gray-700 font-mono text-sm">
                <h3 className="text-gray-400 mb-2 uppercase text-xs font-bold tracking-wider flex items-center gap-2">
                  <Globe size={12} /> Deployment Context
                </h3>
                <div className="grid grid-cols-2 gap-y-2">
                  <span className="text-secondary">Detected Host:</span>
                  <span className="text-white">{hostname}</span>
                  <span className="text-secondary">Environment:</span>
                  <span className={`${isGithubPages ? 'text-purple-400' : 'text-green-400'}`}>{detectedEnv}</span>
                  <span className="text-secondary">Base Path:</span>
                  <span className="text-orange-300">{window.location.pathname}</span>
                  <span className="text-secondary">Master DevTools:</span>
                  <span className={masterLinkStatus === 'linked' ? 'text-green-400' : 'text-red-400'}>
                    {masterLinkStatus === 'linked' ? 'Connected' : 'Not Detected'}
                  </span>
                </div>
              </div>

              {isGithubPages && (
                <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <h4 className="text-blue-300 text-sm font-bold">GitHub Pages Detected</h4>
                    <p className="text-xs text-blue-200/70 mt-1">
                      Running in static mode. Some dynamic backend features (Supabase) will be mocked automatically.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-black/30 p-4 rounded-lg border border-gray-700 font-mono text-sm">
                <h3 className="text-gray-400 mb-2 uppercase text-xs font-bold tracking-wider">Build Info</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  <span className="text-secondary">App Version:</span>
                  <span className="text-white">v0.1.2-reboot</span>
                  <span className="text-secondary">React Version:</span>
                  <span className="text-white">18.2.0</span>
                  <span className="text-secondary">User ID:</span>
                  <span className="text-accent">{MOCK_USER.id}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flags' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flags.map((flag) => (
                <div key={flag.key} className="flex items-start justify-between p-4 bg-black/30 border border-gray-700 rounded-lg hover:border-gray-500 transition-colors">
                  <div>
                    <h4 className="font-mono text-sm font-bold text-white">{flag.key}</h4>
                    <p className="text-xs text-gray-400 mt-1">{flag.description}</p>
                  </div>
                  <button 
                    onClick={() => toggleFlag(flag.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${flag.value ? 'bg-green-600' : 'bg-gray-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${flag.value ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'api' && (
            <div className="overflow-hidden rounded-lg border border-gray-700">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/40 text-gray-400 font-mono uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">API Name</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Purpose</th>
                    <th className="px-4 py-3">Auth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-black/20">
                  {API_REGISTRY.map((api, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{api.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${
                          api.status === 'live' ? 'bg-green-900/30 border-green-700 text-green-400' :
                          api.status === 'mock' ? 'bg-yellow-900/30 border-yellow-700 text-yellow-400' :
                          'bg-gray-800 border-gray-600 text-gray-400'
                        }`}>
                          {api.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{api.usedFor}</td>
                      <td className="px-4 py-3 font-mono text-xs text-secondary">{api.authType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Core Tokens</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {[
                    { name: 'primary', hex: '#f97316' },
                    { name: 'background', hex: '#0f172a' },
                    { name: 'surface', hex: '#1e293b' },
                    { name: 'secondary', hex: '#64748b' },
                    { name: 'accent', hex: '#38bdf8' },
                  ].map((color) => (
                    <div key={color.name} className="flex flex-col items-center">
                      <div className="w-full h-12 rounded-lg shadow-md border border-white/10 mb-2" style={{ backgroundColor: color.hex }} />
                      <span className="text-xs font-medium text-white">{color.name}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{color.hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevTools;