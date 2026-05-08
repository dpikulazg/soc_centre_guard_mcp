import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Shield, Target, Clock, AlertCircle } from 'lucide-react';

interface CaseAnalyticsProps {
  cases: any[];
}

export function CaseAnalytics({ cases }: CaseAnalyticsProps) {
  // Mock data derived from cases
  const caseTypeData = [
    { name: 'Malware', value: cases.filter(c => c.type === 'Malware').length + 5 },
    { name: 'Phishing', value: 8 },
    { name: 'Vuln', value: 3 },
    { name: 'DDoS', value: 2 },
  ];

  const COLORS = ['#22d3ee', '#10b981', '#f59e0b', '#ef4444'];

  const timelineData = [
    { day: 'Mon', active: 4, resolved: 2 },
    { day: 'Tue', active: 6, resolved: 5 },
    { day: 'Wed', active: 8, resolved: 3 },
    { day: 'Thu', active: 5, resolved: 7 },
    { day: 'Fri', active: 10, resolved: 4 },
  ];

  const stats = [
    { label: 'MTTD', value: '14m', icon: Clock, color: 'text-cyan-400' },
    { label: 'MTTR', value: '4.2h', icon: Shield, color: 'text-emerald-500' },
    { label: 'System Health', value: '98.5%', icon: Target, color: 'text-white' },
    { label: 'Active Threats', value: '12', icon: AlertCircle, color: 'text-red-500' },
  ];

  return (
    <div className="flex-1 flex flex-col space-y-10 overflow-y-auto custom-scrollbar pb-10">
      {/* Real-time Ticker stats */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-[#1e293b]/20 border border-white/5 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md group hover:border-white/10 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 translate-x-2 translate-y-[-2px]">
               <stat.icon size={48} />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h4 className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</h4>
              <span className="text-[10px] text-slate-600 font-mono">/ LIVE TRANSMISSION</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Case Type Dist */}
        <div className="lg:col-span-1 bg-[#1e293b]/20 border border-white/5 rounded-2xl p-8 flex flex-col h-[400px]">
           <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-10 flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
             Threat Sector Allocation
           </h3>
           <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={caseTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {caseTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    />
                 </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="grid grid-cols-2 gap-4 mt-6">
              {caseTypeData.map((type, i) => (
                <div key={type.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{type.name}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Resolution Timeline */}
        <div className="lg:col-span-2 bg-[#1e293b]/20 border border-white/5 rounded-2xl p-8 flex flex-col h-[400px]">
           <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-10 flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
             Operational Velocity (Event Flow)
           </h3>
           <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="day" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Line type="monotone" dataKey="active" stroke="#22d3ee" strokeWidth={4} dot={{ r: 4, fill: '#22d3ee' }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981' }} />
                 </LineChart>
              </ResponsiveContainer>
           </div>
           <div className="flex gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-cyan-500"></div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Ongoing Invevstigations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-emerald-500"></div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Neutralized Nodes</span>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-[#1e293b]/10 border border-dash border-white/5 p-10 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
          <Shield size={32} className="text-slate-700" />
          <div>
            <p className="text-xs text-slate-600 font-mono uppercase tracking-[0.3em]">Neural Network State: NOMINAL</p>
            <p className="text-[10px] text-slate-800 mt-2 italic px-20">Analytics engine processing regional telemetry for anomalies. System is operating within expected parameters for the current threat cycle.</p>
          </div>
      </div>
    </div>
  );
}
