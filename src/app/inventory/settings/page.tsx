'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InventoryLayout from "../InventoryLayout";
import { ChevronRight, MapPin, Tag, Building, Package } from "lucide-react";
import { motion } from "framer-motion";

const CATALOGS = [
  {
    name: "Localizadores",
    description: "Gestiona las ubicaciones físicas del almacén.",
    icon: MapPin,
    path: "/inventory/settings/locations",
    color: "text-sky-500",
    bgColor: "bg-sky-50",
  },
  {
    name: "Categorías",
    description: "Clasifica y organiza los tipos de materiales.",
    icon: Tag,
    path: "/inventory/settings/categories",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    name: "Centros de Costo",
    description: "Administra los centros de costo para el seguimiento financiero.",
    icon: Building,
    path: "/inventory/settings/cost-centers",
    color: "text-violet-500",
    bgColor: "bg-violet-50",
  },
  {
    name: "Unidades de Medida",
    description: "Define las unidades para el control de stock.",
    icon: Package,
    path: "/inventory/settings/units",
    color: "text-rose-500",
    bgColor: "bg-rose-50",
  },
];

function CatalogCard({ name, description, icon: Icon, path, color, bgColor }: (typeof CATALOGS)[0]) {
    const router = useRouter();

    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 cursor-pointer group"
            onClick={() => router.push(path)}
        >
            <div className="flex items-center justify-between">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="mt-4">
                <h3 className="text-md font-black text-zinc-800 dark:text-white">{name}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{description}</p>
            </div>
        </motion.div>
    )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Ajustes");

  return (
    <InventoryLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-8 h-20 flex items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">Ajustes del Módulo</h1>
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Administración de catálogos y datos maestros.</p>
        </div>
      </header>

      <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATALOGS.map((catalog) => (
                  <CatalogCard key={catalog.name} {...catalog} />
              ))}
          </div>
      </div>
    </InventoryLayout>
  );
}
