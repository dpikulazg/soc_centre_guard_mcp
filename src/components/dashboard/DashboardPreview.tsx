import { useState } from 'react';
import { NetworkMap } from './NetworkMap';
import { McpSidebar } from './McpSidebar';
import { YaraRuleManager } from './YaraRuleManager';
import { AgentAdmin } from './AgentAdmin';
import { Activity, Database, Cpu } from 'lucide-react';

export function DashboardPreview() {
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'network' | 'yara' | 'agents'>('network');

  const initialAssets = [
    { id: '1', name: 'DB-MAIN', status: 'infected', threatLevel: 85, iconClass: 'lucide-database', type: 'Database', isUnderAttack: true },
    { id: '2', name: 'API-GW', status: 'clean', threatLevel: 10, iconClass: 'lucide-server', type: 'Gateway', isUnderAttack: false },
    { id: '3', name: 'WEB-01', status: 'warning', threatLevel: 45, iconClass: 'lucide-globe', type: 'Web Server', isUnderAttack: false },
    { id: '4', name: 'AUTH-SVC', status: 'clean', threatLevel: 5, iconClass: 'lucide-lock', type: 'Service', isUnderAttack: false },
    { id: '5', name: 'WORKER-x', status: 'clean', threatLevel: 12, iconClass: 'lucide-cpu', type: 'Background node', isUnderAttack: false },
  ];

  return (
    <section className="py-24" id="dashboard">
      <div className="container mx-auto px-10 relative z-10">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
            <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">Interactive Admin Dashboard</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Složena sigurnost, jednostavna kontrola.</h2>
          <p className="text-slate-400 max-w-2xl text-lg mb-8">
            Interaktivni B2B administacijski panel nudi state-of-the-art pregled topologije mreže 
            uz integriranu AI analitiku.
          </p>
          
          {/* Dashboard Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800">
            <button 
              onClick={() => setActiveTab('network')}
              className={`flex items-center gap-2 px-6 py-3 font-mono text-sm tracking-wide transition-colors relative
                ${activeTab === 'network' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Activity className="w-4 h-4" />
              Network Topology
              {activeTab === 'network' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('agents')}
              className={`flex items-center gap-2 px-6 py-3 font-mono text-sm tracking-wide transition-colors relative
                ${activeTab === 'agents' ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Cpu className="w-4 h-4" />
              Node & Agent Admin
              {activeTab === 'agents' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('yara')}
              className={`flex items-center gap-2 px-6 py-3 font-mono text-sm tracking-wide transition-colors relative
                ${activeTab === 'yara' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Database className="w-4 h-4" />
              YARA Rulesets
              {activeTab === 'yara' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              )}
            </button>
          </div>
        </div>

        <div className="border border-slate-800/80 rounded-b-2xl overflow-hidden bg-slate-900/60 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col md:flex-row h-[700px] relative backdrop-blur-sm -mt-12 rounded-tr-2xl">
          {activeTab === 'network' ? (
            <>
              {/* Main Visualization Canvas */}
              <div className="flex-1 relative">
                <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="font-mono text-sm tracking-wider uppercase text-slate-300">GuardMCP Enterprise // Node Viewer</span>
                  </div>
                  <div className="bg-slate-900 px-3 py-1 rounded font-mono text-xs text-cyan-400 border border-cyan-500/30 flex items-center gap-2 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    Active Agents: 4
                  </div>
                </header>
                
                <NetworkMap assets={initialAssets} onSelectNode={setSelectedAsset} />
              </div>

              {/* Context Sidebar Desktop */}
              <div className="hidden md:block w-96 border-l border-slate-800/80 bg-slate-950/90 overflow-y-auto z-10 relative">
                <McpSidebar asset={selectedAsset} />
              </div>
            </>
          ) : activeTab === 'agents' ? (
            <AgentAdmin />
          ) : (
            <YaraRuleManager />
          )}
        </div>
      </div>
    </section>
  );
}
