import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import type { JournalEntry } from './types';

// Add a new journal entry for a specific user
export const addJournalEntry = async (userId: string, entryData: Omit<JournalEntry, 'id' | 'userId' | 'date' | 'createdAt' | 'updatedAt'>) => {
  try {
    await addDoc(collection(db, 'users', userId, 'journal'), {
      ...entryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error('Failed to add journal entry.');
  }
};

// Get all journal entries for a specific user
export const getJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  try {
    const q = query(collection(db, 'users', userId, 'journal'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const entries: JournalEntry[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate() ?? new Date();
      const updatedAt = data.updatedAt?.toDate() ?? new Date();
      
      entries.push({
        id: doc.id,
        userId: userId,
        date: createdAt.toISOString(),
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
        title: data.title || 'Untitled Entry',
        mood: data.mood,
        moodScore: data.moodScore,
        prompt: data.prompt,
        content: data.content,
        analysis: data.analysis,
      } as JournalEntry);
    });
    return entries;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw new Error('Failed to get journal entries.');
  }
};
