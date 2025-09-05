
// Import the functions you need from the SDKs you need
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
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate that all required Firebase config values are present
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || firebaseConfig.apiKey.includes("your_api_key")) {
    console.error("Firebase configuration is missing or incomplete. Please create a .env file in the root of your project and add your Firebase credentials. See README.md for more details.");
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Initialize Firebase on demand
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
} else {
    // Provide dummy objects if config is not available to avoid app crashes
    // This allows the app to build and run, but Firebase features will not work
    // and will likely throw errors when used.
    app = {} as FirebaseApp;
    auth = {} as Auth;
    db = {} as Firestore;
}


export { auth, db };
