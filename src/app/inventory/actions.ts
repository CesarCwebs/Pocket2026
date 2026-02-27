'use server';

import { masterItemSchema, type MasterItemFormValues } from './schema';

export async function createMasterMaterialAction(data: MasterItemFormValues) {
  console.log("Recibido en el servidor:", data);

  const validation = masterItemSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      message: "Error de validación: " + validation.error.errors.map(e => e.message).join(', '),
    };
  }

  // Aquí iría la lógica para guardar en la base de datos (Firestore)
  // Por ahora, simularemos un éxito
  try {
    console.log('Simulando guardado en Firestore...');
    // const db = getFirestore();
    // await addDoc(collection(db, 'MD_ITEM'), validation.data);
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simular latencia de red

    console.log('Guardado simulado con éxito.');
    return {
      success: true,
      message: `El material ${validation.data.SKU_ID} ha sido creado.`,
    };
  } catch (error) {
    console.error("Error al guardar:", error);
    return {
      success: false,
      message: 'Ocurrió un error en el servidor al intentar guardar el material.',
    };
  }
}
