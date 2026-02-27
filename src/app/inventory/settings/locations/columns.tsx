
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Definiendo la estructura de un Localizador que usaremos en la tabla
export interface Location {
    id: string; // Código Localizador
    almacen: string;
    zona: string;
    pasillo: string;
    estanteria: string;
    nivel: string;
    posicion: string;
    tipoUbicacion: string;
    estado: string;
}

// --- Definición de las columnas de la tabla ---
export const columns = (openEditSheet: (location: Location) => void, deleteLocation: (id: string) => void): ColumnDef<Location>[] => [
    {
        accessorKey: 'id',
        header: 'Código Localizador',
    },
    { accessorKey: 'almacen', header: 'Almacén' },
    { accessorKey: 'zona', header: 'Zona' },
    { accessorKey: 'pasillo', header: 'Pasillo' },
    { accessorKey: 'estanteria', header: 'Estantería' },
    { accessorKey: 'nivel', header: 'Nivel' },
    { accessorKey: 'posicion', header: 'Posición' },
    { accessorKey: 'tipoUbicacion', header: 'Tipo' },
    {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
            const estado = row.original.estado;
            const variant = estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
            return <span className={`px-2 py-1 rounded-full text-xs ${variant}`}>{estado}</span>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const location = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(location.id)}>
                            Copiar Código
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEditSheet(location)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => deleteLocation(location.id)}>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

