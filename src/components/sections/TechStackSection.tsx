import { motion } from 'motion/react';

const technologies = [
  { name: 'MCP Engine', desc: 'Context-Aware AI Protocol' },
  { name: 'LOKI', desc: 'IOC Scanner (Python/Go)' },
  { name: 'YARA Rules', desc: 'Custom Malware Rules' },
  { name: '.NET', desc: 'High-Performance API' },
  { name: 'React', desc: 'Signals & State UI' },
];

export function TechStackSection() {
  return (
    <section className="py-24 border-t border-slate-800 bg-slate-900/20" id="tech">
      <div className="container mx-auto px-10 text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-12">
          <span className="w-6 h-px bg-slate-700"></span>
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Trusted Technology Stack
          </h2>
          <span className="w-6 h-px bg-slate-700"></span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {technologies.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center group cursor-default"
            >
              <div className="text-2xl md:text-3xl font-display font-medium text-slate-300 group-hover:text-cyan-400 transition-colors mb-2">
                {tech.name}
              </div>
              <div className="text-xs font-mono text-slate-500 group-hover:text-slate-300 transition-colors tracking-wide">
                {tech.desc}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-24 max-w-4xl mx-auto bg-slate-900/60 p-10 rounded-2xl border border-slate-800 text-center relative overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-[80px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/5 blur-[80px] rounded-full"></div>
          <p className="text-lg text-slate-300 italic leading-relaxed relative z-10 font-light">
            "Naša arhitektura koristi rigorozne standarde detekcije definirane u <strong className="text-white font-medium">YARA-Room</strong> okviru, 
            osiguravajući da svaki AI agent operira s najnovijim definicijama prijetnji, dok <strong className="text-white font-medium">LOKI engine</strong> vrši 
            forenzičku analizu u dubini sustava."
          </p>
        </div>
      </div>
    </section>
  );
}
