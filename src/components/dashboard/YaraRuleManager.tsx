import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Database, Download, FileCode2, Power, Trash2, Edit2, Check, X, Upload, Tag, Box, Search, Plus } from 'lucide-react';

interface YaraRule {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  content: string;
  assets?: string[];
  room?: string; // Yara-Room methodology reference
}

const ASSET_TYPES = ['WebServer', 'Database', 'Endpoint', 'DMZ', 'Internal', 'Cloud'];
const ROOMS = ['Infiltration', 'Persistence', 'Exfiltration', 'Cleanup', 'Malware-Lab'];

export function YaraRuleManager() {
  const [rules, setRules] = useState<YaraRule[]>([]);
  const [selectedRule, setSelectedRule] = useState<YaraRule | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [syncRules, setSyncRules] = useState<YaraRule[]>([]);
  const [showSyncHub, setShowSyncHub] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/yara/rules');
      const data = await res.json();
      setRules(data);
    } catch (err) {
      console.error('Failed to fetch rules', err);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setShowSyncHub(true);
    try {
      const res = await fetch('/api/yara/sync');
      const data = await res.json();
      setSyncRules(data);
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const importSyncedRule = async (rule: YaraRule) => {
    try {
      const res = await fetch('/api/yara/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rule,
          id: undefined, // Let server generate
          category: 'Synced'
        })
      });
      const newRule = await res.json();
      setRules(prev => [...prev, newRule]);
      setSyncRules(prev => prev.filter(r => r.name !== rule.name));
    } catch (err) {
      console.error('Import failed', err);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      
      // Attempt to parse rule name from content
      let name = file.name.replace('.yar', '').replace('.yara', '');
      const ruleMatch = content.match(/rule\s+([a-zA-Z0-9_]+)/);
      if (ruleMatch && ruleMatch[1]) {
        name = ruleMatch[1];
      }
      
      try {
        const res = await fetch('/api/yara/rules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            content,
            category: 'Uploaded',
            room: 'Malware-Lab'
          })
        });
        const newRule = await res.json();
        setRules(prev => [...prev, newRule]);
        setSelectedRule(newRule);
        setIsEditing(false);
      } catch (err) {
        console.error('Upload failed', err);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsText(file);
  };

  const saveEdit = async () => {
    if (selectedRule) {
      try {
        const updated = { ...selectedRule, content: editContent };
        const res = await fetch(`/api/yara/rules/${selectedRule.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
        const saved = await res.json();
        setRules(rules.map(r => r.id === saved.id ? saved : r));
        setSelectedRule(saved);
        setIsEditing(false);
      } catch (err) {
        console.error('Failed to save', err);
      }
    }
  };

  const deleteRule = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/yara/rules/${id}`, { method: 'DELETE' });
      setRules(rules.filter(r => r.id !== id));
      if (selectedRule?.id === id) setSelectedRule(null);
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const toggleRule = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const rule = rules.find(r => r.id === id);
    if (!rule) return;
    
    try {
      const updated = { ...rule, enabled: !rule.enabled };
      const res = await fetch(`/api/yara/rules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const saved = await res.json();
      setRules(rules.map(r => r.id === saved.id ? saved : r));
      if (selectedRule?.id === id) setSelectedRule(saved);
    } catch (err) {
      console.error('Failed to toggle', err);
    }
  };

  const updateAssetAssociation = async (asset: string) => {
    if (!selectedRule) return;
    const assets = selectedRule.assets || [];
    const newAssets = assets.includes(asset) 
      ? assets.filter(a => a !== asset) 
      : [...assets, asset];
    
    try {
      const updated = { ...selectedRule, assets: newAssets };
      const res = await fetch(`/api/yara/rules/${selectedRule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const saved = await res.json();
      setRules(rules.map(r => r.id === saved.id ? saved : r));
      setSelectedRule(saved);
    } catch (err) {
      console.error('Failed to update assets', err);
    }
  };

  const updateRoom = async (room: string) => {
    if (!selectedRule) return;
    try {
      const updated = { ...selectedRule, room };
      const res = await fetch(`/api/yara/rules/${selectedRule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const saved = await res.json();
      setRules(rules.map(r => r.id === saved.id ? saved : r));
      setSelectedRule(saved);
    } catch (err) {
      console.error('Failed to update room', err);
    }
  };

  const renderHighlightedContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      let highlighted = line
        .replace(/(rule\s+)([a-zA-Z0-9_]+)/g, '<span class="text-emerald-400">$1</span><span class="text-cyan-400 font-bold">$2</span>')
        .replace(/(meta:|strings:|condition:)/g, '<span class="text-emerald-400 font-bold">$1</span>')
        .replace(/(\$[a-zA-Z0-9_]+)/g, '<span class="text-red-400">$1</span>')
        .replace(/("[^"]*")/g, '<span class="text-yellow-400">$1</span>');
      
      return <div key={i} dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} />;
    });
  };

  return (
    <div className="flex w-full h-full text-slate-300">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-slate-800/80 bg-slate-950/40 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span className="font-bold uppercase tracking-wider text-sm text-white">YARA Manager</span>
          </div>
          <div className="flex gap-2">
            <input 
              type="file" 
              accept=".yar,.yara" 
              onChange={handleFileUpload} 
              className="hidden" 
              ref={fileInputRef} 
            />
            <button 
              onClick={handleSync}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-widest transition-all
                ${isSyncing ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'}`}
            >
              <Download className={`w-3 h-3 ${isSyncing ? 'animate-bounce' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Hub'}
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded text-[10px] uppercase font-bold tracking-widest hover:bg-cyan-500/20 transition-colors"
            >
              <Upload className="w-3 h-3" />
              Upload
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {rules.length === 0 ? (
            <div className="text-center text-xs text-slate-500 py-20 font-mono italic">
              Initialization required...
            </div>
          ) : (
            rules.map(rule => (
              <div 
                key={rule.id}
                onClick={() => { setSelectedRule(rule); setIsEditing(false); }}
                className={`p-3 rounded-lg border cursor-pointer transition-all group relative overflow-hidden
                  ${selectedRule?.id === rule.id 
                    ? 'bg-slate-800 border-cyan-500/50 shadow-lg' 
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-600'}`}></div>
                    <span className={`text-sm font-mono font-bold tracking-tight ${rule.enabled ? 'text-slate-200' : 'text-slate-500'}`}>{rule.name}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => toggleRule(rule.id, e)} className="p-1 hover:text-white"><Power className="w-4 h-4" /></button>
                    <button onClick={(e) => deleteRule(rule.id, e)} className="p-1 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {rule.room && (
                    <span className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] uppercase tracking-tighter rounded">
                      Room: {rule.room}
                    </span>
                  )}
                  {rule.assets?.map(asset => (
                    <span key={asset} className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] uppercase tracking-tighter rounded">
                      {asset}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 flex flex-col h-full bg-slate-950/20">
        {selectedRule ? (
          <>
            <div className="p-6 border-b border-slate-800/80 grid grid-cols-2 gap-6 bg-slate-900/40 backdrop-blur">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold font-display text-white flex items-center gap-3">
                    <FileCode2 className="w-5 h-5 text-cyan-400" />
                    {selectedRule.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">Yara-Room Control & Asset Association</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Area of Operation (Yara-Room)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ROOMS.map(room => (
                      <button
                        key={room}
                        onClick={() => updateRoom(room)}
                        className={`px-3 py-1 text-[10px] uppercase tracking-tighter rounded border transition-colors
                          ${selectedRule.room === room 
                            ? 'bg-purple-500 border-purple-400 text-white' 
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                      >
                        {room}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-l border-slate-800 pl-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Box className="w-3 h-3" /> Scanning Profiles (Asset Types)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ASSET_TYPES.map(asset => (
                      <button
                        key={asset}
                        onClick={() => updateAssetAssociation(asset)}
                        className={`px-2 py-1.5 text-[9px] uppercase tracking-tighter rounded border transition-colors text-center
                          ${selectedRule.assets?.includes(asset) 
                            ? 'bg-blue-600 border-blue-400 text-white' 
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                      >
                        {asset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">Cancel</button>
                      <button onClick={saveEdit} className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded text-xs">Save Changes</button>
                    </div>
                  ) : (
                    <button onClick={() => { setIsEditing(true); setEditContent(selectedRule.content); }} className="px-4 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded text-xs hover:bg-cyan-400">Edit Rule Content</button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-hidden flex flex-col">
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded p-4 font-mono text-sm text-cyan-400/80 focus:outline-none focus:border-cyan-500/50 resize-none shadow-inner"
                  spellCheck={false}
                />
              ) : (
                <div className="flex-1 bg-slate-950/60 border border-slate-900 rounded p-6 font-mono text-xs overflow-y-auto leading-relaxed shadow-inner selection:bg-cyan-500/30">
                  {renderHighlightedContent(selectedRule.content)}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-700">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-mono text-sm uppercase tracking-widest">Select Node for Deep Analysis</p>
          </div>
        )}
      </div>
      {/* Sync Hub Modal */}
      {showSyncHub && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/10 rounded flex items-center justify-center border border-emerald-500/20">
                  <Download className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Global Sync Hub</h3>
                  <p className="text-[10px] text-slate-500 font-mono">REMOTE_REPO v4.1.0 // PULL_REQUESTS_PENDING</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSyncHub(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {isSyncing ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-emerald-500 animate-[shimmer_1.5s_infinite]"></div>
                  </div>
                  <p className="text-xs font-mono text-slate-500 italic">Connecting to secure repository...</p>
                </div>
              ) : syncRules.length === 0 ? (
                <div className="text-center py-20 text-slate-500 italic text-sm">
                  All community rules are currently synchronized.
                </div>
              ) : (
                syncRules.map(rule => (
                  <div key={rule.id} className="p-4 bg-slate-800/50 border border-white/5 rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-950 rounded flex items-center justify-center border border-white/5">
                        <FileCode2 className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <div>
                        <h4 className="text-sm font-mono font-bold text-slate-200">{rule.name}</h4>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[8px] uppercase tracking-widest font-bold px-1.5 py-0.5 bg-cyan-500/10 text-cyan-500 rounded border border-cyan-500/20">{rule.category}</span>
                          <span className="text-[8px] text-slate-500 font-mono italic">Source: Community</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => importSyncedRule(rule)}
                      className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center gap-2"
                    >
                      <Plus size={14} /> Include Rule
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-slate-950/50 flex justify-end">
               <button 
                onClick={() => setShowSyncHub(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"
               >
                 Close Hub
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
