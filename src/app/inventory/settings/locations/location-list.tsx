
'use client';

import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { columns, Location } from './columns';

// El componente ahora espera recibir las funciones como props
interface LocationListProps {
    locations: Location[];
    onEdit: (location: Location) => void;
    onDelete: (id: string) => void;
}

export function LocationList({ locations, onEdit, onDelete }: LocationListProps) {
    // CORRECCIÓN: El orden de los argumentos DEBE coincidir con la firma en columns.tsx
    // 1. La función de edición (onEdit) va primero.
    // 2. La función de borrado (onDelete) va segundo.
    const tableColumns = columns(onEdit, onDelete);

    return (
        <DataTable columns={tableColumns} data={locations} />
    );
}
