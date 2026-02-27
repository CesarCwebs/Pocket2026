
import admin from 'firebase-admin';

// Valida que las variables de entorno de Firebase existan.
// Si alguna falta, la aplicación no puede funcionar y debe fallar inmediatamente.
if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error('FIREBASE_PROJECT_ID is not set in the environment variables.');
}
if (!process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error('FIREBASE_CLIENT_EMAIL is not set in the environment variables.');
}
if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('FIREBASE_PRIVATE_KEY is not set in the environment variables.');
}

/**
 * Implementación de un Singleton para inicializar Firebase Admin.
 * Esto asegura que la inicialización ocurra solo una vez en todo el ciclo de vida de la aplicación.
 */
function initializeFirebaseAdmin() {
  // Si ya hay una aplicación inicializada, la devolvemos para evitar errores.
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Las credenciales se leen directamente de las variables de entorno validadas.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\n/g, '\n');

  // Inicializamos la aplicación de Firebase Admin.
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

// Inicializamos la app y la exportamos.
// De ahora en adelante, solo importaremos 'db' y 'admin' desde este archivo.
initializeFirebaseAdmin();

export const db = admin.firestore();
export { admin };

/**
 * Esta función ahora es OBSOLETA y se mantiene solo para evitar errores de importación.
 * La nueva implementación inicializa Firebase en el momento en que se carga este módulo.
 * DEBE ser eliminada de todos los archivos que la usan.
 */
export function ensureFirebaseAdminIsInitialized() {
  // No hace nada. La inicialización ya está garantizada.
  console.warn("DEPRECATION WARNING: ensureFirebaseAdminIsInitialized() is deprecated and should be removed. Firebase is now auto-initialized.");
}
