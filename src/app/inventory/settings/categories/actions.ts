'use server';

import { getFirestoreInstance } from "@/lib/firebase-admin";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const collectionName = "inventory_categories";

// Esquema para la validación de datos de categoría
const categorySchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string().optional(),
});

// --- FUNCIONES CRUD PARA CATEGORÍAS ---

/**
 * Obtiene todas las categorías de la base de datos.
 */
export async function getCategories() {
  try {
    const db = getFirestoreInstance();
    const snapshot = await db.collection(collectionName).orderBy("name").get();
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    console.error("Error en getCategories:", error);
    return { error: `No se pudieron obtener las categorías: ${error.message}` };
  }
}

/**
 * Obtiene una única categoría por su ID.
 */
export async function getCategory(id: string) {
  try {
    const db = getFirestoreInstance();
    const doc = await db.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  } catch (error: any) {
    console.error(`Error en getCategory (id: ${id}):`, error);
    return null;
  }
}

/**
 * Crea una nueva categoría.
 * El ID se genera a partir del nombre para asegurar unicidad.
 */
export async function createCategory(data: any) {
  try {
    const db = getFirestoreInstance();
    const validatedData = categorySchema.parse(data);
    
    // Generar un ID a partir del nombre (ej: "Cables de Red" -> "cables-de-red")
    const id = validatedData.name.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const existingDoc = await db.collection(collectionName).doc(id).get();
    if (existingDoc.exists) {
      return { success: false, message: `La categoría con el nombre "${validatedData.name}" ya existe.` };
    }
    
    const newCategory = {
      ...validatedData,
      createdAt: new Date().toISOString()
    };

    await db.collection(collectionName).doc(id).set(newCategory);
    
    revalidatePath("/inventory/settings/categories");
    return { 
      success: true, 
      message: "Categoría creada con éxito.",
      data: { id, ...newCategory }
    };

  } catch (error: any) {
    console.error("Error en createCategory:", error);
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors.map(e => e.message).join(", ") };
    }
    return { success: false, message: error.message || "Error al crear la categoría." };
  }
}

/**
 * Actualiza una categoría existente.
 */
export async function updateCategory(id: string, data: any) {
  try {
    const db = getFirestoreInstance();
    const updateSchema = categorySchema.pick({ description: true, name: true });
    const validatedData = updateSchema.parse(data);

    const updatedCategory = {
      ...validatedData,
      updatedAt: new Date().toISOString()
    }
    
    await db.collection(collectionName).doc(id).update(updatedCategory);
    
    revalidatePath("/inventory/settings/categories");
    return { 
      success: true, 
      message: "Categoría actualizada con éxito.",
      data: { id, ...updatedCategory }
     };

  } catch (error: any) {
    console.error(`Error en updateCategory (id: ${id}):`, error);
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors.map(e => e.message).join(", ") };
    }
    return { success: false, message: error.message || "Error al actualizar la categoría." };
  }
}

/**
 * Elimina una categoría.
 */
export async function deleteCategory(id: string) {
  try {
    const db = getFirestoreInstance();
    await db.collection(collectionName).doc(id).delete();
    revalidatePath("/inventory/settings/categories");
    return { success: true, message: "Categoría eliminada con éxito." };
  } catch (error: any) {
    console.error(`Error en deleteCategory (id: ${id}):`, error);
    return { success: false, message: "Error al eliminar la categoría." };
  }
}
