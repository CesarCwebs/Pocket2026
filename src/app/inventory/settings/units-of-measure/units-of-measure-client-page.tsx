'use client';

import React, { useState, useTransition } from 'react';
import InventoryLayout from '../../InventoryLayout';
import { DataTable } from '@/components/ui/data-table';
import { columns, UnitOfMeasure } from "./columns";
import { deleteUnitOfMeasure } from './actions';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface UnitsOfMeasureClientPageProps {
  initialUnits: UnitOfMeasure[];
}

export default function UnitsOfMeasureClientPage({ initialUnits }: UnitsOfMeasureClientPageProps) {
  const [activeTab, setActiveTab] = useState('Ajustes');
  const [units, setUnits] = useState(initialUnits);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta unidad de medida? Esta acción no se puede deshacer.")) {
      startTransition(async () => {
        const result = await deleteUnitOfMeasure(id);
        if (result.success) {
          setUnits(current => current.filter(u => u.id !== id));
          toast({
            title: "Éxito",
            description: "La unidad de medida ha sido eliminada correctamente.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "No se pudo eliminar la unidad de medida.",
          });
        }
      });
    }
  };
  
  const handleEdit = (unit: UnitOfMeasure) => {
    router.push(`/inventory/settings/units-of-measure/${unit.id}`);
  };

  const handleAddNew = () => {
    router.push('/inventory/settings/units-of-measure/new');
  };

  return (
    <InventoryLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-8 h-20 flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tighter uppercase">Gestión de Unidades de Medida</h1>
        <Button onClick={handleAddNew} disabled={isPending}>
          Añadir Unidad
        </Button>
      </header>

      <div className="p-8">
        <DataTable 
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
          data={units} 
          filterColumnId="name"
          filterPlaceholder="Filtrar por nombre..."
        />
      </div>
    </InventoryLayout>
  );
}
