import { useState, useEffect } from 'react';
import { XCircle, Activity, FileCode2, Command, ShieldCheck, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface McpSidebarProps {
  asset: any;
}

const RULE_CONTENTS: Record<string, string> = {
  'Rule_Webshell_C99': `rule Webshell_C99 {
    meta:
        description = "Detects C99 webshell"
        author = "GuardMCP"
    strings:
        $s1 = "c99shell" ascii
    condition:
        any of them
}`,
  'Rule_Obfuscated_JS_Drop': `rule Obfuscated_JS_Drop {
    meta:
        description = "Detects obfuscated javascript dropper"
    strings:
        $s1 = "eval(unescape(" ascii
    condition:
        $s1
}`,
  'Rule_Suspicious_Eval': `rule Suspicious_Eval {
    meta:
        description = "Detects suspicious eval()"
    strings:
        $s1 = /eval\\(base64_decode\\(/
    condition:
        $s1
}`,
  'Rule_Suspicious_Auth_Burst': `rule Suspicious_Auth_Burst {
    meta:
        description = "Detects burst of auth failures"
    condition:
        auth_failures > 50 in 1m
}`
};

export function McpSidebar({ asset }: McpSidebarProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiContext, setAiContext] = useState<any>(null);
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [eventLogs, setEventLogs] = useState<{ id: string, message: string, timestamp: Date, type: string }[]>([]);

  const handleActionClick = (action: any) => {
    const newLog = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      message: `Executed: ${action.label}`,
      timestamp: new Date(),
      type: action.type
    };
    setEventLogs(prev => [newLog, ...prev]);
    
    // Remove the action from context after it's executed
    if (aiContext) {
      setAiContext({
        ...aiContext,
        actions: aiContext.actions.filter((a: any) => a.id !== action.id)
      });
    }
  };

  // Simulate dynamically fetching MCP context when a node is selected
  useEffect(() => {
    if (!asset) return;

    setIsAnalyzing(true);
    setAiContext(null);
    setEventLogs([]);

    const timer = setTimeout(() => {
      let contextData;
      if (asset.status === 'infected') {
        contextData = {
          insight: `Matched YARA rule Webshell_C99 on ${asset.name}. The behavioral pattern suggests an active C2 injection attempt originating from external WAN IP. AI recommends immediate VLAN isolation of segment.`,
          probability: 98.4,
          indicators: ['Rule_Webshell_C99', 'Rule_Obfuscated_JS_Drop', 'Rule_Suspicious_Eval'],
          actions: [
            { id: 'q1', label: 'Quarantine Node', type: 'critical', icon: XCircle },
            { id: 'r1', label: 'Rotate Credentials', type: 'standard', icon: Command }
          ]
        };
      } else if (asset.status === 'warning') {
        contextData = {
          insight: `Unusual authentication bursts detected on ${asset.name}. Correlates with credential stuffing patterns, but failed lateral movement. Monitoring recommended.`,
          probability: 64.2,
          indicators: ['Rule_Suspicious_Auth_Burst'],
          actions: [
            { id: 'm1', label: 'Enable Strict Audit', type: 'standard', icon: Command }
          ]
        };
      } else {
        contextData = {
          insight: `No anomalies detected on ${asset.name}. Continuous LOKI scanning running in background. YARA ruleset up to date.`,
          probability: 2.1,
          indicators: [],
          actions: []
        };
      }

      setAiContext(contextData);
      setIsAnalyzing(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [asset]);

  if (!asset) {
    return (
      <div className="h-full p-6 flex flex-col items-center justify-center text-slate-500 text-center">
        <Activity className="w-12 h-12 mb-4 opacity-30 text-cyan-500" />
        <p className="font-mono text-sm tracking-wide">Select a network node to view MCP context</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={asset.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="h-full flex flex-col pt-16"
      >
        <div className="p-6 border-b border-slate-800/80 bg-slate-900/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-display text-white tracking-tight">{asset.name}</h2>
            {asset.status === 'infected' && <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-mono rounded border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]">CRITICAL</span>}
            {asset.status === 'warning' && <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-mono rounded border border-amber-500/30">WARNING</span>}
            {asset.status === 'clean' && <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-mono rounded border border-emerald-500/30">SECURE</span>}
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                <span>Threat Level</span>
                <span className={asset.threatLevel > 70 ? 'text-red-400' : asset.threatLevel > 40 ? 'text-amber-400' : 'text-emerald-400'}>{asset.threatLevel}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${asset.threatLevel > 70 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : asset.threatLevel > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${asset.threatLevel}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-950 p-3 rounded-lg border border-slate-800/50">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-widest mb-1">Node Type</span>
                <span className="text-slate-300 font-mono text-xs">{asset.type}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-widest mb-1">IP Address</span>
                <span className="text-slate-300 font-mono text-xs">10.0.{asset.id}.15</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto relative">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-full text-cyan-400 gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="font-mono text-xs uppercase tracking-widest animate-pulse">MCP Agents Analyzing...</p>
            </div>
          ) : aiContext ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Command className="w-3 h-3" /> MCP Analysis Complete
              </h3>
              
              <div className={`p-4 border rounded-xl mb-6 shadow-lg relative overflow-hidden ${
                asset.status === 'infected' ? 'bg-slate-900 border-slate-700/80' : 
                asset.status === 'warning' ? 'bg-slate-900 border-slate-700/80' : 
                'bg-slate-900 border-slate-700/80'
              }`}>
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  asset.status === 'infected' ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 
                  asset.status === 'warning' ? 'bg-amber-500' : 
                  'bg-emerald-500'
                }`}></div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${
                    asset.status === 'infected' ? 'bg-cyan-400' : 
                    asset.status === 'warning' ? 'bg-amber-400' : 
                    'bg-emerald-400'
                  }`}></div>
                  <span className="text-[10px] font-bold text-white tracking-widest uppercase">
                    {asset.status === 'clean' ? 'Agent Status' : 'AI Context Insight'}
                  </span>
                </div>
                
                <p className="text-sm text-slate-400 leading-relaxed font-mono" dangerouslySetInnerHTML={{ __html: aiContext.insight }}></p>
                
                {asset.status !== 'clean' && (
                  <div className="flex justify-between mt-4">
                    <span className="text-[10px] text-slate-500 font-mono">PROBABILITY</span>
                    <span className="text-[10px] text-cyan-400 font-mono">{aiContext.probability}%</span>
                  </div>
                )}
              </div>

              {aiContext.indicators.length > 0 && (
                <div className="mb-6">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-3">Triggered LOKI Indicators</label>
                  <div className="space-y-2">
                    {aiContext.indicators.map((rule: string, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${asset.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                          <span className="font-mono text-xs text-slate-300">{rule}</span>
                        </div>
                        <button 
                          onClick={() => setSelectedRule(rule)}
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group bg-cyan-950/30 px-2 py-1 rounded"
                        >
                          <FileCode2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] uppercase font-bold tracking-wider">.yar</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiContext.actions.length > 0 && (
                <div className="mt-6">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-3">Recommended Actions</label>
                  <div className="space-y-3">
                    {aiContext.actions.map((action: any) => {
                      const Icon = action.icon;
                      if (action.type === 'critical') {
                        return (
                          <button key={action.id} onClick={() => handleActionClick(action)} className="w-full py-3 bg-gradient-to-br from-red-950/80 to-red-900/30 border border-red-500/50 hover:border-orange-500 text-red-500 hover:text-white transition-all duration-300 rounded-lg font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.15) 10px, rgba(0,0,0,0.15) 20px)' }}></div>
                            <div className="absolute inset-0 border-2 border-orange-400/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg animate-pulse"></div>
                            <Icon className="w-4 h-4 relative z-10 group-hover:scale-110 transition-all drop-shadow-md" /> 
                            <span className="relative z-10 drop-shadow-md">{action.label}</span>
                          </button>
                        );
                      }
                      return (
                        <button key={action.id} onClick={() => handleActionClick(action)} className="w-full py-3 bg-slate-900 border border-slate-700/80 text-slate-400 hover:bg-slate-800 hover:border-cyan-500/50 hover:text-cyan-300 transition-all duration-300 rounded-lg font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] group relative overflow-hidden">
                          <div className="absolute inset-0 bg-cyan-500/5 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                          <div className="absolute inset-0 border md:border-2 border-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                          <Icon className="w-4 h-4 relative z-10 opacity-70 group-hover:opacity-100 group-hover:text-cyan-400 group-hover:scale-110 transition-all" /> 
                          <span className="relative z-10">{action.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {eventLogs.length > 0 && (
                <div className="mt-6 border-t border-slate-800/80 pt-6">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-3">Security Event Log</label>
                  <div className="space-y-2">
                    {eventLogs.map((log) => (
                      <div key={log.id} className="flex flex-col gap-1 bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-mono ${log.type === 'critical' ? 'text-red-400' : 'text-cyan-400'}`}>
                            {log.message}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-600 font-mono">
                          STATUS: Acknowledged by MCP Agent
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : null}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedRule && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <FileCode2 className="w-5 h-5 text-cyan-400" />
                   <h3 className="font-mono text-sm font-bold text-white">{selectedRule}</h3>
                </div>
                <button onClick={() => setSelectedRule(null)} className="p-1 rounded hover:bg-slate-800 text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh] bg-slate-950/50">
                <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed">
                  {RULE_CONTENTS[selectedRule] || 'Rule content not found.'}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}

