'use client';

import { X } from "lucide-react";
import { motion } from "framer-motion";

export function ItemForm({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800"
    >
      <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <h2 className="text-2xl font-black tracking-tighter">Nuevo Material</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8">
        <p className="text-center text-zinc-500">El formulario para agregar nuevos materiales irá aquí.</p>
      </div>
    </motion.div>
  );
}
