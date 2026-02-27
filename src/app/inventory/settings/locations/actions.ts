
"use server"

import { admin } from "@/lib/firebase-admin";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const collectionName = "inventory_locations";

const locationSchema = z.object({
    almacen: z.string().min(1, "El almacén es obligatorio."),
    zona: z.string().min(1, "La zona es obligatoria."),
    pasillo: z.string().min(1, "El pasillo es obligatorio."),
    estanteria: z.string().min(1, "La estantería es obligatoria."),
    nivel: z.string().min(1, "El nivel es obligatorio."),
    posicion: z.string().min(1, "La posición es obligatoria."),
    tipoUbicacion: z.string().min(1, "El tipo de ubicación es obligatorio."),
    estado: z.enum(['Activo', 'Bloqueado']),
});

// Obtener todos los localizadores
export async function getLocations() {
    try {
        const db = admin.firestore();
        const snapshot = await db.collection(collectionName).get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
        console.error("Error en getLocations:", error);
        return { error: `No se pudieron obtener los localizadores: ${error.message}` };
    }
}

// Crear un localizador
export async function createLocation(data: any) {
    try {
        const db = admin.firestore();
        const validatedData = locationSchema.parse(data);
        const id = data.id || `${validatedData.almacen}-${validatedData.zona}-${validatedData.pasillo}-${validatedData.estanteria}-${validatedData.nivel}-${validatedData.posicion}`;
        
        await db.collection(collectionName).doc(id).set({
            ...validatedData,
            createdAt: new Date().toISOString()
        });
        
        revalidatePath("/inventory/settings/locations");
        return { success: true, message: "Localizador creado con éxito." };
    } catch (error: any) {
        console.error("Error en createLocation:", error);
        return { success: false, message: error.message || "Error al crear el localizador." };
    }
}

// Actualizar un localizador
export async function updateLocation(id: string, data: any) {
    try {
        const db = admin.firestore();
        const validatedData = locationSchema.parse(data);
        
        await db.collection(collectionName).doc(id).update(validatedData);
        
        revalidatePath("/inventory/settings/locations");
        return { success: true, message: "Localizador actualizado con éxito." };
    } catch (error: any) {
        console.error("Error en updateLocation:", error);
        return { success: false, message: error.message || "Error al actualizar el localizador." };
    }
}

// Eliminar un localizador
export async function deleteLocation(id: string) {
    try {
        const db = admin.firestore();
        await db.collection(collectionName).doc(id).delete();
        revalidatePath("/inventory/settings/locations");
        return { success: true, message: "Localizador eliminado con éxito." };
    } catch (error: any) {
        console.error("Error en deleteLocation:", error);
        return { success: false, message: "Error al eliminar el localizador." };
    }
}
