'use server';

import { getFirestoreInstance } from "@/lib/firebase-admin";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const collectionName = "inventory_units_of_measure";

// Esquema de validación para Unidades de Medida
const unitOfMeasureSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  abbreviation: z.string().min(1, "La abreviatura es obligatoria."),
  type: z.enum(['Peso', 'Volumen', 'Longitud', 'Unidad', 'Otro']),
});

// --- FUNCIONES CRUD ---

export async function getUnitsOfMeasure() {
  try {
    const db = getFirestoreInstance();
    const snapshot = await db.collection(collectionName).orderBy("name").get();
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    return { error: `No se pudieron obtener las unidades de medida: ${error.message}` };
  }
}

export async function getUnitOfMeasure(id: string) {
  try {
    const db = getFirestoreInstance();
    const doc = await db.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  } catch (error: any) {
    return null;
  }
}

export async function createUnitOfMeasure(data: any) {
  try {
    const db = getFirestoreInstance();
    const validatedData = unitOfMeasureSchema.parse(data);
    
    const id = validatedData.abbreviation.toLowerCase().replace(/\s+/g, '-');

    const existingDoc = await db.collection(collectionName).doc(id).get();
    if (existingDoc.exists) {
      return { success: false, message: `La unidad de medida con la abreviatura "${validatedData.abbreviation}" ya existe.` };
    }
    
    await db.collection(collectionName).doc(id).set({
      ...validatedData,
      createdAt: new Date().toISOString()
    });
    
    revalidatePath("/inventory/settings/units-of-measure");
    return { success: true, message: "Unidad de medida creada con éxito." };

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors.map(e => e.message).join(", ") };
    }
    return { success: false, message: error.message || "Error al crear la unidad de medida." };
  }
}

export async function updateUnitOfMeasure(id: string, data: any) {
  try {
    const db = getFirestoreInstance();
    // Solo se pueden actualizar el nombre y el tipo, no la abreviatura (ID)
    const updateSchema = unitOfMeasureSchema.pick({ name: true, type: true });
    const validatedData = updateSchema.parse(data);
    
    await db.collection(collectionName).doc(id).update({
      ...validatedData,
      updatedAt: new Date().toISOString()
    });
    
    revalidatePath("/inventory/settings/units-of-measure");
    return { success: true, message: "Unidad de medida actualizada con éxito." };

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors.map(e => e.message).join(", ") };
    }
    return { success: false, message: error.message || "Error al actualizar la unidad de medida." };
  }
}

export async function deleteUnitOfMeasure(id: string) {
  try {
    const db = getFirestoreInstance();
    await db.collection(collectionName).doc(id).delete();
    revalidatePath("/inventory/settings/units-of-measure");
    return { success: true, message: "Unidad de medida eliminada con éxito." };
  } catch (error: any) {
    return { success: false, message: "Error al eliminar la unidad de medida." };
  }
}
