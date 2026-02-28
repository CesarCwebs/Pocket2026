'use client';

import React, { useState, useEffect, useTransition } from "react";
import {
  ArrowLeft, Package, MapPin, Warehouse, Grid3x3, Navigation, Box, Lock, Unlock,
  CheckCircle2, Info, Save, Sparkles, ArrowRight, Layers, LayoutGrid, List,
  LogIn, LogOut, AlertTriangle, Download, Activity, Edit
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getLocation, updateLocation } from "../actions";
import { useToast } from "@/hooks/use-toast";

// Define the structure of a location
interface LocationData {
  almacen: string;
  zona: string;
  pasillo: string;
  estanteria: string;
  nivel: string;
  posicion: string;
  tipoUbicacion: string;
  estado: string;
  id?: string;
}

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const [activeTab] = useState("Localizadores");
  const [isPending, startTransition] = useTransition();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [formData, setFormData] = useState<Partial<LocationData>>({});

  const locationId = params.locationId as string;

  useEffect(() => {
    if (locationId) {
      const fetchLocation = async () => {
        const data = await getLocation(locationId);
        if (data) {
            const locationData = data as LocationData;
            setLocation(locationData);
            setFormData({ 
                tipoUbicacion: locationData.tipoUbicacion,
                estado: locationData.estado
            });
        } else {
          toast({ variant: "destructive", title: "Error", description: "No se pudo encontrar el localizador." });
          router.back();
        }
      };
      fetchLocation();
    }
  }, [locationId, router, toast]);

  const MENU_ITEMS = [
    { icon: LayoutGrid, label: "Dashboard" },
    { icon: List, label: "Stock Maestro" },
    { icon: LogIn, label: "Entradas" },
    { icon: LogOut, label: "Salidas" },
    { icon: AlertTriangle, label: "Alertas" },
    { icon: Download, label: "Reportes" },
    { icon: MapPin, label: "Localizadores" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateLocation(locationId, formData);
      if (result.success) {
        toast({ title: "Éxito", description: result.message || "Localizador actualizado con éxito." });
        router.push("/inventory/settings/locations");
      } else {
        toast({
          variant: "destructive",
          title: "Error al actualizar",
          description: result.message,
        });
      }
    });
  };

  const handleChange = (field: keyof Pick<LocationData, 'tipoUbicacion' | 'estado'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const tiposUbicacion = [
    { value: "Picking", label: "Picking", color: "sky" },
    { value: "Reserva", label: "Reserva", color: "blue" },
    { value: "Devolución", label: "Devolución", color: "amber" },
    { value: "Cuarentena", label: "Cuarentena", color: "rose" },
    { value: "Consolidación", label: "Consolidación", color: "violet" }
  ];

  if (!location) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Layers className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="ml-4 text-lg font-semibold">Cargando Localizador...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-500">
      
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 z-40 hidden lg:block">
        <div className="p-6">
          <button onClick={() => router.push("/hub")} className="flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors mb-8 group">
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
            {MENU_ITEMS.map((item, idx) => (
              <button key={idx} onClick={() => router.push("/inventory")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === item.label ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"}`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-8 left-6 right-6">
           <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400"><Activity className="w-3 h-3 text-blue-500" /><span>Estado Nodo</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" /><span className="text-[10px] font-bold text-zinc-500">Sincronizado v2.4</span></div>
           </div>
        </div>
      </aside>

      <main className="lg:pl-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase dark:text-white">Editar Localizador</h1>
              <p className="text-sm font-mono text-blue-500 tracking-tighter font-bold">{location.id}</p>
            </div>
          </div>
          <button onClick={() => router.back()} className="hidden lg:flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            Cancelar
          </button>
        </header>

        <div className="p-8">
          <div className="max-w-5xl mx-auto">
             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2"><label className="text-xs font-bold text-zinc-500 uppercase">Almacén</label><p className="font-semibold text-lg">{location.almacen}</p></div>
                        <div className="space-y-2"><label className="text-xs font-bold text-zinc-500 uppercase">Zona</label><p className="font-semibold text-lg">{location.zona}</p></div>
                        <div className="space-y-2"><label className="text-xs font-bold text-zinc-500 uppercase">Pasillo</label><p className="font-semibold text-lg">{location.pasillo}</p></div>
                        <div className="space-y-2"><label className="text-xs font-bold text-zinc-500 uppercase">Estantería</label><p className="font-semibold text-lg">{location.estanteria}</p></div>
                        <div className="space-y-2"><label className="text-xs font-bold text-zinc-500 uppercase">Nivel</label><p className="font-semibold text-lg">{location.nivel}</p></div>
                        <div className="space-y-2"><label className="text-xs font-bold text-zinc-500 uppercase">Posición</label><p className="font-semibold text-lg">{location.posicion}</p></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-xl flex items-center justify-center"><Box className="w-5 h-5 text-amber-600 dark:text-amber-400" /></div><div><h3 className="text-lg font-black tracking-tight dark:text-white">Configuración</h3><p className="text-xs text-zinc-500 font-semibold">Ajusta el tipo y estado de la ubicación.</p></div></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Tipo de Ubicación *</label>
                            <div className="grid grid-cols-1 gap-3">
                                {tiposUbicacion.map((tipo) => {
                                const isSelected = formData.tipoUbicacion === tipo.value;
                                const colorClasses = { sky: "border-sky-500 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300", blue: "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300", amber: "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300", rose: "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300", violet: "border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300" };
                                return (<button key={tipo.value} type="button" onClick={() => handleChange('tipoUbicacion', tipo.value)} className={`relative px-4 py-3 rounded-xl text-sm font-bold text-left transition-all border-2 ${isSelected ? colorClasses[tipo.color as keyof typeof colorClasses] : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"}`}><div className="flex items-center justify-between"><span>{tipo.label}</span>{isSelected && <CheckCircle2 className="w-5 h-5" />}</div></button>);
                                })}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Estado *</label>
                            <div className="space-y-3">
                                <button type="button" onClick={() => handleChange('estado', "Activo")} className={`w-full px-4 py-4 rounded-xl text-sm font-bold text-left transition-all border-2 ${formData.estado === "Activo" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300"}`}><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.estado === "Activo" ? "bg-blue-500" : "bg-zinc-200 dark:bg-zinc-700"}`}><Unlock className="w-5 h-5 text-white" /></div><div className="flex-1"><p className="font-black dark:text-white">Activo</p><p className="text-xs text-zinc-500 font-medium">Disponible para asignación</p></div>{formData.estado === "Activo" && <CheckCircle2 className="w-5 h-5 text-blue-600" />}</div></button>
                                <button type="button" onClick={() => handleChange('estado', "Bloqueado")} className={`w-full px-4 py-4 rounded-xl text-sm font-bold text-left transition-all border-2 ${formData.estado === "Bloqueado" ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20" : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300"}`}><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.estado === "Bloqueado" ? "bg-rose-500" : "bg-zinc-200 dark:bg-zinc-700"}`}><Lock className="w-5 h-5 text-white" /></div><div className="flex-1"><p className="font-black dark:text-white">Bloqueado</p><p className="text-xs text-zinc-500 font-medium">No disponible temporalmente</p></div>{formData.estado === "Bloqueado" && <CheckCircle2 className="w-5 h-5 text-rose-600" />}</div></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl px-8 py-6 shadow-lg">
                    <div className="flex items-center justify-between gap-4">
                        <button type="button" onClick={() => router.back()} disabled={isPending} className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-2xl font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Cancelar</button>
                        <div className="flex items-center gap-3">
                            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                                {isPending ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Layers className="w-5 h-5" /></motion.div><span>Actualizando...</span></>) : (<><Save className="w-5 h-5" /><span>Guardar Cambios</span><ArrowRight className="w-5 h-5" /></>)}
                            </button>
                        </div>
                    </div>
                </div>
             </form>
          </div>
        </div>
      </main>
    </div>
  );
}
