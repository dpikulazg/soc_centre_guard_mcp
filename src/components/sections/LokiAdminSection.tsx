import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Settings, Sliders, Activity, HardDrive, Cpu, Terminal, Play, Square, Code, Command } from 'lucide-react';

export function LokiAdminSection() {
  const [engineStatus, setEngineStatus] = useState<'running' | 'stopped' | 'configuring'>('running');

  return (
    <section className="py-24 border-t border-slate-800 bg-slate-900/30" id="loki-admin">
      <div className="container mx-auto px-10 relative z-10">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">LOKI Engine Configuration</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Administracija LOKI Scannera.</h2>
          <p className="text-slate-400 max-w-2xl text-lg">
             Konfigurirajte parametre dubinskog skeniranja, performanse i forenzičke module centralnog LOKI enginea.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Engine Status & Quick Actions */}
          <div className="col-span-1 border border-slate-800/80 rounded-2xl bg-slate-950/80 p-6 flex flex-col relative overflow-hidden backdrop-blur-sm shadow-xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full"></div>
             
             <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                Status Sustava
             </h3>
             
             <div className="flex-1 flex flex-col items-center justify-center py-6">
                <div className="relative mb-6">
                   <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center ${engineStatus === 'running' ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : engineStatus === 'configuring' ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'border-slate-700'}`}>
                      <Shield className={`w-10 h-10 ${engineStatus === 'running' ? 'text-emerald-400 animate-pulse' : engineStatus === 'configuring' ? 'text-amber-400' : 'text-slate-500'}`} />
                   </div>
                   {engineStatus === 'running' && (
                     <div className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping"></div>
                   )}
                </div>
                <div className="text-center">
                   <div className="text-2xl font-bold font-mono text-white mb-1">
                     {engineStatus === 'running' ? 'AKTIVAN' : engineStatus === 'configuring' ? 'KONFIGURACIJA' : 'ISKLJUČEN'}
                   </div>
                   <div className="text-xs text-slate-500 uppercase tracking-widest font-mono">Engine Status</div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3 mt-6">
                <button 
                  onClick={() => setEngineStatus('running')}
                  className={`py-3 rounded-lg flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-[10px] transition-colors border ${engineStatus === 'running' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                >
                  <Play className="w-3 h-3" /> Pokreni
                </button>
                <button 
                  onClick={() => setEngineStatus('stopped')}
                  className={`py-3 rounded-lg flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-[10px] transition-colors border ${engineStatus === 'stopped' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                >
                  <Square className="w-3 h-3" /> Zaustavi
                </button>
             </div>
          </div>

          {/* Configuration Form */}
          <div className="col-span-1 lg:col-span-2 border border-slate-800/80 rounded-2xl bg-slate-950/80 p-6 flex flex-col relative overflow-hidden backdrop-blur-sm shadow-xl">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  Parametri Skeniranja
                </h3>
                <button 
                  onClick={() => { setEngineStatus('configuring'); setTimeout(() => setEngineStatus('running'), 1500) }}
                  className="px-4 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded uppercase font-bold text-[10px] tracking-widest hover:bg-cyan-500/20 transition-colors"
                >
                  Primijeni Konfiguraciju
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Performance Limits */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
                    <Sliders className="w-3 h-3" /> Ograničenja Resursa
                  </h4>
                  
                  <div className="space-y-2">
                     <label className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                       <span>CPU Max Usage</span>
                       <span className="text-cyan-400">75%</span>
                     </label>
                     <input type="range" min="10" max="100" defaultValue="75" className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  
                  <div className="space-y-2 pt-2">
                     <label className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                       <span>Memory Limit (MB)</span>
                       <span className="text-cyan-400">1024</span>
                     </label>
                     <input type="range" min="128" max="4096" defaultValue="1024" className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <input type="checkbox" id="nice-mode" defaultChecked className="accent-cyan-500 w-4 h-4 rounded border-slate-700 bg-slate-900" />
                       <label htmlFor="nice-mode" className="text-xs font-mono text-slate-300">Intensive "Nice" Mode</label>
                     </div>
                  </div>
                </div>

                {/* Scan Modules */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
                    <Cpu className="w-3 h-3" /> Moduli Detekcije
                  </h4>
                  
                  <div className="space-y-3">
                     {[
                       { id: 'yara', label: 'YARA Signatures', checked: true },
                       { id: 'iocs', label: 'IOC Matching', checked: true },
                       { id: 'shc', label: 'SHC Parser', checked: true },
                       { id: 'pe', label: 'PE Forensics', checked: false }
                     ].map((mod) => (
                       <label key={mod.id} className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors">
                          <span className="text-xs font-mono text-slate-300">{mod.label}</span>
                          <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${mod.checked ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                             <div className={`w-3 h-3 rounded-full bg-white transition-transform ${mod.checked ? 'translate-x-4' : 'translate-x-0'}`}></div>
                          </div>
                       </label>
                     ))}
                  </div>
                </div>
             </div>
             
             {/* Command Preview */}
             <div className="mt-8 bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col gap-2 relative">
                <span className="absolute top-2 right-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Exec Preview</span>
                <div className="flex items-center gap-2 text-slate-500">
                  <Terminal className="w-4 h-4" />
                  <span className="text-xs font-mono">/usr/bin/loki</span>
                </div>
                <div className="font-mono text-xs text-emerald-400 pl-6 leading-relaxed">
                  --noproc --dontwait --onlyrelevant<br/>
                  --cpu-limit 75 --mem-limit 1024<br/>
                  --yarascan --iocscan
                </div>
             </div>

          </div>
        </div>
      </div>
    </section>
  );
}
