import React, { useState, useEffect } from 'react';
import { History, User, Clock } from 'lucide-react';

interface HistoryItem {
  id: string;
  user: string;
  action: string;
  target: string;
  date: string;
}

interface HistoryLogProps {
  full?: boolean;
}

export function HistoryLog({ full }: HistoryLogProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    fetch('/api/soc/history')
      .then(res => res.json())
      .then(data => setHistory(data));
  }, []);

  return (
    <div className={`bg-[#1e293b]/20 border border-slate-800/50 rounded-2xl overflow-hidden flex flex-col ${full ? 'h-full' : 'h-[400px]'}`}>
      <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-[#1e293b]/40">
        <h3 className="text-lg font-bold text-white flex items-center gap-3">
          <History size={20} className="text-purple-400" />
          Audit Trail
        </h3>
        <button className="text-[10px] uppercase font-bold text-slate-500 hover:text-white transition-colors">Export Logs</button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {history.map((item, i) => (
          <div key={item.id} className="flex gap-4 relative group">
            {i !== history.length - 1 && (
              <div className="absolute left-4 top-8 bottom-[-24px] w-0.5 bg-slate-800/50 group-hover:bg-slate-700 transition-colors"></div>
            )}
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 z-10">
              <User size={14} className="text-slate-400" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">{item.action}</span>
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                   <Clock size={10} />
                   {new Date(item.date).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                By <span className="text-cyan-400 font-mono">{item.user}</span> on target <span className="text-white font-mono bg-slate-800/50 px-1.5 py-0.5 rounded">{item.target}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
