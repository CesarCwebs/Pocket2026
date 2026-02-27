'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import InventoryLayout from "./InventoryLayout"; // Importamos el Layout
import { 
  Package, Search, Plus, Filter, ArrowUpRight, ArrowDownRight, MoreHorizontal, 
  Box, AlertTriangle, ChevronDown, Download, LayoutGrid, List, SlidersHorizontal, 
  RefreshCcw, ArrowLeft, LogIn, LogOut, FileText, CheckCircle2, Clock3, User, 
  MapPin, TrendingUp, TrendingDown, Activity, Truck, AlertCircle, BarChart3, 
  PieChart as PieChartIcon, Layers, Zap, Calendar, Target, ShoppingCart, 
  ArrowRight, Database, History, ShieldCheck, Eye, Trash2, Droplet 
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

// --- Tipos ---
interface Material {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  image: string;
  icon: any;
  subInv: string;
  loc: string;
  unit: string;
}

// --- Mock Data de Materiales ---
const MATERIALS: Material[] = [
  { 
    id: "1", 
    name: "Aceite SAE 15W-40 Premium", 
    sku: "OIL-15W40-01", 
    category: "LUBRICANTES", 
    stock: 450, 
    minStock: 100, 
    price: 120, 
    status: "In Stock", 
    image: "https://images.unsplash.com/photo-1584225059632-1e9babe3580c?q=80&w=400",
    icon: Droplet, 
    subInv: "SUB_ACE", 
    loc: "LOC-ACE-ALM-R01-N01", 
    unit: "LT" 
  },
  { 
    id: "2", 
    name: "Filtro de Aire P-123", 
    sku: "FIL-AIR-P123", 
    category: "FILTROS", 
    stock: 85, 
    minStock: 50, 
    price: 250, 
    status: "In Stock", 
    image: "https://images.unsplash.com/photo-1621881538051-01b3fe54432d?q=80&w=400",
    icon: Filter,
    subInv: "SUB_REF",
    loc: "LOC-REF-ALM-R03-N02",
    unit: "PZA"
  },
  { 
    id: "3", 
    name: "Batería 12V 800CCA", 
    sku: "BAT-12V-800", 
    category: "BATERÍAS", 
    stock: 18, 
    minStock: 20, 
    price: 2800, 
    status: "Low Stock", 
    image: "https://images.unsplash.com/photo-1599599810694-b5b37304c293?q=80&w=400",
    icon: Zap,
    subInv: "SUB_REF",
    loc: "LOC-REF-ALM-R05-N01",
    unit: "PZA"
  },
  { 
    id: "4", 
    name: "Tornillería Surtida (Caja)", 
    sku: "TORN-SUR-01", 
    category: "FERRETERÍA", 
    stock: 0, 
    minStock: 10, 
    price: 850, 
    status: "Out of Stock", 
    image: "https://images.unsplash.com/photo-1593348824334-99a531405a80?q=80&w=400",
    icon: Layers,
    subInv: "SUB_FER",
    loc: "LOC-FER-ALM-R11-N03",
    unit: "CAJA"
  }
];

const STATS = [
  { label: "Exactitud Stock", value: "99.2%", change: "+0.5%", icon: Target, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { label: "Valor Inventario", value: "$1.2M", change: "+3.4%", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { label: "Rotación (30d)", value: "1,240", change: "+8%", icon: RefreshCcw, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
  { label: "Bajo Mínimo", value: "18", change: "+3", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
  { label: "Auditados", value: "100%", change: "Ok", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { label: "SKUs Activos", value: "857", change: "+22", icon: Layers, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { label: "Mov. Hoy", value: "61", change: "+11", icon: Activity, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  { label: "Pte. Entrada", value: "15", change: "Alta", icon: LogIn, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
];

function StatusBadge({ status }: { status: Material["status"] }) {
  const styles = {
    "In Stock": "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
    "Low Stock": "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-500/20",
    "Out of Stock": "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100 dark:border-rose-500/20",
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[status]}`}>{status}</span>;
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

// --- Componente de Contenido del Dashboard ---
function InventoryDashboardContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  return (
    <InventoryLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 transition-colors group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Buscar materiales, SKU o categorías..."
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white dark:bg-zinc-700 shadow-sm text-blue-600" : "text-zinc-400"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === "table" ? "bg-white dark:bg-zinc-700 shadow-sm text-blue-600" : "text-zinc-400"}`}
                >
                  <List className="w-4 h-4" />
                </button>
             </div>
             <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />
             <button 
              onClick={() => router.push('/inventory/create')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
             >
                <Plus className="w-4 h-4" />
                <span>Nuevo Material</span>
             </button>
          </div>
        </header>
        
        <div className="p-8 flex-1">
           <AnimatePresence mode="wait">
              {activeTab === "Dashboard" && (
                <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                      {STATS.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 p-5 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-transform hover:scale-[1.02]">
                           <div className="flex justify-between items-start mb-3">
                              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", stat.bg)}>
                                 <stat.icon className={cn("w-4 h-4", stat.color)} />
                              </div>
                              <span className="text-[9px] font-black text-blue-500">{stat.change}</span>
                           </div>
                           <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                           <h3 className="text-xl font-black mt-0.5 dark:text-white">{stat.value}</h3>
                        </div>
                      ))}
                   </div>
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 bg-white dark:bg-zinc-900/40 backdrop-blur-sm rounded-[3rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                         <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black tracking-tighter dark:text-white">Materiales Críticos</h3>
                            <button onClick={() => setActiveTab("Stock Maestro")} className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">Ver Stock Maestro</button>
                         </div>
                         <div className="space-y-4">
                            {MATERIALS.slice(0, 4).map((material) => (
                               <div key={material.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-blue-500/30 transition-all group">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                                        <ImageWithFallback src={material.image} alt={material.name} />
                                     </div>
                                     <div>
                                        <p className="text-sm font-bold dark:text-white group-hover:text-blue-500 transition-colors">{material.name}</p>
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{material.sku}</p>
                                     </div>
                                  </div>
                                  <StatusBadge status={material.status} />
                                  <div className="text-right">
                                     <p className="text-sm font-black dark:text-white">{material.stock} {material.unit}</p>
                                     <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Stock Actual</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-white dark:bg-zinc-900/40 backdrop-blur-sm rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm h-full">
                           <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                              <PieChartIcon className="w-8 h-8 text-blue-500" />
                           </div>
                           <h3 className="text-xl font-black tracking-tighter mb-2 dark:text-white">Distribución</h3>
                           <p className="text-xs text-zinc-500 font-medium mb-8 leading-relaxed">Análisis de materiales por categoría y subinventario operativo.</p>
                           <div className="space-y-3 mb-8">
                              {['LUBRICANTES', 'FILTROS', 'REPUESTOS'].map(cat => (
                                <div key={cat} className="flex justify-between items-center text-[10px] font-black uppercase">
                                  <span className="text-zinc-500">{cat}</span>
                                  <span className="dark:text-white">{Math.floor(Math.random()*40)+20}%</span>
                                </div>
                              ))}
                           </div>
                           <button className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg hover:scale-[1.02]">Generar Reporte BI</button>
                        </div>
                      </div>
                   </div>
                </motion.div>
              )}
              {activeTab === "Stock Maestro" && (
                <motion.div key="stock-maestro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                   <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-3xl font-black tracking-tighter dark:text-white uppercase">Stock Maestro</h2>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">Archivo de Control de Materiales e Items</p>
                      </div>
                      <div className="flex gap-2">
                         <button className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                            <Download className="w-3.5 h-3.5" />
                            Exportar CSV
                         </button>
                         <button className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                            <Filter className="w-3.5 h-3.5" />
                            Filtros
                         </button>
                      </div>
                   </div>
                   {viewMode === "grid" ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {MATERIALS.map((material) => (
                           <motion.div key={material.id} whileHover={{ y: -5 }} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-xl transition-all group">
                              <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 border border-zinc-100 dark:border-zinc-800 relative">
                                 <ImageWithFallback src={material.image} alt={material.name} className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                 <div className="absolute top-4 right-4"><StatusBadge status={material.status} /></div>
                              </div>
                              <div className="space-y-4">
                                 <div>
                                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">{material.category}</p>
                                    <h4 className="text-lg font-black tracking-tight dark:text-white line-clamp-1">{material.name}</h4>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{material.sku}</p>
                                 </div>
                                 <div className="grid grid-cols-2 gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                    <div><span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Localizador</span><span className="text-[10px] font-bold dark:text-zinc-300 truncate block">{material.loc}</span></div>
                                    <div className="text-right"><span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Stock</span><span className="text-[10px] font-black dark:text-white block">{material.stock} {material.unit}</span></div>
                                 </div>
                                 <div className="flex gap-2 pt-2">
                                    <button className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">Editar</button>
                                    <button className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                 </div>
                              </div>
                           </motion.div>
                        ))}
                     </div>
                   ) : (
                     <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
                                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Material / SKU</th>
                                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Categoría</th>
                                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Estado</th>
                                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Sub-Inv / Loc</th>
                                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Stock</th>
                                 <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Acciones</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                              {MATERIALS.map((material) => (
                                 <tr key={material.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 flex-shrink-0"><ImageWithFallback src={material.image} alt={material.name} /></div><div><p className="text-sm font-bold dark:text-white group-hover:text-blue-600 transition-colors">{material.name}</p><p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{material.sku}</p></div></div></td>
                                    <td className="px-6 py-4"><span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{material.category}</span></td>
                                    <td className="px-6 py-4 text-center"><StatusBadge status={material.status} /></td>
                                    <td className="px-6 py-4"><p className="text-[10px] font-black dark:text-zinc-300 uppercase">{material.subInv}</p><p className="text-[9px] font-bold text-zinc-500 uppercase">{material.loc}</p></td>
                                    <td className="px-6 py-4 text-right"><p className="text-sm font-black dark:text-white">{material.stock}</p><p className="text-[10px] font-bold text-zinc-500 uppercase">{material.unit}</p></td>
                                    <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-blue-500"><Eye className="w-4 h-4" /></button><button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><MoreHorizontal className="w-4 h-4" /></button></div></td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                   )}
                </motion.div>
              )}
           </AnimatePresence>
        </div>
    </InventoryLayout>
  );
}

// El export default ahora es el componente contenedor del dashboard
export default InventoryDashboardContent;
