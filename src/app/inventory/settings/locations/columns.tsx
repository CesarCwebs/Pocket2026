'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export interface Location {
  id: string;
  almacen: string;
  zona: string;
  pasillo: string;
  estanteria: string;
  nivel: string;
  posicion: string;
  tipoUbicacion: string;
  estado: string;
}

export const columns = (
  onEdit: (location: Location) => void,
  onDelete: (id: string) => void
): ColumnDef<Location>[] => [
  {
    accessorKey: 'id',
    header: 'Código',
    cell: ({ row }) => {
      const location = row.original;

      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{location.id}</span>
          <span className="text-xs text-muted-foreground">
            {location.almacen} · {location.zona}
          </span>
        </div>
      );
    },
  },

  {
    header: 'Ubicación Física',
    cell: ({ row }) => {
      const { pasillo, estanteria, nivel, posicion } = row.original;

      return (
        <div className="text-sm">
          <span className="font-medium">
            P{pasillo}-E{estanteria}-N{nivel}
          </span>
          <div className="text-xs text-muted-foreground">
            Posición {posicion}
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: 'tipoUbicacion',
    header: 'Tipo',
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-xs">
        {row.original.tipoUbicacion}
      </Badge>
    ),
  },

  {
    accessorKey: 'estado',
    header: 'Estado',
    cell: ({ row }) => {
      const estado = row.original.estado;

      return (
        <Badge
          variant={estado === 'Activo' ? 'default' : 'destructive'}
          className="text-xs"
        >
          {estado}
        </Badge>
      );
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const location = row.original;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => onEdit(location)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => onDelete(location.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];