
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const getUserDocRef = (userId: string) => {
    return doc(db, 'users', userId);
};

export const getGrowthPoints = async (userId: string): Promise<number> => {
    const userDocRef = getUserDocRef(userId);
    try {
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            return userDocSnap.data()?.growthPoints || 0;
        }
    } catch (error) {
        console.error("Error fetching growth points:", error);
        // If offline and no cache, return a default value to prevent crash
        if ((error as any).code === 'unavailable') {
            console.warn('Firestore is unavailable. Returning default growth points.');
            return 0;
        }
    }
    return 0; // Return default value if doc doesn't exist or on other errors
};

export const setGrowthPoints = async (userId: string, points: number): Promise<void> => {
    const userDocRef = getUserDocRef(userId);
    // Use merge: true to create the document if it doesn't exist, or update it if it does.
    await setDoc(userDocRef, { growthPoints: points }, { merge: true });
};

export const getLastCheckIn = async (userId: string): Promise<string> => {
    const userDocRef = getUserDocRef(userId);
    try {
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            return userDocSnap.data()?.lastCheckIn || "";
        }
    } catch (error) {
        console.error("Error fetching last check-in:", error);
         // If offline and no cache, return a default value to prevent crash
        if ((error as any).code === 'unavailable') {
            console.warn('Firestore is unavailable. Returning default last check-in.');
            return "";
        }
    }
    return ""; // Return default value
};

export const setLastCheckIn = async (userId: string, date: string): Promise<void> => {
    const userDocRef = getUserDocRef(userId);
    await setDoc(userDocRef, { lastCheckIn: date }, { merge: true });
};
