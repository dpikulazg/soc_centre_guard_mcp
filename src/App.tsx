/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { HeroSection } from './components/sections/HeroSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { DashboardPreview } from './components/dashboard/DashboardPreview';
import { TechStackSection } from './components/sections/TechStackSection';
import { LokiAdminSection } from './components/sections/LokiAdminSection';
import { DocumentationSection } from './components/sections/DocumentationSection';
import { LoginPage } from './components/auth/LoginPage';
import { SOCDashboard } from './components/dashboard/SOCDashboard';

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('guard_soc_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
  }, []);

  const handleLogin = (token: string, userData: any) => {
    localStorage.setItem('guard_soc_token', token);
    localStorage.setItem('guard_soc_user', JSON.stringify(userData));
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('guard_soc_token');
    localStorage.removeItem('guard_soc_user');
    setUser(null);
    setView('landing');
  };

  if (view === 'login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (view === 'dashboard' && user) {
    return <SOCDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans relative selection:bg-cyan-500/30">
      {/* Background Atmosphere */}
      <div className="fixed top-0 left-0 w-full h-full opacity-30 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-900/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-900/30 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-10 py-6 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md">
        <a href="#" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            <div className="w-4 h-4 border-2 border-white rotate-45"></div>
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">GUARD<span className="text-cyan-400">MCP</span></span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Usluge</a>
          <a href="#dashboard" className="hover:text-white transition-colors">Tehnologija</a>
          <a href="#loki-admin" className="hover:text-white transition-colors">Loki Admin</a>
          <a href="#docs" className="hover:text-white transition-colors">Dokumentacija</a>
          <button 
            onClick={() => setView('login')}
            className="px-6 py-2 bg-slate-950 text-cyan-400 border border-cyan-500/50 rounded-sm font-mono text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all relative overflow-hidden group"
          >
            <span className="relative z-10">SOC Access</span>
            <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-[100px]">
        <HeroSection />
        <FeaturesSection />
        <DashboardPreview />
        <LokiAdminSection />
        <TechStackSection />
        <DocumentationSection />
      </main>

      {/* Footer Data Strip */}
      <footer className="relative z-10 bg-slate-900/80 border-t border-slate-800 px-10 py-4 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-slate-500 tracking-wider">
        <div className="flex flex-wrap gap-4 md:gap-8 mb-2 md:mb-0">
          <div>ENDPOINT SCAN: <span className="text-slate-300">READY</span></div>
          <div>LATENCY: <span className="text-slate-300">14ms</span></div>
          <div>ENCRYPTION: <span className="text-emerald-500">AES-256 ACTIVE</span></div>
        </div>
        <div className="text-slate-400 italic">Copyright &copy; {new Date().getFullYear()} GuardMCP B2B Systems. Powered by LOKI & YARA.</div>
      </footer>
    </div>
  );
}

