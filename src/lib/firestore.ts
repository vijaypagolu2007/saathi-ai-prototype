
import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import type { JournalEntry, MoodEntry } from './types';

// Add a new journal entry for a specific user
export const addJournalEntry = async (userId: string, entryData: Omit<JournalEntry, 'id' | 'userId' | 'date' | 'createdAt' | 'updatedAt'>) => {
  try {
    await addDoc(collection(db, 'users', userId, 'journal'), {
      ...entryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding journal entry: ", error);
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
        prompt: data.prompt,
        content: data.content,
        summary: data.summary,
        analysis: data.analysis,
      } as JournalEntry);
    });
    return entries;
  } catch (error) {
    console.error("Error getting journal entries: ", error);
    throw new Error('Failed to get journal entries.');
  }
};

// Add a new mood entry for a specific user
export const addMoodEntry = async (userId: string, moodData: Omit<MoodEntry, 'id' | 'userId' | 'date' | 'createdAt'>) => {
    try {
        await addDoc(collection(db, 'users', userId, 'moods'), {
            ...moodData,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error adding mood entry: ", error);
        throw new Error('Failed to add mood entry.');
    }
};

// Get all mood entries for a specific user
export const getMoodEntries = async (userId: string): Promise<MoodEntry[]> => {
    try {
        const q = query(collection(db, 'users', userId, 'moods'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const entries: MoodEntry[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate() ?? new Date();
            
            entries.push({
                id: doc.id,
                userId: userId,
                date: createdAt.toISOString(),
                createdAt: createdAt.toISOString(),
                mood: data.mood,
                moodScore: data.moodScore,
            } as MoodEntry);
        });
        return entries;
    } catch (error) {
        console.error("Error getting mood entries: ", error);
        throw new Error('Failed to get mood entries.');
    }
};
