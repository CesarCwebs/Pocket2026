'use client';

import React, { useState, useTransition } from 'react';
import InventoryLayout from '../../InventoryLayout';
import { DataTable } from '@/components/ui/data-table';
import { columns, CostCenter } from "./columns";
import { deleteCostCenter } from './actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CostCenterForm } from "./CostCenterForm";

interface CostCentersClientPageProps {
  initialCostCenters: CostCenter[];
}

export default function CostCentersClientPage({ initialCostCenters }: CostCentersClientPageProps) {
  const [activeTab, setActiveTab] = useState('Ajustes');
  const [costCenters, setCostCenters] = useState(initialCostCenters);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCostCenter, setEditingCostCenter] = useState<CostCenter | undefined>();

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este centro de costo? Esta acción no se puede deshacer.")) {
      startTransition(async () => {
        const result = await deleteCostCenter(id);
        if (result.success) {
          setCostCenters(current => current.filter(cc => cc.id !== id));
          toast({
            title: "Éxito",
            description: "El centro de costo ha sido eliminado correctamente.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "No se pudo eliminar el centro de costo.",
          });
        }
      });
    }
  };
  
  const handleEdit = (costCenter: CostCenter) => {
    setEditingCostCenter(costCenter);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCostCenter(undefined);
    setIsModalOpen(true);
  };

  const handleSave = (savedCostCenter: CostCenter) => {
    if (editingCostCenter) {
      setCostCenters(current => 
        current.map(cc => cc.id === savedCostCenter.id ? savedCostCenter : cc)
      );
    } else {
      setCostCenters(current => [...current, savedCostCenter]);
    }
  };

  return (
    <InventoryLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-8 h-20 flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tighter uppercase">Gestión de Centros de Costo</h1>
        <Button onClick={handleAddNew} disabled={isPending}>
          Añadir Centro de Costo
        </Button>
      </header>

      <div className="p-8">
        <DataTable 
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
          data={costCenters} 
          filterColumnId="name"
          filterPlaceholder="Filtrar por nombre..."
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCostCenter ? "Editar Centro de Costo" : "Nuevo Centro de Costo"}
            </DialogTitle>
          </DialogHeader>
          <CostCenterForm 
            costCenter={editingCostCenter}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </InventoryLayout>
  );
}
