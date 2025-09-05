import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import type { JournalEntry } from './types';

// Add a new journal entry for a specific user
export const addJournalEntry = async (userId: string, entryData: Omit<JournalEntry, 'id' | 'userId' | 'date'> & { date: Date }) => {
  try {
    await addDoc(collection(db, 'users', userId, 'journalEntries'), {
      ...entryData,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error('Failed to add journal entry.');
  }
};

// Get all journal entries for a specific user
export const getJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  try {
    const q = query(collection(db, 'users', userId, 'journalEntries'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const entries: JournalEntry[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      entries.push({
        id: doc.id,
        userId: userId,
        ...data,
        date: (data.createdAt?.toDate() ?? new Date()).toISOString(),
      } as JournalEntry);
    });
    return entries;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw new Error('Failed to get journal entries.');
  }
};
