
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
    }
    return 0; // Return default value if offline or doc doesn't exist
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
    }
    return ""; // Return default value
};

export const setLastCheckIn = async (userId: string, date: string): Promise<void> => {
    const userDocRef = getUserDocRef(userId);
    await setDoc(userDocRef, { lastCheckIn: date }, { merge: true });
};
