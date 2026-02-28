'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2, Ruler, Weight, Beaker, StretchHorizontal, Box } from 'lucide-react';
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

// Interfaz para el objeto de Unidad de Medida
export interface UnitOfMeasure {
  id: string; // La abreviatura será el ID
  name: string;
  abbreviation: string;
  type: 'Peso' | 'Volumen' | 'Longitud' | 'Unidad' | 'Otro';
}

const typeIcons = {
    Peso: <Weight className="h-4 w-4 text-green-600" />,
    Volumen: <Beaker className="h-4 w-4 text-blue-600" />,
    Longitud: <StretchHorizontal className="h-4 w-4 text-orange-600" />,
    Unidad: <Box className="h-4 w-4 text-purple-600" />,
    Otro: <Ruler className="h-4 w-4 text-zinc-500" />,
};

// Definición de las columnas
export const columns = (
  onEdit: (unit: UnitOfMeasure) => void,
  onDelete: (id: string) => void
): ColumnDef<UnitOfMeasure>[] => [
  {
    accessorKey: 'name',
    header: 'Nombre de la Unidad',
    cell: ({ row }) => {
      const unit = row.original;
      return (
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-50 dark:bg-green-900/20 flex-shrink-0">
                <Ruler className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex flex-col">
                <span className="font-medium text-sm text-zinc-900 dark:text-white">{unit.name}</span>
                <span className="text-xs text-zinc-500 font-mono">Abreviatura: {unit.abbreviation}</span>
            </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <Badge variant="outline" className="flex items-center gap-2 w-fit">
          {typeIcons[type] || typeIcons['Otro']}
          <span className="font-semibold">{type}</span>
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const unit = row.original;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(unit)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar Unidad
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => onDelete(unit.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Unidad
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
