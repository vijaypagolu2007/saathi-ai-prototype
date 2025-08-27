"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { JournalEntry } from "@/lib/types";
import { generateJournalPrompt } from "@/ai/flows/journal-prompt";
import { analyzeMood } from "@/ai/flows/mood-analysis";
import { WandSparkles, LoaderCircle, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const moods = [
  { name: "Happy", emoji: "😊" },
  { name: "Sad", emoji: "😢" },
  { name: "Anxious", emoji: "😟" },
  { name: "Calm", emoji: "😌" },
  { name: "Angry", emoji: "😠" },
];

export default function JournalPage() {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>(
    "journal-entries",
    []
  );
  const [, setGrowthPoints] = useLocalStorage<number>("growth-points", 0);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [journalText, setJournalText] = useState("");
  const { toast } = useToast();

  const handleGetPrompt = async () => {
    if (!selectedMood) return;
    setIsPromptLoading(true);
    setPrompt("");
    try {
      const result = await generateJournalPrompt({ mood: selectedMood });
      setPrompt(result.prompt);
    } catch (error) {
      console.error("Failed to generate prompt:", error);
      setPrompt(
        "Could not get a prompt. Why not write about what's on your mind?"
      );
    } finally {
      setIsPromptLoading(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!journalText.trim()) return;
    setIsSaving(true);

    let entryMood = selectedMood;
    let moodAnalysis = null;

    try {
      if (!entryMood && journalText.trim()) {
        const analysisResult = await analyzeMood({ text: journalText });
        const foundMood = moods.find(m => m.name.toLowerCase() === analysisResult.mood.toLowerCase());
        entryMood = foundMood ? foundMood.name : "Calm"; // Default to Calm if not found
        moodAnalysis = analysisResult;
        toast({
            title: `Mood detected: ${entryMood}`,
            description: "We've analyzed your entry to understand how you're feeling.",
        });
      }

      if (!entryMood) {
        // This case handles if mood analysis fails or text is empty, though we check for empty text earlier.
        // For robustness, we could assign a default or prompt the user.
        toast({
          title: "Please select a mood",
          description: "Select a mood before saving your entry.",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      const newEntry: JournalEntry = {
        id: new Date().toISOString(),
        date: new Date().toISOString(),
        mood: entryMood,
        prompt: prompt,
        content: journalText,
        analysis: moodAnalysis ?? undefined,
      };

      setEntries([newEntry, ...entries]);
      setGrowthPoints((prev) => prev + 1);
      setSelectedMood(null);
      setPrompt("");
      setJournalText("");
    } catch (error) {
      console.error("Failed to save entry:", error);
      toast({
        title: "Error saving entry",
        description: "There was a problem analyzing or saving your journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline">My Journal</h1>

      <Card>
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
          <CardDescription>
            Select a mood to get a personalized journal prompt, or just start writing and let Saathi understand.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            {moods.map((mood) => (
              <Button
                key={mood.name}
                variant={selectedMood === mood.name ? "default" : "outline"}
                onClick={() => setSelectedMood(mood.name)}
                className="flex-grow rounded-lg p-6 text-lg sm:flex-grow-0"
              >
                <span className="mr-2 text-2xl">{mood.emoji}</span> {mood.name}
              </Button>
            ))}
          </div>
          
          <div className="space-y-4 rounded-lg border bg-card p-4">
              {selectedMood && (
                <div className="space-y-4">
                  <Button onClick={handleGetPrompt} disabled={isPromptLoading}>
                    {isPromptLoading ? (
                      <LoaderCircle className="mr-2 animate-spin" />
                    ) : (
                      <WandSparkles className="mr-2" />
                    )}
                    Get a prompt for '{selectedMood}'
                  </Button>
                  {prompt && (
                    <p className="rounded-md bg-muted p-4 italic">"{prompt}"</p>
                  )}
                </div>
              )}
            
              <Textarea
                placeholder="Start writing here..."
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                rows={10}
              />
              <Button onClick={handleSaveEntry} disabled={!journalText.trim() || isSaving}>
                 {isSaving ? (
                  <LoaderCircle className="mr-2 animate-spin" />
                ) : (
                  !selectedMood && <BrainCircuit className="mr-2" />
                )}
                {isSaving ? 'Saving...' : (selectedMood ? 'Save Entry' : 'Analyze & Save')} (+1 Growth Point)
              </Button>
            </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-headline">Past Entries</h2>
        {entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <span>{moods.find((m) => m.name === entry.mood)?.emoji}</span>
                    {entry.mood}
                  </CardTitle>
                  <CardDescription>
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {entry.prompt && (
                    <p className="mb-2 rounded-md bg-muted/50 p-2 text-sm italic">
                      Prompt: "{entry.prompt}"
                    </p>
                  )}
                  <p className="whitespace-pre-wrap">{entry.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            You have no journal entries yet.
          </p>
        )}
      </div>
    </div>
  );
}
