export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  mood: string;
  prompt: string;
  content: string;
};
