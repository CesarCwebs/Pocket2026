
'use client';

import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { columns, Location } from './columns';
import { Button } from '@/components/ui/button';
import { createLocation, deleteLocation, updateLocation } from './actions';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { LocationForm } from './location-form';

// Los 10 localizadores de ejemplo
const exampleLocations: Omit<Location, 'id'>[] = [
    { almacen: 'ALM01', zona: 'ZA', pasillo: 'P01', estanteria: 'E01', nivel: 'N01', posicion: 'P01', tipoUbicacion: 'Picking', estado: 'Activo' },
    { almacen: 'ALM01', zona: 'ZA', pasillo: 'P01', estanteria: 'E01', nivel: 'N02', posicion: 'P02', tipoUbicacion: 'Picking', estado: 'Activo' },
    { almacen: 'ALM01', zona: 'ZB', pasillo: 'P02', estanteria: 'E03', nivel: 'N01', posicion: 'P01', tipoUbicacion: 'Reserva', estado: 'Activo' },
    { almacen: 'ALM01', zona: 'ZB', pasillo: 'P02', estanteria: 'E03', nivel: 'N02', posicion: 'P03', tipoUbicacion: 'Reserva', estado: 'Activo' },
    { almacen: 'ALM02', zona: 'ZA', pasillo: 'P01', estanteria: 'E02', nivel: 'N01', posicion: 'P01', tipoUbicacion: 'Recepción', estado: 'Activo' },
    { almacen: 'ALM02', zona: 'ZA', pasillo: 'P03', estanteria: 'E04', nivel: 'N03', posicion: 'P02', tipoUbicacion: 'Picking', estado: 'Activo' },
    { almacen: 'ALM02', zona: 'ZC', pasillo: 'P04', estanteria: 'E01', nivel: 'N01', posicion: 'P01', tipoUbicacion: 'Cuarentena', estado: 'Bloqueado' },
    { almacen: 'ALM03', zona: 'ZA', pasillo: 'P02', estanteria: 'E02', nivel: 'N02', posicion: 'P02', tipoUbicacion: 'Picking', estado: 'Activo' },
    { almacen: 'ALM03', zona: 'ZD', pasillo: 'P05', estanteria: 'E03', nivel: 'N01', posicion: 'P04', tipoUbicacion: 'Reserva', estado: 'Activo' },
    { almacen: 'ALM03', zona: 'ZD', pasillo: 'P05', estanteria: 'E03', nivel: 'N02', posicion: 'P01', tipoUbicacion: 'Devoluciones', estado: 'Activo' },
];

interface LocationsClientPageProps {
    initialLocations: Location[];
}

export default function LocationsClientPage({ initialLocations }: LocationsClientPageProps) {
    const [locations, setLocations] = useState(initialLocations);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [showSeedButton, setShowSeedButton] = useState(initialLocations.length === 0);

    const handleSeedClick = async () => {
        const promise = async () => {
            for (const locData of exampleLocations) {
                const id = `${locData.almacen}-${locData.zona}-${locData.pasillo}-${locData.estanteria}-${locData.nivel}-${locData.posicion}`;
                await createLocation({ ...locData, id });
            }
        };

        toast.promise(promise(), {
            loading: 'Dando de alta los localizadores de ejemplo...',
            success: () => {
                // Esto se ejecuta cuando la promesa se resuelve con éxito
                // Ocultamos el botón y refrescamos la página para ver los nuevos datos.
                setShowSeedButton(false);
                // Forzamos un refresh para que el componente del servidor se vuelva a ejecutar.
                window.location.reload(); 
                return '¡Localizadores de ejemplo creados con éxito!';
            },
            error: 'Error al crear los localizadores de ejemplo.',
        });
    };

    const openNewSheet = () => {
        setEditingLocation(null);
        setIsSheetOpen(true);
    };

    const openEditSheet = (location: Location) => {
        setEditingLocation(location);
        setIsSheetOpen(true);
    };

    const handleFormSubmit = async (values: Omit<Location, 'id' | 'createdAt'>, id?: string) => {
        const action = id ? updateLocation(id, values) : createLocation({ ...values, id: `${values.almacen}-${values.zona}-${values.pasillo}-${values.estanteria}-${values.nivel}-${values.posicion}`});
        
        toast.promise(action, {
            loading: id ? 'Actualizando localizador...' : 'Creando localizador...',
            success: (result) => {
                setIsSheetOpen(false);
                 window.location.reload();
                return result.message;
            },
            error: (err) => err.message,
        });
    };

    const handleDeleteLocation = async (id: string) => {
        toast.promise(deleteLocation(id), {
            loading: 'Eliminando localizador...',
            success: (result) => {
                window.location.reload();
                return result.message;
            },
            error: (err) => err.message,
        });
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <div>
                    {showSeedButton && (
                        <Button onClick={handleSeedClick}>
                            Dar de alta 10 localizadores de ejemplo
                        </Button>
                    )}
                </div>
                <Button onClick={openNewSheet}>Añadir Localizador</Button>
            </div>
            <DataTable columns={columns(openEditSheet, handleDeleteLocation)} data={locations} />
            
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{editingLocation ? 'Editar' : 'Crear'} Localizador</SheetTitle>
                    </SheetHeader>
                    <LocationForm 
                        onSubmit={handleFormSubmit} 
                        initialData={editingLocation} 
                    />
                </SheetContent>
            </Sheet>
        </>
    );
}
