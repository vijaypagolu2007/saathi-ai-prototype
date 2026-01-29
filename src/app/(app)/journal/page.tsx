
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import type { JournalEntry } from "@/lib/types";
import { generateJournalPrompt } from "@/ai/flows/journal-prompt";
import { analyzeMood } from "@/ai/flows/mood-analysis";
import { summarizeJournalEntry } from "@/ai/flows/summarize-entry";
import { WandSparkles, LoaderCircle, BrainCircuit, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { addJournalEntry, getJournalEntries, addMoodEntry, getMoodEntries } from "@/lib/firestore";
import type { MoodEntry } from "@/lib/types";
import { getGrowthPoints, setGrowthPoints } from "@/lib/user-data";
import { Input } from "@/components/ui/input";
import { DynamicMoodChart } from "@/components/dynamic-mood-chart";

const moods = [
    { name: "Happy", emoji: "😀", score: 2 },
    { name: "Calm", emoji: "🙂", score: 1 },
    { name: "Neutral", emoji: "😐", score: 0 },
    { name: "Sad", emoji: "😔", score: -1 },
    { name: "Angry", emoji: "😡", score: -2 },
    { name: "Anxious", emoji: "😰", score: -2 },
  ];

export default function JournalPage() {
  const { user } = useAuth();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [journalTitle, setJournalTitle] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchEntries = async () => {
      if (user) {
        setIsLoading(true);
        const userJournalEntries = await getJournalEntries(user.uid);
        const userMoodEntries = await getMoodEntries(user.uid);
        setJournalEntries(userJournalEntries);
        setMoodEntries(userMoodEntries);
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, [user]);

  const handleGetPrompt = async () => {
    if (!selectedMood) return;
    setIsPromptLoading(true);
    setPrompt("");
    try {
      const result = await generateJournalPrompt({ mood: selectedMood });
      setPrompt(result.prompt);
    } catch (error) {
        console.error("Failed to generate prompt:", error);
        toast({
            title: "Error",
            description: "Could not get a prompt. Please try again.",
            variant: "destructive",
        });
    } finally {
      setIsPromptLoading(false);
    }
  };

  const handleSaveEntry = async () => {
    if (!journalText.trim() || !user) return;
    setIsSaving(true);

    let entryMoodName = selectedMood;
    let moodAnalysis = null;
    let entrySummary = "";

    try {
      // Analyze mood from text if no mood is selected
      if (!entryMoodName && journalText.trim()) {
        const analysisResult = await analyzeMood({ text: journalText });
        const foundMood = moods.find(m => m.name.toLowerCase() === analysisResult.mood.toLowerCase());
        entryMoodName = foundMood ? foundMood.name : "Neutral";
        moodAnalysis = analysisResult;
        toast({
            title: `Mood detected: ${entryMoodName}`,
            description: "We've analyzed your entry to understand how you're feeling.",
        });
      }
      
      // Generate summary
      const summaryResult = await summarizeJournalEntry({ content: journalText });
      entrySummary = summaryResult.summary;
      
      const finalMood = moods.find(m => m.name === entryMoodName) ?? moods.find(m => m.name === 'Neutral')!;
      
      // Save Mood Entry
      await addMoodEntry(user.uid, {
        mood: finalMood.name,
        moodScore: finalMood.score,
      });

      // Save Journal Entry
      const newJournalEntry: Omit<JournalEntry, 'id' | 'userId' | 'date' | 'createdAt' | 'updatedAt'> = {
        title: journalTitle.trim() || `Journal Entry - ${new Date().toLocaleDateString()}`,
        prompt: prompt,
        content: journalText,
        summary: entrySummary,
        analysis: moodAnalysis ?? undefined,
      };

      await addJournalEntry(user.uid, newJournalEntry);
      
      // Refresh data
      const updatedJournalEntries = await getJournalEntries(user.uid);
      const updatedMoodEntries = await getMoodEntries(user.uid);
      setJournalEntries(updatedJournalEntries);
      setMoodEntries(updatedMoodEntries);

      // Give growth point
      const currentPoints = await getGrowthPoints(user.uid);
      await setGrowthPoints(user.uid, currentPoints + 1);

      // Reset form
      setSelectedMood(null);
      setPrompt("");
      setJournalText("");
      setJournalTitle("");
       toast({
        title: "Entry Saved!",
        description: "Your journal and mood have been saved. You've earned a growth point.",
      });

    } catch (error) {
      console.error("Failed to save entry:", error);
      toast({
        title: "Error saving entry",
        description: "There was a problem saving your entry. Please try again.",
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
            Select a mood to get a personalized journal prompt, or just start writing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {moods.map((mood) => (
              <Button
                key={mood.name}
                variant={selectedMood === mood.name ? "default" : "outline"}
                onClick={() => setSelectedMood(mood.name)}
                className="flex-grow rounded-lg p-6 text-lg sm:flex-grow-0"
              >
                <span className="mr-3 text-3xl">{mood.emoji}</span> {mood.name}
              </Button>
            ))}
          </div>
          
          <div className="space-y-4 rounded-lg border bg-background/50 p-4">
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
            
              <Input 
                placeholder="Title (optional)"
                value={journalTitle}
                onChange={(e) => setJournalTitle(e.target.value)}
              />
              <Textarea
                placeholder="Start writing here..."
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                rows={10}
              />
              <div className="flex justify-end">
                <Button onClick={handleSaveEntry} disabled={!journalText.trim() || isSaving}>
                   {isSaving ? (
                    <LoaderCircle className="mr-2 animate-spin" />
                  ) : (
                    !selectedMood && <BrainCircuit className="mr-2" />
                  )}
                  {isSaving ? 'Saving...' : (selectedMood ? 'Save Entry' : 'Analyze & Save')} (+1 Growth Point)
                </Button>
              </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7-Day Mood Trend</CardTitle>
          <CardDescription>
            Your average mood score over the last week. A score of 0 is neutral.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicMoodChart moodEntries={moodEntries} isLoading={isLoading} days={7} />
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-headline">Past Entries</h2>
        {isLoading ? <LoaderCircle className="mx-auto animate-spin" /> : journalEntries.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {journalEntries.map((entry) => (
              <Card key={entry.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {entry.title}
                  </CardTitle>
                  <CardDescription>
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {entry.prompt && (
                    <p className="mb-2 rounded-md bg-muted/50 p-2 text-sm italic">
                      Prompt: "{entry.prompt}"
                    </p>
                  )}
                  <p className="whitespace-pre-wrap line-clamp-4">{entry.content}</p>
                </CardContent>
                {entry.summary && (
                  <>
                  <Separator className="my-2" />
                  <CardFooter className="flex-col items-start gap-2 pt-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <h4 className="font-semibold">AI Summary</h4>
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{entry.summary}"</p>
                  </CardFooter>
                  </>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="flex items-center justify-center p-12">
            <p className="text-center text-muted-foreground">
              You have no journal entries yet.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
