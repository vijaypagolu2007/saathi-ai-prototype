
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "saathiai-web",
  "appId": "1:1090333053745:web:102a70af9f5c2de7f45610",
  "apiKey": "AIzaSyANTCeu3Xv_fMPbUUmaZCcrOif6puC9Tio",
  "authDomain": "saathiai-web.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1090333053745"
};

// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
