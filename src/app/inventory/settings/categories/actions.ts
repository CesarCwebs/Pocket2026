'use server';

import { admin } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

const collectionName = 'inventory_categories';

// --- Obtener todas las categorías ---
export async function getCategories() {
    try {
        const db = admin.firestore();
        const snapshot = await db.collection(collectionName).orderBy('createdAt', 'desc').get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { error: 'No se pudo obtener los datos.' };
    }
}

// --- Crear una nueva categoría ---
export async function createCategory(data: { id: string, name: string, description: string }) {
    try {
        const db = admin.firestore();
        const { id, ...rest } = data;
        await db.collection(collectionName).doc(id).set({
            ...rest,
            createdAt: new Date().toISOString(),
        });
        revalidatePath('/inventory/settings/categories');
        return { success: true, message: `Categoría ${id} creada.` };
    } catch (error) {
        console.error('Error creating category:', error);
        return { success: false, message: 'Error al crear la categoría.' };
    }
}

// --- Actualizar una categoría existente ---
export async function updateCategory(id: string, data: { name: string, description: string }) {
    try {
        const db = admin.firestore();
        await db.collection(collectionName).doc(id).update(data);
        revalidatePath('/inventory/settings/categories');
        return { success: true, message: `Categoría ${id} actualizada.` };
    } catch (error) {
        console.error('Error updating category:', error);
        return { success: false, message: 'Error al actualizar la categoría.' };
    }
}

// --- Eliminar una categoría ---
export async function deleteCategory(id: string) {
    try {
        const db = admin.firestore();
        await db.collection(collectionName).doc(id).delete();
        revalidatePath('/inventory/settings/categories');
        return { success: true, message: `Categoría ${id} eliminada.` };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, message: 'Error al eliminar la categoría.' };
    }
}
