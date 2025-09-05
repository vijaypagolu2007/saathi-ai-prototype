// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANTCeu3Xv_fMPbUUmaZCcrOif6puC9Tio",
  authDomain: "saathiai-web.firebaseapp.com",
  projectId: "saathiai-web",
  storageBucket: "saathiai-web.appspot.com",
  messagingSenderId: "1090333053745",
  appId: "1:1090333053745:web:102a70af9f5c2de7f45610"
};

// Initialize Firebase for SSR and SSG
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
