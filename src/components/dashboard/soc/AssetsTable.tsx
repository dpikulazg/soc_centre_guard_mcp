import React, { useState, useEffect } from 'react';
import { Server, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

export function AssetsTable() {
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/soc/assets')
      .then(res => res.json())
      .then(data => setAssets(data));
  }, []);

  return (
    <div className="bg-[#1e293b]/20 border border-slate-800/50 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-3">
          <Server size={20} className="text-cyan-400" />
          Critical Asset Register
        </h3>
        <span className="text-xs text-slate-500 font-mono italic">Fleet coverage: 100%</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#1e293b]/40 border-b border-slate-800/50">
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Asset Name</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Type</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Risk Profile</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Protection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {assets.map(asset => (
              <tr key={asset.id} className="hover:bg-slate-800/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${asset.risk === 'High' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                    <span className="text-sm font-medium text-slate-300">{asset.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2 py-1 bg-slate-800 rounded font-mono text-slate-400 uppercase tracking-tighter">{asset.type}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${asset.risk === 'High' ? 'bg-red-500' : asset.risk === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: asset.risk === 'High' ? '90%' : asset.risk === 'Medium' ? '50%' : '15%' }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 w-10 text-right">{asset.risk}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`flex items-center gap-2 ${asset.status === 'Infected' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {asset.status === 'Infected' ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                    <span className="text-xs font-bold uppercase tracking-wider">{asset.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
