import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileBox, 
  Search, 
  Filter, 
  Plus, 
  ArrowUpRight, 
  SortAsc, 
  MoreVertical,
  Briefcase,
  PieChart,
  Activity,
  AlertCircle
} from 'lucide-react';
import { CaseEditor } from './CaseEditor';
import { CaseAnalytics } from './CaseAnalytics';

export function CaseManagement() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'analytics'>('list');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await fetch('/api/soc/cases');
      const data = await res.json();
      setCases(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch cases', err);
    }
  };

  const handleSaveCase = async (updatedCase: any) => {
    try {
      const res = await fetch(`/api/soc/cases/${updatedCase.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCase)
      });
      const data = await res.json();
      setCases(cases.map(c => c.id === data.id ? data : c));
      setSelectedCase(null);
    } catch (err) {
      console.error('Failed to update case', err);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Action Bar */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex bg-[#1e293b]/40 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-1.5 text-xs font-bold rounded flex items-center gap-2 transition-all ${
              viewMode === 'list' ? 'bg-cyan-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Briefcase size={14} /> Case List
          </button>
          <button 
            onClick={() => setViewMode('analytics')}
            className={`px-4 py-1.5 text-xs font-bold rounded flex items-center gap-2 transition-all ${
              viewMode === 'analytics' ? 'bg-cyan-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <PieChart size={14} /> System Analytics
          </button>
        </div>

        <div className="flex items-center gap-4">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
             <input type="text" placeholder="Filter cases..." className="bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-400 focus:outline-none focus:border-cyan-500/50 w-64" />
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-700 transition-all">
             <Filter size={14} /> Global Filters
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]">
             <Plus size={14} /> Create New Case
           </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="flex-1 bg-[#1e293b]/20 border border-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col">
          <div className="overflow-auto custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#0f172a] z-10">
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID / Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name / Summary</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Threat Level</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Timeline</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-6"><div className="h-4 bg-white/5 rounded-full w-full"></div></td>
                    </tr>
                  ))
                ) : (
                  cases.map(item => (
                    <tr key={item.id} className="hover:bg-cyan-500/[0.02] transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-mono font-bold text-slate-500">#{item.id}</span>
                          <span className="text-[10px] font-bold uppercase py-0.5 px-2 bg-cyan-500/10 text-cyan-400 rounded-sm w-fit border border-cyan-500/20">{item.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 max-w-md">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{item.name}</span>
                          <p className="text-xs text-slate-500 truncate italic">{item.summary}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col items-center gap-1.5">
                           <div className="flex gap-1">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className={`w-1 h-3 rounded-full ${i < 2 ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'bg-slate-800'}`}></div>
                              ))}
                           </div>
                           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{item.priority.split(' ')[0]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                         <div className="flex flex-col gap-1 font-mono">
                            <span className="text-xs text-slate-400 italic">Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                            <span className="text-[10px] text-slate-600">Events: {item.events?.length || 0}</span>
                         </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                         <div className="flex items-center justify-end gap-3">
                           <button 
                             onClick={() => setSelectedCase(item)}
                             className="p-2 hover:bg-cyan-500/20 text-slate-500 hover:text-cyan-400 rounded-lg transition-all"
                           >
                             <ArrowUpRight size={18} />
                           </button>
                           <button className="p-2 hover:bg-slate-800 text-slate-500 hover:text-white rounded-lg transition-all">
                             <MoreVertical size={18} />
                           </button>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="h-12 border-t border-white/5 bg-[#0f172a] flex items-center justify-between px-6 shrink-0">
             <span className="text-[10px] font-mono text-slate-600">SYS_TOTAL_RECORDS: {cases.length}</span>
             <div className="flex items-center gap-2">
               <button className="px-3 py-1 bg-slate-900 border border-white/5 text-[10px] font-bold text-slate-500 rounded disabled:opacity-50" disabled>PREV</button>
               <button className="px-3 py-1 bg-slate-900 border border-white/5 text-[10px] font-bold text-slate-500 rounded">NEXT</button>
             </div>
          </div>
        </div>
      ) : (
        <CaseAnalytics cases={cases} />
      )}

      {selectedCase && (
        <CaseEditor 
          caseData={selectedCase} 
          onSave={handleSaveCase} 
          onClose={() => setSelectedCase(null)} 
        />
      )}
    </div>
  );
}
