import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Bell, 
  Shield, 
  Terminal, 
  Settings, 
  LogOut, 
  Search, 
  Filter, 
  ChevronDown, 
  ExternalLink,
  Activity,
  Server,
  History,
  FileCode,
  Briefcase
} from 'lucide-react';
import { AlertQueue } from './soc/AlertQueue';
import { StatsGrid } from './soc/StatsGrid';
import { AssetsTable } from './soc/AssetsTable';
import { HistoryLog } from './soc/HistoryLog';
import { Visualizations } from './soc/Visualizations';
import { CaseManagement } from './soc/CaseManagement';

interface SOCDashboardProps {
  user: any;
  onLogout: () => void;
}

export function SOCDashboard({ user, onLogout }: SOCDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/soc/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'alerts', label: 'Alert queue', icon: Bell, count: stats?.activeAlerts },
    { id: 'siem', label: 'SIEM', icon: Shield },
    { id: 'cases', label: 'Case reports', icon: Briefcase },
    { id: 'assets', label: 'Affected Assets', icon: Server },
    { id: 'history', label: 'Change History', icon: History },
    { id: 'yara', label: 'YARA Rules', icon: FileCode },
  ];

  return (
    <div className="flex bg-[#0f172a] text-slate-300 min-h-screen font-sans">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800/50 bg-[#1e293b]/30 backdrop-blur-xl flex flex-col pt-10">
        <div className="px-6 mb-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              <Shield className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">GUARD<span className="text-cyan-400">SOC</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${
                activeTab === item.id 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[inset_0_0_10px_rgba(34,211,238,0.05)]' 
                  : 'hover:bg-slate-800/50 text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={activeTab === item.id ? 'text-cyan-400' : 'group-hover:text-slate-300'} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === item.id ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Exit simulation</span>
          </button>
          <div className="mt-4 px-4 py-2 bg-slate-900/50 rounded flex items-center gap-3 border border-slate-800/30">
            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
              <User size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-tight">{user.username}</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">{user.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-10 bg-[#0f172a]/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h2>
            {activeTab === 'alerts' && (
               <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: '40%' }}
                    />
                  </div>
                  <span className="text-slate-500">2 alerts incoming</span>
               </div>
            )}
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
               <input 
                type="text" 
                placeholder="Search resources..."
                className="bg-slate-900/50 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 w-64 transition-all"
               />
             </div>
             <button className="p-2 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors relative">
               <Bell size={18} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a]"></span>
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]">
               Write case report
             </button>
          </div>
        </header>

        {/* Dynamic Section Container */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-10">
                  <StatsGrid stats={stats} />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <Visualizations />
                    <HistoryLog />
                  </div>
                  <AlertQueue compact />
                </div>
              )}
              {activeTab === 'alerts' && <AlertQueue />}
              {activeTab === 'cases' && <CaseManagement />}
              {activeTab === 'assets' && <AssetsTable />}
              {activeTab === 'history' && <HistoryLog full />}
              {activeTab === 'yara' && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
                    <FileCode className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">YARA Control Terminal</h3>
                    <p className="text-slate-500 max-w-md mx-auto mt-2">Manage detection patterns and deploy rules across the network fleet.</p>
                  </div>
                  <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/20 rounded-lg font-bold transition-all">
                    Open YARA Manager
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

const User = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
