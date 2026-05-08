import { Database, Server, Globe, Lock, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

interface Asset {
  id: string;
  name: string;
  status: string;
  threatLevel: number;
  iconClass: string;
  isUnderAttack: boolean;
}

interface NetworkMapProps {
  assets: Asset[];
  onSelectNode: (asset: Asset) => void;
}

export function NetworkMap({ assets, onSelectNode }: NetworkMapProps) {
  
  // Icon mapping
  const getIcon = (iconClass: string) => {
    switch(iconClass) {
      case 'lucide-database': return <Database className="w-8 h-8 text-cyan-400 mb-2 group-hover:text-white" />;
      case 'lucide-server': return <Server className="w-8 h-8 text-cyan-400 mb-2 group-hover:text-white" />;
      case 'lucide-globe': return <Globe className="w-8 h-8 text-cyan-400 mb-2 group-hover:text-white" />;
      case 'lucide-lock': return <Lock className="w-8 h-8 text-cyan-400 mb-2 group-hover:text-white" />;
      case 'lucide-cpu': return <Cpu className="w-8 h-8 text-cyan-400 mb-2 group-hover:text-white" />;
      default: return <Server className="w-8 h-8 text-cyan-400 mb-2" />;
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'infected') return 'text-red-400';
    if (status === 'warning') return 'text-amber-400';
    return 'text-emerald-400';
  };

  const nodePositions = [
    { left: '45%', top: '40%' }, 
    { left: '25%', top: '25%' }, 
    { left: '70%', top: '30%' }, 
    { left: '25%', top: '65%' }, 
    { left: '65%', top: '70%' }, 
  ];

  return (
    <div className="relative w-full h-full bg-slate-950/50 overflow-hidden text-slate-300">
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="alertGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
            <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M 45% 40% L 25% 25%" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="opacity-50 [stroke-dasharray:10_10] animate-[dash_3s_linear_infinite]" />
        <path d="M 45% 40% L 70% 30%" stroke="url(#alertGradient)" strokeWidth="2" fill="none" className="animate-pulse [stroke-dasharray:5_5] animate-[dash_2s_linear_infinite]" />
        <path d="M 45% 40% L 25% 65%" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="opacity-50 [stroke-dasharray:10_10] animate-[dash_4s_linear_infinite]" />
        <path d="M 45% 40% L 65% 70%" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="opacity-50 [stroke-dasharray:10_10] animate-[dash_3s_linear_infinite]" />
        <path d="M 25% 25% L 25% 65%" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="4" fill="none" className="opacity-30" />
        <path d="M 70% 30% L 65% 70%" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="4" fill="none" className="opacity-30" />
      </svg>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>

      <div className="absolute inset-0 w-full h-full pt-16 z-10">
        {assets.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer flex flex-col items-center`}
            style={{ left: nodePositions[i].left, top: nodePositions[i].top }}
            onClick={() => onSelectNode(node)}
          >
            {node.isUnderAttack && (
               <div className="absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center z-20">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]"></span>
               </div>
            )}
            
            <div className={`hex-icon ${node.status} relative`}>
              {getIcon(node.iconClass)}
              <span className={`text-[10px] mt-1 font-mono uppercase tracking-widest ${getStatusColor(node.status)}`}>
                {node.name}
              </span>
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-slate-900 border border-slate-700 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 flex flex-col items-center">
                <span className="text-xs font-bold text-white">{node.name}</span>
                <span className={`text-[10px] uppercase font-mono tracking-wider ${getStatusColor(node.status)}`}>
                  Status: {node.status}
                </span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-700"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
