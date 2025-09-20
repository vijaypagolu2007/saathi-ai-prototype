
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Function to initialize and get the Firebase app instance
function initializeFirebaseApp(): FirebaseApp {
  if (getApps().length) {
    return getApp();
  }

  // Validate the configuration
  const requiredConfigKeys: (keyof typeof firebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];
  for (const key of requiredConfigKeys) {
    if (!firebaseConfig[key]) {
      throw new Error(
        `Firebase config is missing or invalid: \`${key}\` is not set. Please ensure all NEXT_PUBLIC_FIREBASE_* variables are set in your .env.local file.`
      );
    }
  }

  return initializeApp(firebaseConfig);
}

const app: FirebaseApp = initializeFirebaseApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
