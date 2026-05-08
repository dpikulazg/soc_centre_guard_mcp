import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MoreHorizontal, UserPlus, Filter, RotateCcw, ChevronDown } from 'lucide-react';

interface Alert {
  id: string;
  rule: string;
  severity: string;
  type: string;
  date: string;
  status: string;
}

interface AlertQueueProps {
  compact?: boolean;
}

export function AlertQueue({ compact }: AlertQueueProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/soc/events')
      .then(res => res.json())
      .then(data => {
        setAlerts(compact ? data.slice(0, 3) : data);
        setIsLoading(false);
      });
  }, [compact]);

  const severityColors: any = {
    High: 'text-amber-500',
    Medium: 'text-cyan-400',
    Low: 'text-emerald-500',
    Critical: 'text-red-500',
  };

  return (
    <div className="space-y-6">
      {!compact && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
           <div className="flex items-center gap-6">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search for an alert"
                  className="bg-slate-950 border border-slate-800 rounded-lg py-2 pl-4 pr-10 text-xs text-slate-300 w-64 focus:outline-none focus:border-cyan-500/50"
                />
             </div>
             <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors">
               <RotateCcw size={14} />
               Reset filters
             </button>
           </div>
           
           <div className="flex items-center gap-3">
             {['Severity', 'Status', 'Alert type'].map(filter => (
               <button key={filter} className="flex items-center gap-3 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors justify-between w-32">
                 <span>{filter}</span>
                 <ChevronDown size={14} />
               </button>
             ))}
             <div className="flex items-center gap-2 ml-4">
               <span className="text-[10px] text-slate-500 uppercase font-bold">Show</span>
               <select className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300">
                 <option>15</option>
                 <option>25</option>
                 <option>50</option>
               </select>
               <span className="text-[10px] text-slate-500 uppercase font-bold">alerts</span>
             </div>
           </div>
        </div>
      )}

      <div className="bg-[#1e293b]/20 border border-slate-800/50 rounded-xl overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/50 bg-[#1e293b]/40">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alert rule</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Severity</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="px-6 py-4"><div className="h-4 bg-slate-800/50 rounded w-full"></div></td>
                </tr>
              ))
            ) : (
              alerts.map(alert => (
                <tr key={alert.id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">{alert.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-300">{alert.rule}</td>
                  <td className={`px-6 py-4 text-xs font-bold ${severityColors[alert.severity] || 'text-slate-400'}`}>
                    {alert.severity}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">{alert.type}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{alert.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-2 w-fit ${
                      alert.status === 'Resolved' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${alert.status === 'Resolved' ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-1.5 hover:bg-slate-800 rounded transition-colors text-slate-500 hover:text-cyan-400">
                         <UserPlus size={16} />
                       </button>
                       <button className="p-1.5 hover:bg-slate-800 rounded transition-colors text-slate-500 hover:text-white">
                         <MoreHorizontal size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
