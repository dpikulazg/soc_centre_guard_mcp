import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, FileText, Code, Shield, Server, Terminal, ChevronDown } from 'lucide-react';

type Language = 'en' | 'hr';

export function DocumentationSection() {
  const [lang, setLang] = useState<Language>('hr');
  const [activeTab, setActiveTab] = useState('architecture');

  const content = {
    hr: {
      title: 'Korisnička i Tehnička Dokumentacija',
      subtitle: 'Sustavna arhitektura, upute za agente, integracija i specifikacije sigurnosnih protokola',
      tabs: [
        { id: 'architecture', label: 'Arhitektura Sustava', icon: Server },
        { id: 'frontend', label: 'Frontend & UI', icon: Code },
        { id: 'agents', label: 'Upravljanje Agentima', icon: Server },
        { id: 'security', label: 'Sigurnosni Protokoli', icon: Shield },
        { id: 'integration', label: 'MCP Integracija', icon: Code },
        { id: 'commands', label: 'LOKI CLI', icon: Terminal },
      ],
      sections: {
        architecture: {
          title: 'Arhitektura Sustava',
          description: 'GuardMCP koristi distribuiranu arhitekturu temeljenu na mikrouslugama za postizanje visoke skalabilnosti, niske latencije i maksimalne otpornosti na napade.',
          points: [
            { title: 'Core Node Engine', text: 'Centralni čvor razvijen je primjenom .NET 8 framework-a. Dizajniran je specifično za streamanje i procesiranje ogromnog broja sigurnosnih događaja (više tisuća po sekundi) primjenom gRPC protokola i naprednih mehanizama paralelizacije.' },
            { title: 'Telemetrija u realnom vremenu', text: 'Sustav prikuplja telemetrijske podatke u sekundnim intervalima, koristeći buffer i prosljeđujući ih analitičkim strojevima. Podaci su indeksirani za brzo pretraživanje uz Elastic Search integraciju.' },
            { title: 'Distribuirana Agent mreža', text: 'LOKI agenti instalirani su na krajnjim točkama (klijentskim računalima i poslužiteljima). Pisan u Go jeziku (Golang), agent jamči izuzetno mali "footprint" (potrošnju memorije ispod 20MB) kako ne bi narušio performanse štićenog sustava.' },
            { title: 'Kontekstualna klasifikacija (AI)', text: 'Platforma integrira Google Gemini AI modele koji u realnom vremenu primaju anomalije te kontekstualiziraju podatke primjenom MCP (.Model Context Protocol) standarda. Odluke se vraćaju čvoru u obliku preporučenih ili automatskih akcija.' }
          ]
        },
        frontend: {
          title: 'Frontend Arhitektura & UI',
          description: 'Pregledan i reaktivan Dashboard baziran na modernim web tehnologijama, omogućujući administratorima vizualizaciju složenih podataka.',
          points: [
            { title: 'Vite + React (TypeScript)', text: 'Aplikacija se oslanja na React funkcionalne komponente u kombinaciji s Vite build alatom. Tipizacija kroz TypeScript osigurava pouzdanost koda pri refaktoriranju.' },
            { title: 'Tailwind CSS', text: 'Za responsivnost i konzistentan dizajn koristi se Tailwind CSS. Sučelje obuhvaća napredna CSS svojstva poput "backdrop-blur" za stakleni efekt, naprednih mrežnih rasporeda (CSS Grid) i suptilnih animacija.' },
            { title: 'Motion Animacije', text: 'Strateški postavljene "Framer Motion" animacije služe za vizualno glatko prelaženje između stanja i kartica, smanjujući kognitivno opterećenje korisnika pri pregledu alertova.' },
            { title: 'Struktura Komponenti', text: 'Moduli poput "YaraRuleManager", "McpSidebar" i "AgentAdmin" razdvojeni su u zasebne komponente radi lakšeg održavanja i lokaliziranog upravljanja stanjem (React state).' }
          ]
        },
        agents: {
          title: 'Operacije Mreže Agenata',
          description: 'LOKI administracijska sučelja omogućuju detaljno praćenje i upravljanje aktivnim čvorovima te uslugama.',
          points: [
            { title: 'Lokalna i Globalna Konfiguracija', text: 'Administratori putem Dashboarda mogu mijenjati IP adrese, tip čvora te radni status agenta. Svaki agent prima željeno stanje (desired state) i usklađuje svoju lokalnu konfiguraciju.' },
            { title: 'Detekcija Mrežnih Indikatora', text: 'Agenti slušaju mrežni promet na nivou kernela (eBPF) te obavljaju inspekciju paketa ne remeteći brzinu veze, prijavljujući samo sumnjive obrasce prema heurističkim pravilima.' },
            { title: 'Sistemski Uvidi i Health Check', text: 'Agent redovito emitira puls "Heartbeat" koji sadržava ključne pokazatelje zdravlja (CPU utilizacija, stanje memorije, mrežni promet). Ako "Heartbeat" izostane, Core Node ga automatski prijavljuje kao Offline kompromitaciju.' }
          ]
        },
        security: {
          title: 'Sigurnosni Protokoli i Preporuke',
          description: 'Sustav implementira višeslojne mehanizme zaštite podataka i mrežne komunikacije, slijedeći obrambeni "Defense-in-Depth" princip.',
          points: [
            { title: 'End-to-End Enkripcija (mTLS)', text: 'Komunikacija između agenata, poslužitelja i same baze osigurana je TLS 1.3 protokolom s obaveznom uzajamnom autentifikacijom pomoću digitalnih certifikata (mTLS).' },
            { title: 'Dinamička YARA Pravila', text: 'Platforma redovito sinhronizira YARA pravila sa središnjeg Hub-a (npr. GitHub-a zajednice), omogućavajući brzu detekciju svježih APT kampanja i malware potpisa. Agenti lokalno parsiraju YARA pravila unutar memorije ("in-memory").' },
            { title: 'Zero-Trust Arhitektura', text: 'Niti jednom uređaju nije dozvoljeno eksplicitno povjerenje; svaki se zahtjev autentificira i kriptografski verificira asimetričnom enkripcijom. Pristup analitici na UI-u zahtijeva JWT tokene s kratkim vremenom trajanja.' },
            { title: 'Sigurnosni Logovi', text: 'Svi događaji s akcijama agenata te modifikacijama od strane korisnika bilježe se u zaštićen (tamper-evident) Event Log repozitorij, koji je nužan za potrebe naknadnih forenzičkih istraga.' }
          ]
        },
        integration: {
          title: 'Model Context Protocol (MCP)',
          description: 'Prvi sigurnosni EDR okvir s izvornom podrškom za otvoren standard komuniciranja između AI Asistenata i operacijskih sustava.',
          points: [
            { title: 'Kontekstualne Akcije', text: 'Umjesto suhoparnih alertova, LLM analizira tok događaja i predlaže točne "Remediation" akcije kroz MCP. Sustav ima mehanizme obrane da osigura kako LLM ne može nasumično ubiti vitalne procese operativnih sustava.' },
            { title: 'Simulacija i Predviđanja Tijekova Napada', text: 'Model na temelju MITRE ATT&CK klasifikacija koje osigurava agent, generira moguće sljedeće korake napadača i priprema izolacijske mehanizme poput Sandbox spremništva ili prebacivanja mreže u Quarantine mode.' },
            { title: 'Struktura Interaktivnosti', text: 'Administratori imaju mogućnost pregleda AI-generiranih preporuka (npr. "Preporučuje se rotacija ključeva zbog kompromitacije tokena") i jednim klikom potvrđuju i pokreću automatizirane sanacijske procedure putem Dashboard C2 servera.' }
          ]
        },
        commands: {
           title: 'LOKI CLI - Naredbeni Tekstualni Alati',
           description: 'Za stručno osoblje, osiguran je pregršt CLI naredbi za direktnu tekstualnu operativu na *nix sustavima i automatizaciju putem skripti.',
           points: [
              { title: 'loki-scan --quick', text: 'Pokreće trenutan pregled radne memorije i kritičnih grana registara u operativnom sustavu u potrazi za najaktualnijim indikatorima kompromitacije (IOC).' },
              { title: 'loki-scan --deep --yara /putanja/do/pravila', text: 'Detaljno skeniranje sa zadanim prilagođenim YARA pravilima primijenjenima na kompletne blokovne uređaje, MBR i korisničke prostore.' },
              { title: 'loki-agent status', text: 'Dobavlja status lokalnog agenta u realnom vremenu. Ispisuje opterećenje, povezanost sa središnjim čvorom, certifikat i log u obliku pregledne JSON poruke.' },
              { title: 'loki-admin quarantine <IP/ID>', text: 'Nasilno isključuje zaraženi čvor iz ostatka organizacijske mreže koristeći iptables i virtualne switch mehanizme na razini hosta.' }
           ]
        }
      }
    },
    en: {
      title: 'User & Technical Documentation',
      subtitle: 'System architecture, agent manuals, integration APIs, and security protocol specifications',
      tabs: [
        { id: 'architecture', label: 'System Architecture', icon: Server },
        { id: 'frontend', label: 'Frontend & UI', icon: Code },
        { id: 'agents', label: 'Agent Management', icon: Server },
        { id: 'security', label: 'Security Protocols', icon: Shield },
        { id: 'integration', label: 'MCP Integration', icon: Code },
        { id: 'commands', label: 'LOKI CLI', icon: Terminal },
      ],
      sections: {
        architecture: {
          title: 'System Architecture',
          description: 'GuardMCP utilizes a highly distributed, microservice-oriented architecture tailored for massive scalability, ultra-low latency, and maximum attack resilience.',
          points: [
            { title: 'Core Node Engine', text: 'The central node is built leveraging the modern .NET 8 framework. It is specifically engineered to ingest and process thousands of security events per second through gRPC streaming and advanced hardware parallelization techniques.' },
            { title: 'Real-time Telemetry Pipeline', text: 'The system collects telemetry from endpoints in sub-second intervals, buffering them gracefully during spikes, and passing them to analytical correlation engines. Data is indexed for high-speed queries with Elastic Search.' },
            { title: 'Distributed Agent Network', text: 'LOKI agents are installed across endpoints (client PCs, cloud servers). Developed in Golang to ensure a minuscule footprint (memory consumption often <20MB), the agent refuses to degrade the operational performance of the host it protects.' },
            { title: 'Contextual AI Classification', text: 'The platform integrates with Google Gemini AI models to ingest anomalous event sequences in real-time. By applying the MCP (Model Context Protocol), decisions and remediation recommendations are streamed directly to the Central Node.' }
          ]
        },
        frontend: {
          title: 'Frontend Architecture & UI',
          description: 'An elegant, responsive Dashboard built atop modern web stacks, allowing administrators to visually slice and dice multi-dimensional threat data.',
          points: [
            { title: 'Vite + React (TypeScript)', text: 'The application uses React functional components and hooks driven by the Vite build tool. TypeScript provides robust type safety and enables scalable refactoring as the codebase grows.' },
            { title: 'Tailwind CSS Stylings', text: 'For fluid responsiveness and a consistent futuristic aesthetic, we compose UI via Tailwind CSS. Advanced properties such as backdrop-blur (glassmorphism), grids, and subtle color accents form the foundation of our design system.' },
            { title: 'Motion Animations', text: 'Strategically integrated "Framer Motion" animations provide buttery smooth page transitions separating distinct data cards, dramatically reducing cognitive friction when analyzing stressful alert waves.' },
            { title: 'Decoupled Component Tree', text: 'Modules like "YaraRuleManager", "McpSidebar", and "AgentAdmin" are isolated into specific components, fostering straightforward codebase maintenance and localized rendering optimizations.' }
          ]
        },
        agents: {
          title: 'Agent Network Operations',
          description: 'The LOKI Administration interface provides granular monitoring and orchestration over active fleet nodes and services.',
          points: [
            { title: 'Remote State Reconciliation', text: 'Admins can dynamically alter IP mappings, logical node designations, and operational modes via the Dashboard. Each agent receives these "desired state" deltas and internally reconciles its configuration without restarting.' },
            { title: 'Kernel-level Network Heuristics', text: 'Agents tap directly into network flows using eBPF, performing deep packet inspection without inducing noticeable latency. It relays only mathematically suspicious traffic shapes driven by behavioral heuristics.' },
            { title: 'Health Checking & Vital Monitoring', text: 'An agent periodically broadcasts a lightweight "Heartbeat" payload encompassing CPU bounds, memory allocation, and bandwidth statistics. Missing heartbeats trigger an automatic "Offline Node Comprise" alert at the central C2 layer.' }
          ]
        },
        security: {
          title: 'Security Protocols and Safeguards',
          description: 'Implementing defense-in-depth, the ecosystem is armored with multi-layered data protection, encryption boundaries, and zero-trust policies.',
          points: [
            { title: 'End-to-End Encryption (mTLS)', text: 'Communication streams between fleet agents, aggregation servers, and datastores are strictly bound by TLS 1.3. Mutual TLS (mTLS) enforces that only cryptographically verifiable agents can initiate handshakes.' },
            { title: 'Dynamic YARA Defenses', text: 'The engine frequently syncs new YARA definition packages from central intelligence hums (e.g., community repositories). Threat intelligence is injected directly into memory, isolating it from disk-based tampering, enabling immediate scanning for new APT malware families.' },
            { title: 'Zero-Trust Verifications', text: 'Implicit geographical or logical network trust is abolished. Every telemetry stream and command instruction is validated with asymmetric signatures. Dashboard UI sessions mandate short-lived JSON Web Tokens (JWT) for analytics access.' },
            { title: 'Cryptographic Event Logging', text: 'Operational milestones, AI-driven action triggers, and human interventions are immutably logged to a tamper-evident audit ledger, fulfilling compliance mandates and simplifying post-incident forensic dissection.' }
          ]
        },
        integration: {
          title: 'Model Context Protocol (MCP)',
          description: 'A pioneering EDR framework offering out-of-the-box support for the open standard of interoperability between AI Assistants and OS-level enforcement.',
          points: [
            { title: 'Context-Aware Remediation Actions', text: 'Rather than alerting via noise, the integrated LLM analyzes the entire process execution tree and proposes precise remediation primitives. Built-in guardrails ensure the AI cannot inadvertently flag or terminate critical OS background services (e.g., lsass.exe).' },
            { title: 'Killchain Simulation & Forecasting', text: 'Mapping observations against the MITRE ATT&CK matrix, the system models the adversary’s most probable next moves, pre-emptively arming isolating defenses like sandboxing or strict packet-discarding.' },
            { title: 'One-Click Playbooks', text: 'Human operators review AI-guided diagnostic cards (e.g. "Critical: Suggest rotating IAM keys due to exposed valid token") and execute fully automated remediation playbooks across the distributed network with a single confirmation click.' }
          ]
        },
        commands: {
           title: 'LOKI CLI - Command Line Instrumentation',
           description: 'For hardened UNIX/Linux operators, a versatile CLI payload empowers direct textual troubleshooting and CI/CD script automation.',
           points: [
              { title: 'loki-scan --quick', text: 'Fires an immediate surface-level sweep traversing volatile memory and notorious persistence locations (e.g., registry autoruns) scanning for ubiquitous Indicators of Compromise.' },
              { title: 'loki-scan --deep --yara /rules', text: 'An exhaustive traversal iterating over block devices, MBR hooks, and user profiles leveraging custom YARA signature directories.' },
              { title: 'loki-agent status', text: 'Fetches granular state geometry of the local agent daemon including resource tax, central node connectivity health, mTLS validity, and returns it as a parseable JSON block.' },
              { title: 'loki-admin quarantine <ID>', text: 'Forcefully amputates a compromised node from the collective network perimeter utilizing deep host-level firewalling (iptables/nftables) while leaving C2 communication untouched for forensic recovery.' }
           ]
        }
      }
    }
  };

  const currentContent = content[lang];
  const activeSection = currentContent.sections[activeTab as keyof typeof currentContent.sections];

  return (
    <section className="py-24 border-t border-slate-800 bg-slate-900/10" id="docs">
      <div className="container mx-auto px-10">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">Documentation</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">{currentContent.title}</h2>
              <p className="text-slate-400 max-w-2xl text-lg">{currentContent.subtitle}</p>
           </div>
           
           <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/50 rounded-lg p-1">
              <button 
                 onClick={() => setLang('hr')}
                 className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors ${lang === 'hr' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                HR
              </button>
              <button 
                 onClick={() => setLang('en')}
                 className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors ${lang === 'en' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                EN
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           
           {/* Navigation Tabs */}
           <div className="col-span-1 border border-slate-800/80 rounded-2xl bg-slate-950/80 p-4 flex flex-col gap-2 relative overflow-hidden backdrop-blur-sm shadow-xl h-fit">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] rounded-full"></div>
              
              {currentContent.tabs.map((tab) => {
                 const Icon = tab.icon;
                 const isActive = activeTab === tab.id;
                 return (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300 relative overflow-hidden group ${isActive ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                   >
                     {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-l-xl"></div>
                     )}
                     <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`} />
                     <span className="font-bold text-sm tracking-wide">{tab.label}</span>
                   </button>
                 );
              })}
           </div>

           {/* Content Area */}
           <div className="col-span-1 lg:col-span-3">
              <AnimatePresence mode="wait">
                 <motion.div
                    key={activeTab + lang}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="border border-slate-800/80 rounded-2xl bg-slate-950/80 p-8 md:p-12 relative overflow-hidden backdrop-blur-sm shadow-xl"
                 >
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none"></div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{activeSection.title}</h3>
                    <p className="text-slate-400 text-lg mb-10 pb-10 border-b border-slate-800/80 leading-relaxed">
                       {activeSection.description}
                    </p>
                    
                    <div className="space-y-8">
                       {activeSection.points.map((point, index) => (
                         <div key={index} className="flex gap-4 group">
                            <div className="mt-1">
                               <div className="w-6 h-6 rounded border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                                 <ChevronDown className="w-3 h-3 -rotate-90" />
                               </div>
                            </div>
                            <div>
                               <h4 className="text-white font-bold text-lg mb-2">{point.title}</h4>
                               <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{point.text}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </motion.div>
              </AnimatePresence>
           </div>
           
        </div>
      </div>
    </section>
  );
}
