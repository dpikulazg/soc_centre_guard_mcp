import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Save, 
  RotateCcw, 
  ChevronDown, 
  Plus, 
  Tag as TagIcon, 
  MessageSquare, 
  History, 
  Eye, 
  Activity, 
  ShieldAlert,
  Search,
  Layout
} from 'lucide-react';

interface Case {
  id: string;
  uuid: string;
  name: string;
  summary: string;
  assessment: string;
  type: string;
  status: string;
  creator: string;
  priority: string;
  recommendations: string[];
  customRecommendation: string;
  tags: string[];
  externalId: string;
  events: any[];
  affectedAssets: any[];
}

interface CaseEditorProps {
  caseData: Case;
  onSave: (updated: Case) => void;
  onClose: () => void;
}

export function CaseEditor({ caseData, onSave, onClose }: CaseEditorProps) {
  const [formData, setFormData] = useState<Case>(caseData);
  const [activeTab, setActiveTab] = useState('events');

  const tabs = [
    { id: 'events', label: `Events (${formData.events?.length || 0})` },
    { id: 'assets', label: `Affected Assets (${formData.affectedAssets?.length || 0})` },
    { id: 'criteria', label: 'Grouping Criteria' },
    { id: 'history', label: 'Change History' },
    { id: 'comments', label: 'Comments' },
  ];

  const handleFieldChange = (field: keyof Case, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const removeRecommendation = (rec: string) => {
    setFormData(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter(r => r !== rec)
    }));
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#0f172a]/95 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="h-14 bg-slate-900 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
          <div className="flex items-center gap-2">
            <Layout size={18} className="text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Case Details</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded flex items-center gap-2 transition-colors">
             <RotateCcw size={14} /> Reset
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
          >
             <Save size={14} /> Update Case
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form: Fields */}
        <div className="w-[450px] bg-slate-900/50 border-r border-white/5 p-6 overflow-y-auto space-y-6 custom-scrollbar shrink-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</label>
              <input 
                type="text" 
                value={formData.id} 
                disabled 
                className="w-full bg-slate-950/50 border border-slate-800/50 rounded-sm px-3 py-2 text-xs text-slate-400 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">UUID</label>
              <input 
                type="text" 
                value={formData.uuid} 
                disabled 
                className="w-full bg-slate-950/50 border border-slate-800/50 rounded-sm px-3 py-2 text-[10px] text-slate-500 font-mono truncate"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name</label>
              <History size={12} className="text-slate-600" />
            </div>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="w-full bg-[#1e293b]/50 border border-white/5 rounded-sm px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Summary <span className="normal-case text-slate-600">(optional)</span></label>
              <History size={12} className="text-slate-600" />
            </div>
            <textarea 
              value={formData.summary}
              onChange={(e) => handleFieldChange('summary', e.target.value)}
              className="w-full bg-[#1e293b]/50 border border-white/5 rounded-sm px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 min-h-[80px] resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assessment <span className="normal-case text-slate-600">(optional)</span></label>
              <History size={12} className="text-slate-600" />
            </div>
            <textarea 
              value={formData.assessment}
              onChange={(e) => handleFieldChange('assessment', e.target.value)}
              className="w-full bg-[#1e293b]/50 border border-white/5 rounded-sm px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 min-h-[80px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</label>
              <div className="relative">
                <select 
                  value={formData.type}
                  onChange={(e) => handleFieldChange('type', e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded-sm px-3 py-2 text-xs text-slate-300 appearance-none focus:outline-none"
                >
                  <option>Vulnerability</option>
                  <option>Malware</option>
                  <option>Phishing</option>
                  <option>Incident</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</label>
              <div className="relative">
                <select 
                  value={formData.status}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded-sm px-3 py-2 text-xs text-slate-300 appearance-none focus:outline-none"
                >
                  <option>Level 1 Working</option>
                  <option>Escalated</option>
                  <option>Closed - Resolved</option>
                  <option>Closed - False Positive</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Creator</label>
              <input type="text" value={formData.creator} disabled className="w-full bg-slate-950/50 border border-white/5 rounded-sm px-3 py-2 text-xs text-slate-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Filter Priority</label>
              <div className="relative">
                <select 
                   value={formData.priority}
                   onChange={(e) => handleFieldChange('priority', e.target.value)}
                   className="w-full bg-slate-900 border border-white/5 rounded-sm px-3 py-2 text-xs text-slate-300 appearance-none focus:outline-none"
                >
                  <option>Low</option>
                  <option>Medium (default)</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-[#94a3b8]">Recommendations <span className="normal-case text-slate-600">(optional)</span></label>
             <div className="flex flex-wrap gap-2 p-2 bg-slate-950/30 border border-white/5 rounded-sm min-h-[44px]">
               {formData.recommendations.map(rec => (
                 <span key={rec} className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold rounded-sm group">
                   {rec}
                   <button onClick={() => removeRecommendation(rec)} className="text-slate-500 hover:text-red-400">
                     <X size={12} />
                   </button>
                 </span>
               ))}
               <button className="p-1 hover:bg-slate-800 rounded transition-colors h-6 w-6 flex items-center justify-center">
                 <Plus size={14} className="text-slate-500" />
               </button>
             </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-[#94a3b8]">Custom Recommendation <span className="normal-case text-slate-600">(optional)</span></label>
              <History size={12} className="text-slate-600" />
            </div>
            <textarea 
              value={formData.customRecommendation}
              onChange={(e) => handleFieldChange('customRecommendation', e.target.value)}
              className="w-full bg-[#1e293b]/50 border border-white/5 rounded-sm px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 min-h-[60px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-[#94a3b8]">Tags <span className="normal-case text-slate-600">(optional)</span></label>
                <div className="flex flex-wrap gap-1 p-1 bg-slate-950/30 border border-white/5 rounded-sm min-h-[38px]">
                  {formData.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold rounded-xs">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-white"><X size={10} /></button>
                    </span>
                  ))}
                  <button className="flex items-center justify-center w-6 h-6"><Plus size={12} className="text-slate-600" /></button>
                </div>
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-[#94a3b8]">External ID <span className="normal-case text-slate-600">(optional)</span></label>
                <input 
                  type="text" 
                  value={formData.externalId}
                  onChange={(e) => handleFieldChange('externalId', e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded-sm px-3 py-2 text-xs text-slate-400 focus:outline-none focus:border-cyan-500/50"
                  placeholder="Enter external ID..."
                />
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-[#94a3b8]">Add Comment <span className="normal-case text-slate-600">(optional)</span></label>
            <div className="flex gap-2">
              <input type="text" placeholder="Add comment..." className="flex-1 bg-slate-950 border border-white/5 rounded-sm px-3 py-2 text-xs text-slate-400 focus:outline-none" />
              <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded transition-colors">
                <MessageSquare size={16} className="text-slate-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Content: Tabs & Visualization */}
        <div className="flex-1 bg-slate-950 p-6 overflow-hidden flex flex-col space-y-6">
          <div className="flex bg-slate-900/50 border border-white/5 p-1 rounded-lg w-fit shrink-0">
             {tabs.map(tab => (
               <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold transition-all rounded-md ${
                  activeTab === tab.id ? 'bg-[#1e293b] text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
               >
                 {tab.label}
               </button>
             ))}
          </div>

          {activeTab === 'events' && (
            <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
               {/* Metrics Row */}
               <div className="grid grid-cols-4 gap-4 h-48 shrink-0">
                 <div className="bg-white/5 border border-white/5 rounded overflow-hidden flex flex-col">
                   <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">auto_case_id</span>
                     <div className="flex gap-2">
                       <Layout size={10} className="text-slate-500" />
                       <Eye size={10} className="text-slate-500" />
                     </div>
                   </div>
                   <div className="flex-1 p-3 flex flex-col relative overflow-hidden">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-mono text-cyan-400">SQLRJey5Ytf8</span>
                        <div className="h-1 flex-1 bg-cyan-950 rounded-full overflow-hidden">
                          <div className="w-[85%] h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-mono text-cyan-400">SxUfCUQAnp9Q</span>
                        <div className="h-1 flex-1 bg-cyan-950 rounded-full overflow-hidden">
                          <div className="w-[45%] h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-mono text-cyan-400">SyZ6t7Us-Te8</span>
                        <div className="h-1 flex-1 bg-cyan-950 rounded-full overflow-hidden">
                          <div className="w-[12%] h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[8px] font-mono text-slate-600">
                        <span>0</span><span>1</span><span>10</span><span>100</span><span>1K</span>
                      </div>
                   </div>
                 </div>

                 <div className="bg-white/5 border border-white/5 rounded overflow-hidden flex flex-col">
                    <div className="px-3 py-2 border-b border-white/5 bg-white/[0.02]">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">HOSTNAME</span>
                    </div>
                    <div className="flex-1 p-3 flex flex-col items-center justify-center text-slate-800 italic text-[10px]">
                      No metadata...
                    </div>
                 </div>

                 <div className="bg-white/5 border border-white/5 rounded overflow-hidden flex flex-col">
                   <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">FILE</span>
                     <Eye size={10} className="text-slate-500" />
                   </div>
                   <div className="flex-1 p-3 flex flex-col relative overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-mono text-cyan-400 truncate w-32">./snapshots/1/snapshot/10.txt</span>
                        <div className="h-1 flex-1 bg-cyan-950 rounded-full overflow-hidden">
                          <div className="w-[100%] h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[8px] font-mono text-slate-600">
                        <span>0</span><span>1</span><span>10</span><span>100</span><span>1K</span>
                      </div>
                   </div>
                 </div>

                 <div className="bg-white/5 border border-white/5 rounded overflow-hidden flex flex-col">
                   <div className="px-3 py-2 border-b border-white/5 bg-white/[0.02]">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">labels</span>
                   </div>
                   <div className="flex-1 p-3 space-y-1">
                      <div className="flex items-center gap-2"><span className="text-[8px] font-mono px-1 bg-cyan-500/20 text-cyan-400">20230619</span><div className="h-1 w-12 bg-cyan-500"></div></div>
                      <div className="flex items-center gap-2"><span className="text-[8px] font-mono px-1 bg-cyan-500/20 text-cyan-400">at-env</span><div className="h-1 w-4 bg-cyan-500"></div></div>
                      <div className="flex items-center gap-2"><span className="text-[8px] font-mono px-1 bg-cyan-500/20 text-cyan-400">robot-linux</span><div className="h-1 w-6 bg-cyan-500"></div></div>
                   </div>
                 </div>
               </div>

               {/* Events Table Container */}
               <div className="flex-1 bg-white/5 border border-white/5 rounded-lg flex flex-col overflow-hidden">
                  <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white tracking-widest uppercase">Events</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-slate-950 border border-white/5 rounded p-0.5">
                        <select className="bg-transparent border-none text-[10px] text-slate-400 px-2 py-1 uppercase">
                          <option>raw</option>
                        </select>
                        <select className="bg-transparent border-none text-[10px] text-slate-400 px-2 py-1 uppercase">
                          <option>contains</option>
                        </select>
                        <input type="text" placeholder="Enter filter value..." className="bg-transparent border-none text-[10px] text-slate-500 px-3 py-1 outline-none min-w-[200px]" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-white/[0.05] sticky top-0 z-10">
                        <tr className="border-b border-white/5">
                          <th className="w-10 px-4 py-3"><input type="checkbox" className="accent-cyan-500" /></th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time <ChevronDown size={10} className="inline ml-1" /></th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-[#94a3b8]">grouped_scan <ChevronDown size={10} className="inline ml-1" /></th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">level <ChevronDown size={10} className="inline ml-1" /></th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">score <ChevronDown size={10} className="inline ml-1" /></th>
                          <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">raw <ChevronDown size={10} className="inline ml-1" /></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {formData.events.map((event, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3"><input type="checkbox" className="accent-cyan-500" /></td>
                            <td className="px-4 py-3 text-[10px] font-mono text-slate-400">{event.time}</td>
                            <td className="px-4 py-3 text-[10px] font-mono text-cyan-400 underline">{event.scan}</td>
                            <td className="px-4 py-3">
                               <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-sm uppercase">{event.level}</span>
                            </td>
                            <td className="px-4 py-3 text-[10px] font-mono text-slate-100">{event.score}</td>
                            <td className="px-4 py-3 text-[10px] font-mono text-slate-500 truncate max-w-xs">{event.raw}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}

          {activeTab !== 'events' && (
            <div className="flex-1 flex items-center justify-center text-slate-700 italic text-sm font-mono tracking-widest">
              Section data retrieval pending...
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.4);
        }
      `}</style>
    </div>
  );
}
