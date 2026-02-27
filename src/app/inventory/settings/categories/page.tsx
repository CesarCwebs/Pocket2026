'use client';

import React, { useState, useEffect } from "react";
import InventoryLayout from "../../InventoryLayout";
import { Plus, Trash2, X, Tag, FilePenLine, Loader2, ServerCrash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCategories, createCategory, updateCategory, deleteCategory } from './actions';

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

function CategoryModal({ onClose, onSave, category, isSaving }: { onClose: () => void; onSave: (data: any) => Promise<void>; category?: any, isSaving: boolean }) {
    const [id, setId] = useState(category?.id || '');
    const [name, setName] = useState(category?.name || '');
    const [description, setDescription] = useState(category?.description || '');

    const handleSave = async () => {
        if (!id || !name) {
            alert('El ID y el Nombre son obligatorios.');
            return;
        }
        await onSave({
            id: id.toUpperCase().replace(/\s+/g, '_'),
            name,
            description,
        });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-xl">
                <header className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-lg font-black text-zinc-800 dark:text-white">{category ? 'Editar' : 'Nueva'} Categoría</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="w-4 h-4" /></button>
                </header>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-zinc-500">ID Categoría (Sin espacios)</label>
                        <input type="text" value={id} onChange={e => setId(e.target.value)} disabled={!!category} placeholder="EJEMPLO_CATEGORIA" className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm disabled:opacity-50" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-zinc-500">Nombre</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre de la Categoría" className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-zinc-500">Descripción</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción breve" className="w-full mt-1 p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm" rows={3}></textarea>
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

export default function CategoriesSettingsPage() {
  const [activeTab, setActiveTab] = useState("Ajustes");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
        try {
            setIsLoading(true);
            const data = await getCategories();
            if (Array.isArray(data)) {
                setCategories(data);
            } else if (data && 'error' in data) {
                throw new Error(data.error);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }
    loadData();
  }, []);

  const handleSaveCategory = async (data: any) => {
    setIsSaving(true);
    const { id, ...rest } = data;
    const result = editingCategory 
        ? await updateCategory(editingCategory.id, rest) 
        : await createCategory(data);
    
    if (result.success) {
      toast({ title: 'Operación exitosa', description: result.message });
      closeModal();
    } else {
      toast({ variant: 'destructive', title: 'Error en la operación', description: result.message });
    }
    setIsSaving(false);
  };
  
  const openModal = (category?: any) => {
      setEditingCategory(category || null);
      setIsModalOpen(true);
  }

  const closeModal = () => {
      setIsModalOpen(false);
      setEditingCategory(null);
  }

  const handleDelete = async (id: string) => {
      if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')){
          const result = await deleteCategory(id);
          if (result.success) {
            toast({ title: 'Categoría eliminada', description: result.message });
          } else {
            toast({ variant: 'destructive', title: 'Error al eliminar', description: result.message });
          }
      }
  }

  return (
    <InventoryLayout activeTab={activeTab} setActiveTab={setActiveTab}>
       <AnimatePresence>
        {isModalOpen && <CategoryModal onClose={closeModal} onSave={handleSaveCategory} category={editingCategory} isSaving={isSaving}/>}
      </AnimatePresence>

      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-8 h-20 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-500" />
            <span>Administrador de Categorías</span>
          </h1>
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Clasifica y organiza los tipos de materiales.</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" />
            <span>Nueva Categoría</span>
        </button>
      </header>

      <div className="p-8">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-100 dark:border-zinc-800">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">ID Categoría</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Nombre</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Descripción</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Creado</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                         {isLoading ? (
                            <tr><td colSpan={5} className="text-center p-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-400" /></td></tr>
                        ) : error ? (
                            <tr><td colSpan={5} className="text-center p-8 text-rose-500 font-semibold flex flex-col items-center gap-2"><ServerCrash className="w-8 h-8" /><p>{error}</p></td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan={5} className="text-center p-8 text-zinc-500 font-semibold">No hay categorías creadas todavía.</td></tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-blue-600 dark:text-blue-400">{cat.id}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-zinc-800 dark:text-zinc-200">{cat.name}</td>
                                    <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{cat.description}</td>
                                    <td className="px-6 py-4 text-sm text-zinc-500">{new Date(cat.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openModal(cat)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-blue-500"><FilePenLine className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
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
