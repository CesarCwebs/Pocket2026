'use server';

import { admin } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

const collectionName = 'inventory_cost_centers';

// --- Obtener todos los centros de costo ---
export async function getCostCenters() {
    try {
        const db = admin.firestore();
        const snapshot = await db.collection(collectionName).orderBy('createdAt', 'desc').get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching cost centers:', error);
        return { error: 'No se pudo obtener los datos.' };
    }
}

// --- Crear un nuevo centro de costo ---
export async function createCostCenter(data: { id: string, name: string, area: string }) {
    try {
        const db = admin.firestore();
        const { id, ...rest } = data;
        await db.collection(collectionName).doc(id).set({
            ...rest,
            createdAt: new Date().toISOString(),
        });
        revalidatePath('/inventory/settings/cost-centers');
        return { success: true, message: `Centro de costo ${id} creado.` };
    } catch (error) {
        console.error('Error creating cost center:', error);
        return { success: false, message: 'Error al crear el centro de costo.' };
    }
}

// --- Actualizar un centro de costo existente ---
export async function updateCostCenter(id: string, data: { name: string, area: string }) {
    try {
        const db = admin.firestore();
        await db.collection(collectionName).doc(id).update(data);
        revalidatePath('/inventory/settings/cost-centers');
        return { success: true, message: `Centro de costo ${id} actualizado.` };
    } catch (error) {
        console.error('Error updating cost center:', error);
        return { success: false, message: 'Error al actualizar el centro de costo.' };
    }
}

// --- Eliminar un centro de costo ---
export async function deleteCostCenter(id: string) {
    try {
        const db = admin.firestore();
        await db.collection(collectionName).doc(id).delete();
        revalidatePath('/inventory/settings/cost-centers');
        return { success: true, message: `Centro de costo ${id} eliminado.` };
    } catch (error) {
        console.error('Error deleting cost center:', error);
        return { success: false, message: 'Error al eliminar el centro de costo.' };
    }
}
