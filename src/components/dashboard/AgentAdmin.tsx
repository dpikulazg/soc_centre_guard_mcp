import { useState, useMemo } from 'react';
import { Server, Cpu, ShieldAlert, CheckCircle2, RefreshCw, Power, AlertTriangle, Play, Settings, Search, Filter, DownloadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NodeAgent {
  id: string;
  nodeName: string;
  ipAddress: string;
  type: string;
  agentVersion: string;
  status: 'online' | 'offline' | 'updating' | 'alert';
  lastPing: string;
  cpuUsage: number;
  memoryUsage: number;
}

const INITIAL_NODES: NodeAgent[] = [
  { id: 'n1', nodeName: 'DB-MAIN', ipAddress: '10.0.1.15', type: 'Database Node', agentVersion: 'v4.2.1-loki', status: 'alert', lastPing: '2s ago', cpuUsage: 78, memoryUsage: 64 },
  { id: 'n2', nodeName: 'API-GW', ipAddress: '10.0.2.15', type: 'Gateway', agentVersion: 'v4.2.1-loki', status: 'online', lastPing: '5s ago', cpuUsage: 34, memoryUsage: 45 },
  { id: 'n3', nodeName: 'WEB-01', ipAddress: '10.0.3.15', type: 'Web Server', agentVersion: 'v4.2.0-loki', status: 'updating', lastPing: '12s ago', cpuUsage: 92, memoryUsage: 80 },
  { id: 'n4', nodeName: 'AUTH-SVC', ipAddress: '10.0.4.15', type: 'Service', agentVersion: 'v4.2.1-loki', status: 'online', lastPing: '1s ago', cpuUsage: 15, memoryUsage: 25 },
  { id: 'n5', nodeName: 'WORKER-x', ipAddress: '10.0.5.15', type: 'Background Node', agentVersion: 'v4.1.9-loki', status: 'offline', lastPing: '5m ago', cpuUsage: 0, memoryUsage: 0 },
];

export function AgentAdmin() {
  const [nodes, setNodes] = useState<NodeAgent[]>(INITIAL_NODES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'updating' | 'alert'>('all');
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  
  const handleAction = (id: string, action: 'restart' | 'update' | 'stop') => {
    setNodes(nodes.map(n => {
      if (n.id === id) {
        if (action === 'restart') return { ...n, status: 'updating' };
        if (action === 'stop') return { ...n, status: 'offline', cpuUsage: 0, memoryUsage: 0 };
        if (action === 'update') return { ...n, status: 'updating', agentVersion: 'v4.2.1-loki' };
      }
      return n;
    }));

    if (action === 'restart' || action === 'update') {
      setTimeout(() => {
        setNodes(current => current.map(n => n.id === id ? { ...n, status: 'online', cpuUsage: 10, memoryUsage: 15, agentVersion: action === 'update' ? 'v4.2.1-loki' : n.agentVersion } : n));
      }, 3000);
    }
  };

  const handleBulkRestart = () => {
    setIsBulkProcessing(true);
    setNodes(current => current.map(n => {
      if (selectedNodeIds.includes(n.id) && n.status !== 'offline') {
        return { ...n, status: 'updating' };
      }
      return n;
    }));

    setTimeout(() => {
      setNodes(current => current.map(n => {
        if (selectedNodeIds.includes(n.id) && n.status === 'updating' && n.status !== 'offline') {
          return { ...n, status: 'online', cpuUsage: 10, memoryUsage: 15 };
        }
        return n;
      }));
      setIsBulkProcessing(false);
      setSelectedNodeIds([]);
    }, 3000);
  };

  const handleBulkUpdateSelected = () => {
    setIsBulkProcessing(true);
    setNodes(current => current.map(n => {
      if (selectedNodeIds.includes(n.id) && n.agentVersion !== 'v4.2.1-loki') {
        return { ...n, status: 'updating', agentVersion: 'v4.2.1-loki' };
      }
      return n;
    }));

    setTimeout(() => {
      setNodes(current => current.map(n => {
        if (selectedNodeIds.includes(n.id) && n.status === 'updating') {
          return { ...n, status: 'online' };
        }
        return n;
      }));
      setIsBulkProcessing(false);
      setSelectedNodeIds([]);
    }, 4000);
  };

  const handleBulkUpdate = () => {
    setIsBulkProcessing(true);
    setNodes(current => current.map(n => {
      if (n.agentVersion !== 'v4.2.1-loki' && n.status !== 'updating') {
        return { ...n, status: 'updating', agentVersion: 'v4.2.1-loki' };
      }
      return n;
    }));

    setTimeout(() => {
      setNodes(current => current.map(n => {
        if (n.status === 'updating' && n.agentVersion === 'v4.2.1-loki') {
          return { ...n, status: 'online' };
        }
        return n;
      }));
      setIsBulkProcessing(false);
    }, 4000);
  };

  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch = node.nodeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            node.ipAddress.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || node.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [nodes, searchTerm, statusFilter]);

  const outdatedCount = nodes.filter(n => n.agentVersion !== 'v4.2.1-loki' && n.status !== 'updating').length;

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'online': return <span className="flex items-center gap-1.5 text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest"><CheckCircle2 className="w-3 h-3" /> Online</span>;
      case 'offline': return <span className="flex items-center gap-1.5 text-slate-500 border border-slate-600/30 bg-slate-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest"><Power className="w-3 h-3" /> Offline</span>;
      case 'updating': return <span className="flex items-center gap-1.5 text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest"><RefreshCw className="w-3 h-3 animate-spin" /> Updating</span>;
      case 'alert': return <span className="flex items-center gap-1.5 text-red-400 border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest"><ShieldAlert className="w-3 h-3 animate-pulse" /> Alert</span>;
      default: return null;
    }
  };

  const [editingNode, setEditingNode] = useState<NodeAgent | null>(null);

  const saveEdit = (updatedNode: NodeAgent) => {
    setNodes(current => current.map(n => n.id === updatedNode.id ? updatedNode : n));
    setEditingNode(null);
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-950/20 text-slate-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/30 z-0"></div>
      
      <div className="p-6 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between z-10 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-400" /> MCP Nodes & Agents
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">B2B Centralized Agent Administration</p>
        </div>
        
        <div className="flex items-center gap-4">
           {selectedNodeIds.length > 0 ? (
             <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-slate-500 uppercase mr-2">{selectedNodeIds.length} Selected</span>
               <button 
                 onClick={handleBulkRestart} 
                 disabled={isBulkProcessing}
                 className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
               >
                 <RefreshCw className={`w-3 h-3 ${isBulkProcessing ? 'animate-spin' : ''}`} />
                 Restart
               </button>
               <button 
                 onClick={handleBulkUpdateSelected} 
                 disabled={isBulkProcessing}
                 className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
               >
                 <DownloadCloud className={`w-3 h-3 ${isBulkProcessing ? 'animate-bounce' : ''}`} />
                 Update
               </button>
             </div>
           ) : (
             outdatedCount > 0 && (
               <button 
                  onClick={handleBulkUpdate} 
                  disabled={isBulkProcessing}
                  className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                 <DownloadCloud className={`w-4 h-4 ${isBulkProcessing ? 'animate-bounce' : ''}`} />
                 Bulk Update All ({outdatedCount})
               </button>
             )
           )}
           <div className="flex flex-col items-end pl-4 border-l border-slate-800">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Status</span>
             <span className="text-emerald-400 text-xs font-mono">ALL SYSTEMS NOMINAL</span>
           </div>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/40 flex items-center gap-4 z-10 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by node name or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm font-mono focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-slate-300 placeholder-slate-600"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-purple-500/50 text-slate-300 appearance-none min-w-[120px]"
          >
            <option value="all">All Statuses</option>
            <option value="online">Online</option>
            <option value="alert">Alert</option>
            <option value="updating">Updating</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto z-10 relative">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 bg-slate-950/90 backdrop-blur z-20">
            <tr className="border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <th className="px-6 py-4 w-12">
                <input 
                  type="checkbox" 
                  checked={selectedNodeIds.length === filteredNodes.length && filteredNodes.length > 0} 
                  onChange={(e) => {
                    if (e.target.checked) setSelectedNodeIds(filteredNodes.map(n => n.id));
                    else setSelectedNodeIds([]);
                  }} 
                  className="rounded border-slate-700 bg-slate-900 focus:ring-purple-500/50 text-purple-500 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 font-mono">Node ID / Name</th>
              <th className="px-6 py-4 font-mono">IP & Type</th>
              <th className="px-6 py-4 font-mono">Agent Version</th>
              <th className="px-6 py-4 font-mono">Status & Telemetry</th>
              <th className="px-6 py-4 font-mono text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            <AnimatePresence>
              {filteredNodes.map((node) => (
                <motion.tr 
                  layout
                  key={node.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group hover:bg-slate-900/50 transition-colors"
                >
                  <td className="px-6 py-4 w-12">
                    <input 
                      type="checkbox" 
                      checked={selectedNodeIds.includes(node.id)} 
                      onChange={(e) => {
                        if (e.target.checked) setSelectedNodeIds(prev => [...prev, node.id]);
                        else setSelectedNodeIds(prev => prev.filter(id => id !== node.id));
                      }} 
                      className="rounded border-slate-700 bg-slate-900 focus:ring-purple-500/50 text-purple-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                         <Cpu className={`w-5 h-5 ${node.status === 'alert' ? 'text-red-400 animate-pulse' : 'text-slate-400 group-hover:text-purple-400'}`} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-200">{node.nodeName}</div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">ID: {node.id}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-xs font-mono text-slate-300">{node.ipAddress}</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{node.type}</div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300">
                      v{node.agentVersion}
                      {node.agentVersion !== 'v4.2.1-loki' && node.status !== 'updating' && (
                        <AlertTriangle className="w-3 h-3 text-amber-400 ml-1" title="Update available" />
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        {getStatusDisplay(node.status)}
                        <span className="text-[10px] font-mono text-slate-500">Ping: {node.lastPing}</span>
                      </div>
                      {node.status !== 'offline' && (
                        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
                          <div className="flex items-center gap-1.5 w-16 group/cpu relative cursor-default">
                            CPU: 
                            <span className={`${node.cpuUsage > 80 ? 'text-red-400' : 'text-emerald-400'}`}>{node.cpuUsage}%</span>
                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-slate-800 rounded-full overflow-hidden opacity-0 group-hover/cpu:opacity-100 transition-opacity">
                              <div className={`h-full ${node.cpuUsage > 80 ? 'bg-red-400' : 'bg-emerald-400'}`} style={{ width: `${node.cpuUsage}%` }}></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 group/mem relative cursor-default">
                            MEM: 
                            <span className={`${node.memoryUsage > 80 ? 'text-amber-400' : 'text-emerald-400'}`}>{node.memoryUsage}%</span>
                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-slate-800 rounded-full overflow-hidden opacity-0 group-hover/mem:opacity-100 transition-opacity">
                              <div className={`h-full ${node.memoryUsage > 80 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${node.memoryUsage}%` }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {node.status === 'offline' ? (
                        <button onClick={() => handleAction(node.id, 'restart')} title="Start Agent" className="p-2 rounded bg-slate-800 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors">
                          <Play className="w-4 h-4" />
                        </button>
                      ) : (
                        <>
                          <button onClick={() => handleAction(node.id, 'restart')} title="Restart Agent" className="p-2 rounded bg-slate-800 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors">
                            <RefreshCw className={`w-4 h-4 ${node.status === 'updating' ? 'animate-spin' : ''}`} />
                          </button>
                          <button onClick={() => handleAction(node.id, 'stop')} title="Stop Agent" className="p-2 rounded bg-slate-800 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors">
                            <Power className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {node.agentVersion !== 'v4.2.1-loki' && node.status !== 'updating' && (
                        <button onClick={() => handleAction(node.id, 'update')} className="px-3 py-1.5 rounded bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 text-nowrap transition-colors">
                          Update
                        </button>
                      )}
                      
                      <button 
                        onClick={() => setEditingNode(node)}
                        className="p-2 rounded bg-purple-900/20 text-purple-400 hover:text-purple-300 hover:bg-purple-900/40 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] ml-2 transition-all relative overflow-hidden group/btn"
                      >
                         <div className="absolute inset-0 bg-purple-400/10 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
                         <Settings className="w-4 h-4 relative z-10 group-hover/btn:rotate-90 transition-transform duration-500" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredNodes.length === 0 && (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-mono text-sm">
                    No nodes found matching your filters.
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {editingNode && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingNode(null)}
              className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm"
            />
            {/* Side Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-[101] bg-slate-900 border-l border-slate-700/80 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[30px] rounded-full mix-blend-screen"></div>
                <div className="flex items-center gap-3 relative z-10">
                   <Settings className="w-5 h-5 text-purple-400" />
                   <h3 className="font-mono text-sm font-bold text-white">Konfiguracija: {editingNode.nodeName}</h3>
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-1 bg-slate-950/30 space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Node Name</label>
                    <input 
                      type="text" 
                      value={editingNode.nodeName} 
                      onChange={(e) => setEditingNode({...editingNode, nodeName: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-slate-300 transition-all shadow-inner"
                    />
                 </div>
                 
                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">IP Address</label>
                    <input 
                      type="text" 
                      value={editingNode.ipAddress} 
                      onChange={(e) => setEditingNode({...editingNode, ipAddress: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-slate-300 transition-all shadow-inner"
                    />
                 </div>

                 <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Node Type</label>
                    <div className="relative">
                      <select 
                        value={editingNode.type}
                        onChange={(e) => setEditingNode({...editingNode, type: e.target.value})}
                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-slate-300 appearance-none transition-all shadow-inner"
                      >
                        <option value="Database Node">Database Node</option>
                        <option value="Gateway">Gateway</option>
                        <option value="Web Server">Web Server</option>
                        <option value="Service">Service</option>
                        <option value="Background Node">Background Node</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                 </div>

              </div>
              
              <div className="p-6 border-t border-slate-800 bg-slate-950/80 flex justify-end gap-3 shrink-0 relative">
                 <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
                 <button 
                   onClick={() => setEditingNode(null)} 
                   className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-700 hover:bg-slate-800 hover:text-slate-300 text-slate-400 transition-all"
                 >
                   Odustani
                 </button>
                 <button 
                   onClick={() => saveEdit(editingNode)} 
                   className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-purple-500/50 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all"
                 >
                   Spremi
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
