
'use client';

import React, { useState, useTransition } from 'react';
import InventoryLayout from '../../InventoryLayout';
import { LocationList } from './location-list';
import { deleteLocation } from './actions';
import { Location } from "./columns";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; // Importar el router

export default function LocationsClientPage({ initialLocations }: { initialLocations: any[] }) {
    const [activeTab, setActiveTab] = useState('Ajustes');
    const [locations, setLocations] = useState(initialLocations);
    const [isPending, startTransition] = useTransition();
    const router = useRouter(); // Instanciar el router

    const handleDelete = (id: string) => {
        // Envolver en un confirm para seguridad
        if (window.confirm("¿Estás seguro de que deseas eliminar este localizador?")) {
            startTransition(async () => {
                const result = await deleteLocation(id);
                if (result.success) {
                    setLocations(current => current.filter(loc => loc.id !== id));
                    // Opcional: toast.success("Localizador eliminado");
                } else {
                    console.error(result.message);
                    // Opcional: toast.error(result.message);
                }
            });
        }
    };
    
    // -- LÓGICA DE NAVEGACIÓN --
    const handleEdit = (location: Location) => {
        router.push(`/inventory/settings/locations/${location.id}`);
    };

    const handleAddNew = () => {
        router.push('/inventory/settings/locations/new');
    };

    return (
        <InventoryLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            {/* La cabecera principal con el botón para navegar */}
            <header className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-8 h-20 flex items-center justify-between">
                <h1 className="text-xl font-black tracking-tighter uppercase">Gestión de Localizadores</h1>
                <Button onClick={handleAddNew}>Añadir Localizador</Button>
            </header>

            {/* El contenido principal: solo la lista */}
            <div className="p-8">
                <LocationList 
                    locations={locations} 
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                /> 
            </div>
        </InventoryLayout>
    );
}
