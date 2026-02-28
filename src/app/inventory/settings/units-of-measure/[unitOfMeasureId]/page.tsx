'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useTransition } from 'react';
import { createUnitOfMeasure, updateUnitOfMeasure, getUnitOfMeasure } from '../actions';
import type { UnitOfMeasure } from '../columns';
import InventoryLayout from '../../../InventoryLayout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Save,
  Ruler,
  Loader2
} from "lucide-react";

// Esquema de validación para el formulario
const unitOfMeasureSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio."),
  abbreviation: z.string().min(1, "La abreviatura es obligatoria.").max(10, "Máximo 10 caracteres."),
  type: z.enum(['Peso', 'Volumen', 'Longitud', 'Unidad', 'Otro'], { required_error: "Debe seleccionar un tipo."}),
});

type FormValues = z.infer<typeof unitOfMeasureSchema>;

interface UnitOfMeasurePageProps {
  params: { unitOfMeasureId: string };
}

export default function UnitOfMeasurePage({ params }: UnitOfMeasurePageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("Ajustes");
  const isCreating = params.unitOfMeasureId === 'new';

  const form = useForm<FormValues>({
    resolver: zodResolver(unitOfMeasureSchema),
    defaultValues: { name: '', abbreviation: '', type: undefined },
  });

  useEffect(() => {
    if (!isCreating) {
      const fetchUnit = async () => {
        setIsLoading(true);
        const data = await getUnitOfMeasure(params.unitOfMeasureId);
        if (data) {
          form.reset(data as FormValues);
        }
        setIsLoading(false);
      };
      fetchUnit();
    } else {
      setIsLoading(false);
    }
  }, [params.unitOfMeasureId, isCreating, form]);

  const onSubmit = async (values: FormValues) => {
    startTransition(async () => {
      try {
        const result = isCreating
          ? await createUnitOfMeasure(values)
          : await updateUnitOfMeasure(params.unitOfMeasureId, values);

        if (result.success) {
          toast({
            title: "Éxito",
            description: `Unidad de medida ${isCreating ? 'creada' : 'actualizada'} con éxito.`,
          });
          router.push('/inventory/settings/units-of-measure');
        } else {
          toast({
            variant: "destructive",
            title: "Error al guardar",
            description: result.message || "Ocurrió un error inesperado.",
          });
        }
      } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error del sistema",
            description: error.message || "No se pudo completar la operación.",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <InventoryLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="p-8 flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
      </InventoryLayout>
    );
  }

  return (
    <InventoryLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <Ruler className="w-5 h-5 text-white" />
            </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase">
              {isCreating ? "Nueva Unidad de Medida" : "Editar Unidad de Medida"}
            </h1>
            <p className="text-[10px] font-bold text-green-500 tracking-widest uppercase">
              {isCreating ? "Crear una nueva unidad" : `Editando ${form.getValues('name')}`}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => router.back()} disabled={isPending}>Cancelar</Button>
      </header>

      <main className="p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Ruler className="w-5 h-5 text-green-500"/> Detalles de la Unidad</CardTitle>
              <CardDescription>La abreviatura (ej: 'kg', 'cm', 'L') será el identificador único y no se podrá cambiar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="font-semibold">Nombre *</label>
                    <Input id="name" {...form.register("name")} placeholder="Ej: Kilogramo" disabled={isPending}/>
                    {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="abbreviation" className="font-semibold">Abreviatura *</label>
                    <Input id="abbreviation" {...form.register("abbreviation")} placeholder="Ej: kg" disabled={!isCreating || isPending} />
                    {form.formState.errors.abbreviation && <p className="text-sm text-red-500">{form.formState.errors.abbreviation.message}</p>}
                  </div>
              </div>
              <div className="space-y-2">
                  <label htmlFor="type" className="font-semibold">Tipo de Unidad *</label>
                   <Select onValueChange={(value) => form.setValue('type', value as any, { shouldValidate: true })} value={form.watch('type')} disabled={isPending}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Peso">Peso</SelectItem>
                            <SelectItem value="Volumen">Volumen</SelectItem>
                            <SelectItem value="Longitud">Longitud</SelectItem>
                            <SelectItem value="Unidad">Unidad</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                    </Select>
                  {form.formState.errors.type && <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
              <Button type="submit" disabled={isPending || !form.formState.isValid} className="w-full sm:w-auto">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isCreating ? "Crear Unidad" : "Guardar Cambios"}
              </Button>
          </div>
        </form>
      </main>
    </InventoryLayout>
  );
}
