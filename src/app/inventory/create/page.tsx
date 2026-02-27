'use client';

import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { masterItemSchema, type MasterItemFormValues } from '../schema';
import { createMasterMaterialAction } from '../actions';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Tag, MapPin, DollarSign, AlertTriangle, Truck, Hash, Save, X, Info, Loader2, Type, LocateFixed } from "lucide-react";
import InventoryLayout from "../InventoryLayout"; 

// Mocks
const useFirebase = () => ({ firestore: {} });
const useToast = () => ({
  toast: ({ variant, title, description }: { variant?: string, title: string, description: string }) => {
    console.log(`TOAST (${variant || 'default'}): ${title} - ${description}`);
    alert((variant === 'destructive' ? `ERROR: ${title}\n` : `SUCCESS: ${title}\n`) + description);
  },
});

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Field({ label, hint, error, children, required }: { label: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode; }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-600 dark:text-zinc-300">
          {label} {required ? <span className="text-rose-500">*</span> : null}
        </label>
        {hint && <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-[11px] font-semibold text-rose-600">{error}</p>}
    </div>
  );
}

function Card({ title, subtitle, icon: Icon, children }: { title: string; subtitle: string; icon: any; children: React.ReactNode; }) {
  return (
    <section className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex items-start gap-3 border-b border-zinc-100 dark:border-zinc-800 px-6 py-5">
        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-black tracking-tight text-zinc-900 dark:text-white">{title}</h3>
          <p className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400">{subtitle}</p>
        </div>
      </div>
      <div className="px-6 py-6">{children}</div>
    </section>
  );
}

function ItemCreateForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);
  const [catalogs, setCatalogs] = useState<any>({ 
    categorias: [], 
    subInventarios: [], 
    centrosDeCosto: [], 
    unidadesDeMedida: [], 
    suppliers: [],
    localizadores: [] // Nuevo catálogo
  });

  const form = useForm<MasterItemFormValues>({
    resolver: zodResolver(masterItemSchema),
    defaultValues: {
        SKU_ID: '',
        NOMBRE: '',
        DESCRIPCION: '',
        CATEGORIA: '',
        SUB_INVENTARIO: '',
        CENTRO_COSTO: '',
        UNIDAD_MEDIDA: '',
        CLAVE_PROD_SERV_SAT: '',
        COSTO_ESTANDAR: 0,
        MONEDA: "MXN",
        IVA_TASA: 0.16,
        STOCK_MINIMO: 0,
        PROVEEDOR_PREFERENTE: '',
        ESTATUS: "ACTIVO",
        LOCALIZADOR: '', // Campo de selección
    },
    mode: "onBlur",
  });

  const { register, handleSubmit, formState: { errors } } = form;

  useEffect(() => {
    const fetchCatalogs = async () => {
      setIsLoadingCatalogs(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular carga
      setCatalogs({
        categorias: [{id: 'LUBRICANTES', name: 'Lubricantes'}, {id: 'FILTROS', name: 'Filtros'}],
        subInventarios: [{id: 'SUB_ACE', name: 'Sub Almacén Aceites', code: 'ACE'}],
        centrosDeCosto: [{id: 'MANTENIMIENTO', code: 'MTO', area: 'Mantenimiento'}],
        unidadesDeMedida: [{id: 'LT', description: 'Litro'}, {id: 'PZA', description: 'Pieza'}],
        suppliers: [{id: 'PROV-001', ID_PROVEEDOR: 'PROV-001', RAZON_SOCIAL: 'Proveedor de Aceites S.A.'}],
        localizadores: [
          { id: 'LOC-ACE-A1-R01-N01', description: 'Almacén Aceites > Rack 1 > Nivel 1' },
          { id: 'LOC-ACE-A1-R01-N02', description: 'Almacén Aceites > Rack 1 > Nivel 2' },
          { id: 'LOC-REF-B2-R05-N01', description: 'Almacén Refacciones > Rack 5 > Nivel 1' },
        ]
      });
      setIsLoadingCatalogs(false);
    };
    fetchCatalogs();
  }, []);

  const onSubmit = async (data: MasterItemFormValues) => {
    setIsSubmitting(true);
    const result = await createMasterMaterialAction(data);
    if (result.success) {
      toast({ title: 'Material Guardado', description: `El SKU "${data.SKU_ID}" se creó correctamente.` });
      router.push('/inventory');
    } else {
      toast({ variant: 'destructive', title: 'Error al guardar', description: result.message });
    }
    setIsSubmitting(false);
  };

  const commonSelectClasses = "w-full rounded-2xl border bg-white dark:bg-zinc-800 px-4 py-3 text-sm font-bold outline-none transition disabled:opacity-50";
  const commonInputClasses = "w-full rounded-2xl border bg-white dark:bg-zinc-800 px-4 py-3 text-sm font-bold outline-none transition disabled:opacity-50";
  const focusClasses = "focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10";
  const errorClasses = "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10";

  return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-8 h-20 flex items-center justify-between">
             <div>
                 <h1 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">Alta de Material Maestro</h1>
                 <p className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400">Registro de nuevo material en el sistema de inventario (MD_ITEM)</p>
             </div>
             <div className="flex items-center gap-2">
                 <button type="button" onClick={() => router.push('/inventory')} className="h-10 px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Cancelar</button>
                 <button type="submit" disabled={isSubmitting || isLoadingCatalogs} className="h-10 flex items-center gap-2 px-6 rounded-2xl bg-blue-600 text-[12px] font-black uppercase tracking-widest text-white hover:bg-blue-700 disabled:bg-blue-400 transition-all">
                     {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}
                     {isSubmitting ? 'Guardando...' : 'Guardar'}
                 </button>
             </div>
        </header>

        <div className="flex-1 p-8">
          <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
               <Card title="Identificación" subtitle="Datos básicos y comerciales del SKU" icon={Tag}> 
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                     <Field label="SKU ID" required hint="ID interno" error={errors.SKU_ID?.message}>
                        <div className="relative"><Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" /><input {...register("SKU_ID")} placeholder="Ej: PR-ACE-5W30-01" className={cn(commonInputClasses, 'pl-10', focusClasses, errors.SKU_ID && errorClasses)} /></div>
                    </Field>
                    <Field label="Categoría" required error={errors.CATEGORIA?.message}>
                        <select {...register("CATEGORIA")} disabled={isLoadingCatalogs} className={cn(commonSelectClasses, focusClasses, errors.CATEGORIA && errorClasses)}>
                            <option value="">{isLoadingCatalogs ? 'Cargando...' : 'Seleccionar...'}</option>
                            {catalogs.categorias.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </Field>
                    <div className="md:col-span-2">
                         <Field label="Nombre Comercial" required hint="Nombre principal del producto" error={errors.NOMBRE?.message}>
                            <div className="relative"><Type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" /><input {...register("NOMBRE")} placeholder="Ej: Aceite Sintético 5W-30" className={cn(commonInputClasses, 'pl-10', focusClasses, errors.NOMBRE && errorClasses)} /></div>
                        </Field>
                    </div>
                    <div className="md:col-span-2">
                         <Field label="Descripción / Especificaciones Técnicas" hint="Opcional" error={errors.DESCRIPCION?.message}>
                            <textarea {...register("DESCRIPCION")} placeholder="Información técnica, usos, compatibilidad..." rows={3} className={cn(commonInputClasses, focusClasses, errors.DESCRIPCION && errorClasses)} />
                        </Field>
                    </div>
                  </div>
              </Card>

              <Card title="Almacenamiento" subtitle="Ubicación y clasificación logística" icon={MapPin}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field label="Subinventario" required error={errors.SUB_INVENTARIO?.message}>
                        <select {...register("SUB_INVENTARIO")} disabled={isLoadingCatalogs} className={cn(commonSelectClasses, focusClasses, errors.SUB_INVENTARIO && errorClasses)}>
                            <option value="">{isLoadingCatalogs ? 'Cargando...' : 'Seleccionar...'}</option>
                            {catalogs.subInventarios.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </Field>
                     <Field label="Unidad de Medida" required error={errors.UNIDAD_MEDIDA?.message}>
                        <select {...register("UNIDAD_MEDIDA")} disabled={isLoadingCatalogs} className={cn(commonSelectClasses, focusClasses, errors.UNIDAD_MEDIDA && errorClasses)}>
                             <option value="">{isLoadingCatalogs ? 'Cargando...' : 'Seleccionar...'}</option>
                             {catalogs.unidadesDeMedida.map((u: any) => <option key={u.id} value={u.id}>{u.id} - {u.description}</option>)}
                        </select>
                    </Field>
                    <div className="md:col-span-2">
                      <Field label="Localizador Fijo" required error={errors.LOCALIZADOR?.message}>
                          <div className="relative">
                              <LocateFixed className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                              <select {...register("LOCALIZADOR")} disabled={isLoadingCatalogs} className={cn(commonSelectClasses, 'pl-10', focusClasses, errors.LOCALIZADOR && errorClasses)}>
                                  <option value="">{isLoadingCatalogs ? 'Cargando...' : 'Seleccionar localizador'}</option>
                                  {catalogs.localizadores.map((l: any) => <option key={l.id} value={l.id}>{l.description}</option>)}
                              </select>
                          </div>
                      </Field>
                    </div>
                </div>
              </Card>

              <Card title="Finanzas & Impuestos" subtitle="Costeo y facturación" icon={DollarSign}>
                 <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field label="Costo Estándar" required error={errors.COSTO_ESTANDAR?.message}><div className="relative"><DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" /><input type="number" step="0.01" {...register("COSTO_ESTANDAR")} className={cn(commonInputClasses, 'pl-10', focusClasses, errors.COSTO_ESTANDAR && errorClasses)} /></div></Field>
                    <Field label="Moneda" required><select {...register("MONEDA")} className={cn(commonSelectClasses, focusClasses)}><option value="MXN">MXN - Peso Mexicano</option><option value="USD">USD - Dólar Americano</option></select></Field>
                    <Field label="Tasa IVA" required><select {...register("IVA_TASA")} className={cn(commonSelectClasses, focusClasses)}><option value={0.16}>16% (General)</option><option value={0.08}>8% (Frontera)</option><option value={0}>0% (Exento/Tasa 0)</option></select></Field>
                    <Field label="Centro de Costo" required error={errors.CENTRO_COSTO?.message}><select {...register("CENTRO_COSTO")} disabled={isLoadingCatalogs} className={cn(commonSelectClasses, focusClasses, errors.CENTRO_COSTO && errorClasses)}><option value="">{isLoadingCatalogs ? 'Cargando...' : 'Seleccionar...'}</option>{catalogs.centrosDeCosto.map((cc: any) => <option key={cc.id} value={cc.id}>{cc.code} - {cc.area}</option>)}</select></Field>
                 </div>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card title="Control Operativo" subtitle="Alertas y proveedores" icon={AlertTriangle}>
                <div className="space-y-5">
                    <Field label="Stock Mínimo" required error={errors.STOCK_MINIMO?.message}><input type="number" {...register("STOCK_MINIMO")} className={cn(commonInputClasses, focusClasses, errors.STOCK_MINIMO && errorClasses)} /></Field>
                    <Field label="Clave SAT (PS)" hint="Opcional"><input {...register("CLAVE_PROD_SERV_SAT")} placeholder="Ej: 15101505" className={cn(commonInputClasses, focusClasses)} /></Field>
                    <Field label="Proveedor Preferente" hint="Opcional"><div className="relative"><Truck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" /><select {...register("PROVEEDOR_PREFERENTE")} disabled={isLoadingCatalogs} className={cn(commonSelectClasses, 'pl-10', focusClasses)}><option value="">{isLoadingCatalogs ? 'Cargando...' : 'Ninguno'}</option>{catalogs.suppliers.map((p: any) => <option key={p.id} value={p.ID_PROVEEDOR}>{p.RAZON_SOCIAL || p.NOMBRE_COMERCIAL}</option>)}</select></div></Field>
                    <Field label="Estatus" required><select {...register("ESTATUS")} className={cn(commonSelectClasses, focusClasses)}><option value="ACTIVO">Activo</option><option value="INACTIVO">Inactivo</option></select></Field>
                </div>
              </Card>
            </div>
          </motion.main>
        </div>
      </form>
  );
}

export default function CreateItemPageContainer() {
  const [activeTab, setActiveTab] = useState('Stock Maestro');
  return (
    <InventoryLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <ItemCreateForm />
    </InventoryLayout>
  )
}
