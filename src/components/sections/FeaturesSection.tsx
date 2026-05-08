import { Brain, Cpu, Search, Workflow } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    id: 1,
    title: 'Context-Aware MCP Integration',
    description: 'Naš Model Context Protocol omogućuje AI modelima da razumiju specifičan kontekst vaše infrastrukture u stvarnom vremenu bez kompromitiranja privatnosti i eksfiltracije podataka.',
    icon: <Brain className="w-6 h-6 text-cyan-400" />,
  },
  {
    id: 2,
    title: 'AI Agent Vulnerability Retrieval',
    description: 'Autonomni LLM agenti koji proaktivno pretražuju logove, skeniraju sustave i koreliraju podatke o ranjivostima u realnom vremenu umjesto ljudi.',
    icon: <Search className="w-6 h-6 text-emerald-400" />,
  },
  {
    id: 3,
    title: 'LOKI & YARA Threat Hunting',
    description: 'Integracija s LOKI scannerom i prilagođenim YARA pravilima (Yara-Room metodologija) za beskompromisnu detekciju indikatora kompromitacije (IOC).',
    icon: <Cpu className="w-6 h-6 text-red-500" />,
  },
  {
    id: 4,
    title: 'Automatizirana remedijacija',
    description: 'Generiranje specifičnih preporuka i playova na temelju AI interpretacije otkrivenih pretnji. Složena sigurnost pretvorena u jednostavne i jasne korake za djelovanje.',
    icon: <Workflow className="w-6 h-6 text-cyan-400" />,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-900/40 border-y border-slate-800/50" id="features">
      <div className="container mx-auto px-10">
        <div className="mb-16 md:w-2/3">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">Vaš digitalni imunitet, <br />vođen umjetnom inteligencijom.</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Naš B2B back-end sustav nije samo još jedan alat za skeniranje. Koristeći napredni <span className="text-cyan-400 font-semibold">MCP (Model Context Protocol)</span>, 
            naši AI agenti <em>razumiju</em> vašu mrežu. Integracijom <span className="text-emerald-400 font-semibold">LOKI engine-a</span> i specifičnih <strong>YARA pravila</strong>, pružamo dubinsku forenzičku analizu koju tradicionalni programi propuštaju.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-colors group shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-950 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] border border-slate-800">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed font-light">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
