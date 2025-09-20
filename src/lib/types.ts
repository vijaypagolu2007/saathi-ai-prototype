
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type JournalEntry = {
  id: string;
  userId: string;
  date: string; // This will be the ISO string of the createdAt date
  title: string;
  prompt: string;
  content: string;
  summary?: string; // AI-generated summary
  analysis?: {
    mood: string;
    valence: number;
    energy: number;
  };
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

export type MoodEntry = {
  id: string;
  userId: string;
  date: string; // ISO string
  mood: string;
  moodScore: number;
  createdAt: string; // ISO string
};
