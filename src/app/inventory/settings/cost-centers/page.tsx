'use client';

import React, { useState, useEffect } from "react";
import InventoryLayout from "../../InventoryLayout";
import { Plus, Trash2, X, Building, FilePenLine, Loader2, ServerCrash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCostCenters, createCostCenter, updateCostCenter, deleteCostCenter } from './actions';

const useToast = () => ({
  toast: ({ variant, title, description }: { variant?: string, title: string, description: string }) => {
    console.log(`TOAST (${variant || 'default'}): ${title} - ${description}`);
    const message = (variant === 'destructive' ? `ERROR: ${title}\n` : `SUCCESS: ${title}\n`) + description;
    alert(message);
    if (variant !== 'destructive') {
      window.location.reload(); 
    }
  },
});

function CostCenterModal({ onClose, onSave, costCenter, isSaving }: { onClose: () => void; onSave: (data: any) => Promise<void>; costCenter?: any, isSaving: boolean }) {
    const [id, setId] = useState(costCenter?.id || '');
    const [name, setName] = useState(costCenter?.name || '');
    const [area, setArea] = useState(costCenter?.area || '');

    const handleSave = async () => {
        if (!id || !name || !area) {
            alert('Todos los campos son obligatorios.');
            return;
        }
        await onSave({
            id: id.toUpperCase().replace(/\s+/g, '_'),
            name,
            area,
        });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-xl">
                <header className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-lg font-black text-zinc-800 dark:text-white">{costCenter ? 'Editar' : 'Nuevo'} Centro de Costo</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="w-4 h-4" /></button>
                </header>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-zinc-500">ID Centro de Costo</label>
                        <input type="text" value={id} onChange={e => setId(e.target.value)} disabled={!!costCenter} placeholder="ID_UNICO" className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm disabled:opacity-50" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-zinc-500">Nombre del Centro</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre Descriptivo" className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm" />
                    </div>
                     <div>
                        <label className="text-xs font-bold text-zinc-500">Área Funcional</label>
                        <input type="text" value={area} onChange={e => setArea(e.target.value)} placeholder="Ej: Operaciones" className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm" />
                    </div>
                </div>
                <footer className="p-4 flex justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
                    <button onClick={onClose} disabled={isSaving} className="px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50">Cancelar</button>
                    <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 w-28 flex justify-center items-center">
                         {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
                    </button>
                </footer>
            </motion.div>
        </motion.div>
    )
}

export default function CostCentersSettingsPage() {
  const [activeTab, setActiveTab] = useState("Ajustes");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [costCenters, setCostCenters] = useState<any[]>([]);
  const [editingCostCenter, setEditingCostCenter] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
        try {
            setIsLoading(true);
            const data = await getCostCenters();
            if (Array.isArray(data)) {
                setCostCenters(data);
            } else {
                throw new Error(data.error || 'Error al cargar los datos.');
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }
    loadData();
  }, []);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    const { id, ...rest } = data;
    const result = editingCostCenter 
        ? await updateCostCenter(editingCostCenter.id, rest) 
        : await createCostCenter(data);
    
    if (result.success) {
      toast({ title: 'Operación exitosa', description: result.message });
      closeModal();
    } else {
      toast({ variant: 'destructive', title: 'Error en la operación', description: result.message });
    }
    setIsSaving(false);
  };
  
  const openModal = (costCenter?: any) => {
      setEditingCostCenter(costCenter || null);
      setIsModalOpen(true);
  }

  const closeModal = () => {
      setIsModalOpen(false);
      setEditingCostCenter(null);
  }

  const handleDelete = async (id: string) => {
      if (window.confirm('¿Estás seguro de que quieres eliminar este centro de costo?')){
          const result = await deleteCostCenter(id);
          if (result.success) {
            toast({ title: 'Centro de costo eliminado', description: result.message });
          } else {
            toast({ variant: 'destructive', title: 'Error al eliminar', description: result.message });
          }
      }
  }

  return (
    <InventoryLayout activeTab={activeTab} setActiveTab={setActiveTab}>
       <AnimatePresence>
        {isModalOpen && <CostCenterModal onClose={closeModal} onSave={handleSave} costCenter={editingCostCenter} isSaving={isSaving} />}
      </AnimatePresence>

      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-8 h-20 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-500" />
            <span>Administrador de Centros de Costo</span>
          </h1>
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Gestiona los centros de costo para el seguimiento financiero.</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" />
            <span>Nuevo Centro</span>
        </button>
      </header>

      <div className="p-8">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-100 dark:border-zinc-800">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">ID Centro de Costo</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Nombre</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Área Funcional</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Creado</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center p-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-400" /></td></tr>
                        ) : error ? (
                            <tr><td colSpan={5} className="text-center p-8 text-rose-500 font-semibold flex flex-col items-center gap-2"><ServerCrash className="w-8 h-8" /><p>{error}</p></td></tr>
                        ) : costCenters.length === 0 ? (
                            <tr><td colSpan={5} className="text-center p-8 text-zinc-500 font-semibold">No hay centros de costo creados todavía.</td></tr>
                        ) : (
                            costCenters.map((cc) => (
                                <tr key={cc.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-blue-600 dark:text-blue-400">{cc.id}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-zinc-800 dark:text-zinc-200">{cc.name}</td>
                                    <td className="px-6 py-4 text-sm text-zinc-500"><span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-xs font-bold">{cc.area}</span></td>
                                    <td className="px-6 py-4 text-sm text-zinc-500">{new Date(cc.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openModal(cc)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-blue-500"><FilePenLine className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(cc.id)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </InventoryLayout>
  );
}
