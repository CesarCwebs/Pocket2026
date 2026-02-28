
import admin from 'firebase-admin';

let db: admin.firestore.Firestore;

function initialize() {
    try {
        // When deployed to a Google Cloud environment (like App Hosting),
        // the SDK automatically uses the project's default service account.
        // No explicit credential configuration is needed.
        if (admin.apps.length === 0) {
            admin.initializeApp();
        }
        
        db = admin.firestore();

    } catch (error: any) {
        console.error('FIREBASE_ADMIN_INIT_ERROR:', error);
        // Provide a more helpful error message for this context.
        throw new Error(`Firebase Admin initialization failed. Ensure the App Hosting backend has the correct IAM permissions. Original error: ${error.message}`);
    }
}

initialize();

export function getFirestoreInstance(): admin.firestore.Firestore {
    if (!db) {
        throw new Error('Firestore instance is not available. Initialization may have failed.');
    }
    return db;
}

export { admin };
