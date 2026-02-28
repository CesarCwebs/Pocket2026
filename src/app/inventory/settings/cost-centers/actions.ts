'use server';

import { getFirestoreInstance } from "@/lib/firebase-admin";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const collectionName = "inventory_cost_centers";

// Esquema para la validación de datos de Centros de Costo
const costCenterSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string().optional(),
});

// --- FUNCIONES CRUD PARA CENTROS DE COSTO ---

/**
 * Obtiene todos los centros de costo.
 */
export async function getCostCenters() {
  try {
    const db = getFirestoreInstance();
    const snapshot = await db.collection(collectionName).orderBy("name").get();
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    return { error: `No se pudieron obtener los centros de costo: ${error.message}` };
  }
}

/**
 * Obtiene un único centro de costo por su ID.
 */
export async function getCostCenter(id: string) {
  try {
    const db = getFirestoreInstance();
    const doc = await db.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  } catch (error: any) {
    return null;
  }
}

/**
 * Crea un nuevo centro de costo.
 */
export async function createCostCenter(data: any) {
  try {
    const db = getFirestoreInstance();
    const validatedData = costCenterSchema.parse(data);
    
    const id = validatedData.name.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const existingDoc = await db.collection(collectionName).doc(id).get();
    if (existingDoc.exists) {
      return { success: false, message: `El centro de costo con el nombre "${validatedData.name}" ya existe.` };
    }
    
    const newCostCenter = {
      ...validatedData,
      createdAt: new Date().toISOString()
    };

    await db.collection(collectionName).doc(id).set(newCostCenter);
    
    revalidatePath("/inventory/settings/cost-centers");
    return { 
      success: true, 
      message: "Centro de costo creado con éxito.",
      data: { id, ...newCostCenter }
    };

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors.map(e => e.message).join(", ") };
    }
    return { success: false, message: error.message || "Error al crear el centro de costo." };
  }
}

/**
 * Actualiza un centro de costo existente.
 */
export async function updateCostCenter(id: string, data: any) {
  try {
    const db = getFirestoreInstance();
    const updateSchema = costCenterSchema.pick({ description: true, name: true });
    const validatedData = updateSchema.parse(data);

    const updatedCostCenter = {
      ...validatedData,
      updatedAt: new Date().toISOString()
    }
    
    await db.collection(collectionName).doc(id).update(updatedCostCenter);
    
    revalidatePath("/inventory/settings/cost-centers");
    return { 
      success: true, 
      message: "Centro de costo actualizado con éxito.",
      data: { id, ...updatedCostCenter }
     };

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors.map(e => e.message).join(", ") };
    }
    return { success: false, message: error.message || "Error al actualizar el centro de costo." };
  }
}

/**
 * Elimina un centro de costo.
 */
export async function deleteCostCenter(id: string) {
  try {
    const db = getFirestoreInstance();
    await db.collection(collectionName).doc(id).delete();
    revalidatePath("/inventory/settings/cost-centers");
    return { success: true, message: "Centro de costo eliminado con éxito." };
  } catch (error: any) {
    return { success: false, message: "Error al eliminar el centro de costo." };
  }
}
