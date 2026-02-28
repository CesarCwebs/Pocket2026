'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Package,
  LayoutGrid,
  List,
  LogIn,
  LogOut,
  AlertTriangle,
  Download,
  ArrowLeft,
  Activity,
  SlidersHorizontal, // Icono para Ajustes
} from 'lucide-react';

const MENU_ITEMS = [
  { icon: LayoutGrid, label: 'Dashboard', path: '/inventory' },
  { icon: List, label: 'Stock Maestro', path: '/inventory' },
  { icon: LogIn, label: 'Entradas', path: '/inventory' },
  { icon: LogOut, label: 'Salidas', path: '/inventory' },
  { icon: AlertTriangle, label: 'Alertas', path: '/inventory' },
  { icon: Download, label: 'Reportes', path: '/inventory' },
];

// Ruta corregida para apuntar a la página principal de Ajustes
const SETTINGS_ITEM = { icon: SlidersHorizontal, label: 'Ajustes', path: '/inventory/settings' };

export default function InventoryLayout({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab: string, setActiveTab: (tab: string) => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNav = (item: { label: string, path: string }) => {
    setActiveTab(item.label);
    if (pathname !== item.path) {
      router.push(item.path);
    }
  };

  const isMainTabActive = (itemLabel: string) => {
    // Si la pestaña activa es la del item Y no estamos en la sección de ajustes
    return activeTab === itemLabel && !pathname.startsWith('/inventory/settings');
  };

  const isSettingsTabActive = () => {
    // La pestaña de ajustes está activa si su label es el activo O si la ruta actual empieza con /inventory/settings
    return activeTab === 'Ajustes' || pathname.startsWith('/inventory/settings');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-500">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 z-40 hidden lg:block">
        <div className="p-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Volver al Hub</span>
          </button>

          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight leading-none uppercase dark:text-white">POCKET RENTALS</h2>
              <p className="text-[10px] font-bold text-blue-500 tracking-widest uppercase mt-1">INVENTARIO</p>
            </div>
          </div>

          <nav className="space-y-1">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${ 
                  isMainTabActive(item.label)
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
            
            <div className="pt-4">
              <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <button
              onClick={() => handleNav(SETTINGS_ITEM)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${ 
                  isSettingsTabActive()
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <SETTINGS_ITEM.icon className="w-5 h-5" />
              {SETTINGS_ITEM.label}
            </button>
          </nav>
        </div>

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
      </aside>

      <main className="lg:pl-64 min-h-screen flex flex-col">
        {children}
      </main>
    </div>
  );
}
