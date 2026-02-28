
'use client';

import { Activity } from 'lucide-react';

export default function NodeStatus() {
  return (
    <div className="absolute bottom-8 left-6 right-6">
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
          <Activity className="w-3 h-3 text-blue-500" />
          <span>Estado Nodo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-zinc-500">Sincronizado v2.6</span>
        </div>
      </div>
    </div>
  );
}
