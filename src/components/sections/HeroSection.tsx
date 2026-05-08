import { motion } from 'motion/react';
import { Shield, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-100px)] flex items-center justify-center">
      <div className="container mx-auto px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Content Column */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center self-start gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">LOKI Engine Active v4.2</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white mb-6"
          >
            Slijedeća generacija <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Context-Aware</span> <br className="hidden md:block"/> kibernetičke sigurnosti
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl"
          >
            Automatizirano otkrivanje ranjivosti pomoću AI agenata i MCP protokola. Pokretano <span className="text-slate-200 italic">YARA-Room</span> metodologijom za maksimalnu preciznost u B2B okruženjima.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-4 max-w-md mb-8"
          >
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
              <div className="text-cyan-400 font-mono text-2xl md:text-3xl mb-1">99.9%</div>
              <div className="text-xs uppercase tracking-wider text-slate-500">Detekcija prijetnji</div>
            </div>
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
              <div className="text-emerald-400 font-mono text-2xl md:text-3xl mb-1">-84%</div>
              <div className="text-xs uppercase tracking-wider text-slate-500">False Positives</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button className="px-8 py-4 w-full sm:w-auto bg-slate-950 text-cyan-400 border border-cyan-500/50 rounded-none font-mono text-xs uppercase tracking-[0.3em] font-bold hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-3 group relative">
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-cyan-400"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-cyan-400"></div>
              Zatražite Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="px-5 py-3 w-full sm:w-auto border border-slate-700 hover:border-slate-500 bg-slate-900/50 text-white rounded font-medium transition-colors">
              Tehnička dokumentacija
            </button>
          </motion.div>
        </div>

        {/* Right Visual Dashboard */}
        <div className="hidden lg:flex lg:col-span-6 relative items-center justify-center">
            <div className="relative w-[500px] h-[500px] bg-slate-900/40 rounded-full border border-slate-800 flex items-center justify-center">
              {/* Center Node */}
              <div className="z-20 w-32 h-32 bg-slate-950 border-2 border-cyan-400 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                <Shield className="w-10 h-10 text-cyan-400 mb-2" />
                <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">Guard Host</span>
              </div>

              {/* Orbiting Nodes */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center mb-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">AGENT_ALPHA</span>
              </div>

              <div className="absolute bottom-20 left-10 flex flex-col items-center">
                <div className="w-14 h-14 bg-slate-900 border-2 border-red-500/50 rounded-lg flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-[10px] text-red-400 font-mono">VULN_DETECTED</span>
              </div>

              <div className="absolute top-40 right-4 flex flex-col items-center">
                <div className="w-14 h-14 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center mb-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">DB_CLUSTER_01</span>
              </div>

              {/* Connecting Lines SVG */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 500 500">
                <line x1="250" y1="250" x2="250" y2="90" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4" />
                <line x1="250" y1="250" x2="90" y2="380" stroke="#ef4444" strokeWidth="1" />
                <line x1="250" y1="250" x2="450" y2="200" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4" />
              </svg>

              {/* MCP Status Card */}
              <div className="absolute bottom-4 right-4 w-64 bg-slate-900/90 border border-slate-700 p-4 rounded-xl backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-[10px] font-bold text-white tracking-widest uppercase">AI Context Insight</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal mb-3 font-mono">
                  Matched YARA rule <span className="text-red-400">Rule_Webshell_Detection</span>. AI recommends immediate VLAN isolation of segment DB_CLUSTER_01.
                </p>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-[65%]"></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[8px] text-slate-500">PROBABILITY</span>
                  <span className="text-[8px] text-cyan-400">89.4%</span>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
