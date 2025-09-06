
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const getUserDoc = async (userId: string) => {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
        return { ref: userDocRef, data: userDocSnap.data() };
    }
    // If the document doesn't exist, we can still return the reference
    // to create it later.
    return { ref: userDocRef, data: null };
}

export const getGrowthPoints = async (userId: string): Promise<number> => {
    const { data } = await getUserDoc(userId);
    return data?.growthPoints || 0;
};

export const setGrowthPoints = async (userId: string, points: number): Promise<void> => {
    const { ref } = await getUserDoc(userId);
    // Use merge: true to create the document if it doesn't exist, or update it if it does.
    await setDoc(ref, { growthPoints: points }, { merge: true });
};

export const getLastCheckIn = async (userId: string): Promise<string> => {
    const { data } = await getUserDoc(userId);
    return data?.lastCheckIn || "";
};

export const setLastCheckIn = async (userId: string, date: string): Promise<void> => {
    const { ref } = await getUserDoc(userId);
    await setDoc(ref, { lastCheckIn: date }, { merge: true });
};
