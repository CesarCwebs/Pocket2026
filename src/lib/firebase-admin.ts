import admin from 'firebase-admin';

/**
 * Singleton to initialize Firebase Admin.
 * Does not throw at top level to prevent Next.js server crash loop if ENVs are missing.
 */
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin credentials missing. Firestore operations will fail.');
    return null;
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    return null;
  }
}

const app = initializeFirebaseAdmin();

export const db = app ? admin.firestore() : null;
export { admin };

export function ensureFirebaseAdminIsInitialized() {
  return !!admin.apps.length;
}
