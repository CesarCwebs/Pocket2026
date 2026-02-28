'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Interfaz para el objeto de Categoría
export interface Category {
  id: string;
  name: string;
  description?: string;
}

// Definición de las columnas para la tabla de categorías
export const columns = (
  onEdit: (category: Category) => void,
  onDelete: (id: string) => void
): ColumnDef<Category>[] => [
  {
    accessorKey: 'name',
    header: 'Nombre de la Categoría',
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50 dark:bg-amber-900/20 flex-shrink-0">
                <Tag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex flex-col">
                <span className="font-medium text-sm text-zinc-900 dark:text-white">{category.name}</span>
                <span className="text-xs text-zinc-500">ID: {category.id}</span>
            </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
    cell: ({ row }) => <p className="text-sm text-zinc-600 dark:text-zinc-400 w-full max-w-xs truncate">{row.original.description || 'Sin descripción'}</p>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const category = row.original;

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
              <DropdownMenuItem onClick={() => onEdit(category)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar Descripción
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => onDelete(category.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Categoría
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
