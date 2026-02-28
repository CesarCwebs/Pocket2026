'use server';

import { getFirestoreInstance } from "@/lib/firebase-admin";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const collectionName = "inventory_locations";

// Esquema actualizado: Coerción de tipos para campos numéricos
const locationSchema = z.object({
    almacen: z.string().min(1, "El almacén es obligatorio."),
    zona: z.string().min(1, "La zona es obligatoria."),
    pasillo: z.coerce.string().min(1, "El pasillo es obligatorio."),
    estanteria: z.coerce.string().min(1, "La estantería es obligatoria."),
    nivel: z.coerce.string().min(1, "El nivel es obligatorio."),
    posicion: z.coerce.string().min(1, "La posición es obligatoria."),
    tipoUbicacion: z.string().min(1, "El tipo de ubicación es obligatorio."),
    estado: z.enum(['Activo', 'Bloqueado']),
});

// Función para generar el ID estandarizado
const generateLocationId = (data: z.infer<typeof locationSchema>) => {
    const parts = [
        `ALM-${data.almacen.toUpperCase().replace(/\s/g, "")}`,
        `Z${data.zona.toUpperCase()}`,
        `P${data.pasillo.padStart(2, "0")}`,
        `E${data.estanteria.padStart(2, "0")}`,
        `N${data.nivel.padStart(2, "0")}`,
        `PS${data.posicion.padStart(2, "0")}`
    ];
    return parts.join("-");
};

// Obtener todos los localizadores
export async function getLocations() {
    try {
        const db = getFirestoreInstance();
        const snapshot = await db.collection(collectionName).orderBy("createdAt", "desc").get();
        if (snapshot.empty) return [];
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
        console.error("Error en getLocations:", error);
        return { error: `No se pudieron obtener los localizadores: ${error.message}` };
    }
}

// Obtener un único localizador por su ID
export async function getLocation(id: string) {
    try {
        const db = getFirestoreInstance();
        const doc = await db.collection(collectionName).doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    } catch (error: any) {
        console.error(`Error en getLocation (id: ${id}):`, error);
        return null;
    }
}

// Crear un localizador con el nuevo ID
export async function createLocation(data: any) {
    try {
        const db = getFirestoreInstance();
        const validatedData = locationSchema.parse(data);
        const id = generateLocationId(validatedData);

        const existingDoc = await db.collection(collectionName).doc(id).get();
        if (existingDoc.exists) {
            return { success: false, message: `El localizador con código "${id}" ya existe.` };
        }
        
        await db.collection(collectionName).doc(id).set({
            ...validatedData,
            createdAt: new Date().toISOString()
        });
        
        revalidatePath("/inventory/settings/locations");
        return { success: true, message: "Localizador creado con éxito." };
    } catch (error: any) {
        console.error("Error en createLocation:", error);
        if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => e.message).join(", ") };
        }
        return { success: false, message: error.message || "Error al crear el localizador." };
    }
}

// Actualizar un localizador (sin cambiar el ID)
export async function updateLocation(id: string, data: any) {
    try {
        const db = getFirestoreInstance();
        // En la actualización, no se deberían poder cambiar los campos que forman el ID.
        // Validamos solo los campos que sí pueden cambiar: tipoUbicacion y estado.
        const updateSchema = locationSchema.pick({ tipoUbicacion: true, estado: true });
        const validatedData = updateSchema.parse(data);
        
        await db.collection(collectionName).doc(id).update({
            ...validatedData,
            updatedAt: new Date().toISOString()
        });
        
        revalidatePath("/inventory/settings/locations");
        return { success: true, message: "Localizador actualizado con éxito." };
    } catch (error: any) {
        console.error("Error en updateLocation:", error);
         if (error instanceof z.ZodError) {
            return { success: false, message: error.errors.map(e => e.message).join(", ") };
        }
        return { success: false, message: error.message || "Error al actualizar el localizador." };
    }
}

// Eliminar un localizador
export async function deleteLocation(id: string) {
    try {
        const db = getFirestoreInstance();
        await db.collection(collectionName).doc(id).delete();
        revalidatePath("/inventory/settings/locations");
        return { success: true, message: "Localizador eliminado con éxito." };
    } catch (error: any) {
        console.error("Error en deleteLocation:", error);
        return { success: false, message: "Error al eliminar el localizador." };
    }
}
