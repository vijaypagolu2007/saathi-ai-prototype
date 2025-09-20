
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "saathiai-web",
  "appId": "1:1090333053745:web:102a70af9f5c2de7f45610",
  "apiKey": "AIzaSyANTCeu3Xv_fMPbUUmaZCcrOif6puC9Tio",
  // "authDomain" is intentionally left out.
  // When not specified, the SDK defaults to the domain of the app that is hosting the SDK,
  // which will be localhost in this development environment.
  // "authDomain": "saathiai-web.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1090333053745"
};

// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.warn('Firestore persistence failed: Multiple tabs open.');
      } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the features required to enable persistence
        console.warn('Firestore persistence is not available in this browser.');
      }
    });
}


export { app, auth, db };
