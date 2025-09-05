// lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

// ✅ Initialize Firebase safely (no duplicate apps)
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Export Auth + Firestore instances
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export { app };
