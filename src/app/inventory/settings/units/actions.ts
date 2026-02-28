
'use server';

import { getFirestoreInstance } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

const collectionName = 'inventory_units';

// --- Obtener todas las unidades de medida ---
export async function getUnits() {
    try {
        const db = getFirestoreInstance();
        const snapshot = await db.collection(collectionName).orderBy('createdAt', 'desc').get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching units:', error);
        return { error: 'No se pudo obtener los datos.' };
    }
}

// --- Crear una nueva unidad de medida ---
export async function createUnit(data: { id: string, name: string, description: string }) {
    try {
        const db = getFirestoreInstance();
        const { id, ...rest } = data;
        await db.collection(collectionName).doc(id).set({
            ...rest,
            createdAt: new Date().toISOString(),
        });
        revalidatePath('/inventory/settings/units');
        return { success: true, message: `Unidad ${id} creada.` };
    } catch (error) {
        console.error('Error creating unit:', error);
        return { success: false, message: 'Error al crear la unidad.' };
    }
}

// --- Actualizar una unidad de medida existente ---
export async function updateUnit(id: string, data: { name: string, description: string }) {
    try {
        const db = getFirestoreInstance();
        await db.collection(collectionName).doc(id).update(data);
        revalidatePath('/inventory/settings/units');
        return { success: true, message: `Unidad ${id} actualizada.` };
    } catch (error) {
        console.error('Error updating unit:', error);
        return { success: false, message: 'Error al actualizar la unidad.' };
    }
}

// --- Eliminar una unidad de medida ---
export async function deleteUnit(id: string) {
    try {
        const db = getFirestoreInstance();
        await db.collection(collectionName).doc(id).delete();
        revalidatePath('/inventory/settings/units');
        return { success: true, message: `Unidad ${id} eliminada.` };
    } catch (error) {
        console.error('Error deleting unit:', error);
        return { success: false, message: 'Error al eliminar la unidad.' };
    }
}
