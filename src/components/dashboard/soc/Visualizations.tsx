import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, BarChart3 } from 'lucide-react';

const eventTrendData = [
  { time: '00:00', events: 12 },
  { time: '04:00', events: 8 },
  { time: '08:00', events: 45 },
  { time: '12:00', events: 32 },
  { time: '16:00', events: 56 },
  { time: '20:00', events: 24 },
  { time: '23:59', events: 18 },
];

const severityData = [
  { name: 'Critical', value: 4, fill: '#ef4444' },
  { name: 'High', value: 12, fill: '#f59e0b' },
  { name: 'Medium', value: 24, fill: '#22d3ee' },
  { name: 'Low', value: 64, fill: '#10b981' },
];

export function Visualizations() {
  return (
    <div className="space-y-10 h-full">
      <div className="bg-[#1e293b]/20 border border-slate-800/50 rounded-2xl p-6 h-[400px] flex flex-col backdrop-blur-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-white flex items-center gap-3">
            <Activity size={20} className="text-cyan-400" />
            Threat Activity Trend
          </h3>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Live 24h Telemetry</span>
        </div>
        
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={eventTrendData}>
              <defs>
                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px', borderRadius: '8px' }}
                itemStyle={{ color: '#22d3ee' }}
              />
              <Area 
                type="monotone" 
                dataKey="events" 
                stroke="#22d3ee" 
                fillOpacity={1} 
                fill="url(#colorEvents)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#1e293b]/20 border border-slate-800/50 rounded-2xl p-6 flex flex-col backdrop-blur-sm h-[300px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-3">
            <BarChart3 size={20} className="text-amber-400" />
            Severity Distribution
          </h3>
        </div>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severityData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                width={60}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '10px' }}
                cursor={{ fill: '#1e293b', opacity: 0.4 }}
              />
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
