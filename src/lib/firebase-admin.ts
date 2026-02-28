
import admin from 'firebase-admin';

let db: admin.firestore.Firestore;

function initialize() {
    try {
        const credentialsBase64 = process.env.FIREBASE_CREDENTIALS_BASE64;
        let serviceAccount: any;

        if (credentialsBase64) {
            // Preferred method: Use Base64 encoded credentials
            const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf-8');
            serviceAccount = JSON.parse(credentialsJson);
            
            // The private key from the parsed JSON needs its literal \n characters replaced with actual newlines.
            if (serviceAccount.private_key) {
                serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
            }

        } else {
            // Fallback method for older setups
            throw new Error('FIREBASE_CREDENTIALS_BASE64 is not set. Please use the Base64 method for credentials.');
        }

        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }
        
        db = admin.firestore();

    } catch (error: any) {
        console.error('FIREBASE_ADMIN_INIT_ERROR:', error);
        throw new Error(`Firebase Admin initialization failed. The credential data is likely corrupted. Original error: ${error.message}`);
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
