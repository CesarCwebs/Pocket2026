'use client';
import { z } from 'zod';

export const masterItemSchema = z.object({
  SKU_ID: z.string().min(3, 'El SKU debe tener al menos 3 caracteres').toUpperCase(),
  NOMBRE: z.string().min(5, 'El nombre debe tener al menos 5 caracteres'),
  DESCRIPCION: z.string().optional(),
  CATEGORIA: z.string().min(1, 'Debes seleccionar una categoría'),
  
  // Campos de Almacenamiento
  SUB_INVENTARIO: z.string().min(1, 'Debes seleccionar un sub-inventario'),
  UNIDAD_MEDIDA: z.string().min(1, 'Debes seleccionar una unidad de medida'),
  LOCALIZADOR: z.string().min(1, 'Debes seleccionar un localizador'), // Ya no es generado

  // Campos Financieros
  CENTRO_COSTO: z.string().min(1, 'Debes seleccionar un centro de costo'),
  COSTO_ESTANDAR: z.preprocess(
    (val) => (val === '' || val === undefined || val === null) ? 0 : parseFloat(String(val)),
    z.number().min(0, 'El costo no puede ser negativo')
  ),
  MONEDA: z.enum(['MXN', 'USD']),
  IVA_TASA: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number()
  ),

  // Campos Operativos
  STOCK_MINIMO: z.preprocess(
    (val) => (val === '' || val === undefined || val === null) ? 0 : parseInt(String(val), 10),
    z.number().int().min(0, 'El stock mínimo no puede ser negativo')
  ),
  PROVEEDOR_PREFERENTE: z.string().optional(),
  CLAVE_PROD_SERV_SAT: z.string().optional(),
  ESTATUS: z.enum(['ACTIVO', 'INACTIVO']),
});

export type MasterItemFormValues = z.infer<typeof masterItemSchema>;
