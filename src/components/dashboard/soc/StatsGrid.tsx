import React from 'react';
import { motion } from 'motion/react';
import { Shield, AlertTriangle, Cpu, Database, Activity } from 'lucide-react';

interface StatsGridProps {
  stats: any;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    { label: 'Security Score', value: '94%', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Alerts', value: stats?.activeAlerts || '0', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Network Load', value: '14.2 GB/s', icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Vulnerabilities', value: stats?.affectedAssets || '0', icon: Database, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-[#1e293b]/20 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-sm group hover:border-slate-700 transition-all cursor-default overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <card.icon size={64} />
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{card.label}</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{card.value}</h3>
            </div>
          </div>

          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
             <motion.div 
               className={`h-full ${card.bg.replace('/10', '')}`}
               initial={{ width: 0 }}
               animate={{ width: '70%' }}
               transition={{ duration: 1.5, delay: i * 0.1 }}
             />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
