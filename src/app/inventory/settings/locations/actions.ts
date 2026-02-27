
"use server"

import { admin } from "@/lib/firebase-admin";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const locationSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional(),
});

// Función para obtener los localizadores
export async function getLocations() {
    try {
        const snapshot = await admin.firestore().collection("locations").get();
        if (snapshot.empty) {
            return [];
        }
        const locations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return locations;
    } catch (error: any) {
        console.error("--- ERROR DETALLADO en getLocations ---", error);
        return { error: `No se pudieron obtener los localizadores: ${error.message}` };
    }
}

// Función para crear o actualizar un localizador
export async function createOrUpdateLocation(id: string | null, data: any) {
    try {
        const validatedData = locationSchema.parse(data);
        if (id) {
            await admin.firestore().collection("locations").doc(id).update(validatedData);
        } else {
            await admin.firestore().collection("locations").add(validatedData);
        }
        revalidatePath("/inventory/settings/locations");
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors.map(e => e.message).join(", ") };
        }
        return { error: "Error al guardar el localizador" };
    }
}

// Función para eliminar un localizador
export async function deleteLocation(id: string) {
    try {
        await admin.firestore().collection("locations").doc(id).delete();
        revalidatePath("/inventory/settings/locations");
        return { success: true };
    } catch (error) {
        return { error: "Error al eliminar el localizador" };
    }
}
