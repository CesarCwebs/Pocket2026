'use client';

import React from "react";
import {
  Package,
  Truck,
  BarChart3,
  Users2,
  Settings2,
  ShoppingCart,
  ShoppingBag,
  LayoutGrid,
  ArrowRight,
  Bell,
  Search,
  ChevronDown,
  Activity,
  Zap,
  Clock,
  ExternalLink,
  LogOut,
  Settings,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

// --- Tipos e Interfaces ---

export interface ModuleTheme {
  primary: string;
  iconBg: string;
  glow: string;
  gradient: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: any;
  link: string;
  stats?: string;
  theme: ModuleTheme;
}

// --- Componentes ---

function ModuleCard({
  module,
  index,
}: {
  module: Module;
  index: number;
}) {
  const { title, description, icon: Icon, theme } = module;
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onClick={() => router.push(module.link)}
      className="group relative cursor-pointer"
    >
      <div className="relative h-full flex flex-col p-8 bg-white dark:bg-zinc-900/40 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800/50 rounded-[2.5rem] shadow-sm transition-all duration-500 overflow-hidden hover:shadow-2xl hover:border-indigo-500/30">
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="relative">
            <div
              className={`absolute -inset-2 blur-xl opacity-20 ${theme.glow} group-hover:opacity-40 transition-opacity duration-500`}
            />
            <div
              className={`relative flex items-center justify-center w-14 h-14 rounded-2xl ${theme.iconBg} shadow-sm transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3`}
            >
              <Icon
                className={`w-7 h-7 ${theme.primary} drop-shadow-md`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {module.stats && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-full border border-zinc-200 dark:border-zinc-700">
                {module.stats}
              </span>
            )}
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/50 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </div>
          </div>
        </div>

        <div className="mt-auto relative z-10">
          <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-2 transition-all duration-300 group-hover:text-indigo-500">
            {title}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2 font-medium">
            {description}
          </p>
        </div>

        <div
          className={`absolute -bottom-16 -right-16 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${theme.glow}`}
        />
      </div>
    </motion.div>
  );
}

const MODULES: Module[] = [
  {
    id: "inventario",
    title: "Stock Maestro",
    description: "Control predictivo de stock, almacenes inteligentes y SKU mapping.",
    icon: Package,
    link: "/inventory",
    stats: "320 Unidades",
    theme: {
      primary: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
      glow: "bg-emerald-500",
      gradient: "from-emerald-500/20 to-emerald-500/5",
    },
  },
  {
    id: "logistica",
    title: "Logística & Rutas",
    description: "Monitoreo en tiempo real de entregas, recolecciones y preparación de plantas.",
    icon: Truck,
    link: "/logistics",
    stats: "8 En Camino",
    theme: {
      primary: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-900/30",
      glow: "bg-blue-500",
      gradient: "from-blue-500/20 to-blue-500/5",
    },
  },
  {
    id: "compras",
    title: "Compras",
    description: "Gestión de combustible, repuestos y órdenes críticas de proveedores.",
    icon: ShoppingBag,
    link: "/procurement",
    stats: "15 Pendientes",
    theme: {
      primary: "text-violet-600 dark:text-violet-400",
      iconBg: "bg-violet-50 dark:bg-violet-900/30",
      glow: "bg-violet-500",
      gradient: "from-violet-500/20 to-violet-500/5",
    },
  },
  {
    id: "ventas",
    title: "Ventas & Contratos",
    description: "Pipeline comercial avanzado y scoring de clientes corporativos.",
    icon: ShoppingCart,
    link: "/sales",
    stats: "+12.4% Mensual",
    theme: {
      primary: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-900/30",
      glow: "bg-amber-500",
      gradient: "from-amber-500/20 to-amber-500/5",
    },
  },
  {
    id: "analitica",
    title: "BI & Analítica",
    description: "Dashboards en tiempo real y minería de datos operativos.",
    icon: BarChart3,
    link: "/analytics",
    theme: {
      primary: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-50 dark:bg-indigo-900/30",
      glow: "bg-indigo-500",
      gradient: "from-indigo-500/20 to-indigo-500/5",
    },
  },
  {
    id: "recursos",
    title: "Capital Humano",
    description: "Gestión de técnicos especializados y equipos de campo.",
    icon: Users2,
    link: "/customers",
    theme: {
      primary: "text-rose-600 dark:text-rose-400",
      iconBg: "bg-rose-50 dark:bg-rose-900/30",
      glow: "bg-rose-500",
      gradient: "from-rose-500/20 to-rose-500/5",
    },
  },
];

export default function Hub() {
  const router = useRouter();
  const userName = "Luis";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500 overflow-x-hidden">
      {/* Background Decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 dark:bg-emerald-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center shadow-lg group">
                <Zap className="w-5 h-5 text-white dark:text-black transition-transform group-hover:scale-110" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight leading-none block">POCKET RENTALS</span>
                <span className="text-[9px] font-black text-indigo-500 tracking-[0.2em] uppercase">Centro de Operaciones</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">Estado: Activo</span>
             </div>
             <button className="relative w-10 h-10 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors group">
              <Bell className="w-5 h-5 text-zinc-500 group-hover:text-indigo-500 transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-950" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black">{userName}</p>
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Administrador Principal</p>
              </div>
              <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <ImageWithFallback src="https://images.unsplash.com/photo-1762522926157-bcc04bf0b10a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1hbiUyMHBvcnRyYWl0JTIwcHJvZmlsZXxlbnwxfHx8fDE3NzE2Mzg5MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Usuario" />
              </div>
              <button 
                onClick={() => router.push("/")}
                className="p-2 text-zinc-500 hover:text-rose-500 transition-colors"
                title="Salir"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-20 max-w-[1600px] mx-auto px-6 relative z-10">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
              Gestione su <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400">
                Ecosistema ERP
              </span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              Centralice cada aspecto de su negocio con una interfaz diseñada para la velocidad. 
              Módulos inteligentes, análisis en tiempo real y flujos optimizados.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MODULES.map((module, idx) => (
            <ModuleCard key={module.id} module={module} index={idx} />
          ))}
        </div>

        <footer className="mt-32 pt-12 border-t border-zinc-200 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <p className="text-[10px] font-black text-zinc-400 tracking-widest uppercase">&copy; 2026 Pocket Rentals</p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:border-indigo-500/50 transition-colors cursor-pointer group">
                <Settings className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 group-hover:rotate-45 transition-all" />
              </div>
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:border-indigo-500/50 transition-colors cursor-pointer group">
                <HelpCircle className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
              </div>
            </div>
          </div>
          <p className="text-[10px] font-black text-zinc-400 tracking-widest uppercase">
            Estado del Servidor: <span className="text-emerald-500">Operativo</span> &bull; Latencia: 12ms
          </p>
        </footer>
      </main>
    </div>
  );
}