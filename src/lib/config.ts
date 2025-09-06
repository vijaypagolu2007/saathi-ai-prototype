// lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Firebase configuration variables, prefixed with NEXT_PUBLIC_ to be
// available on both the server and client.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


// ✅ Initialize Firebase safely (no duplicate apps)
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Export Auth + Firestore instances
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export { app };