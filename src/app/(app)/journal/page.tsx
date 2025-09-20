
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
} from "@/components/ui/card";
import type { JournalEntry } from "@/lib/types";
import { generateJournalPrompt } from "@/ai/flows/journal-prompt";
import { analyzeMood } from "@/ai/flows/mood-analysis";
import { WandSparkles, LoaderCircle, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ReferenceLine } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { subDays, format, parseISO, isSameDay } from "date-fns";
import { useAuth } from "@/context/auth-context";
import { addJournalEntry, getJournalEntries, addMoodEntry, getMoodEntries } from "@/lib/firestore";
import type { MoodEntry } from "@/lib/types";
import { getGrowthPoints, setGrowthPoints } from "@/lib/user-data";
import { Input } from "@/components/ui/input";

const moods = [
    { name: "Happy", emoji: "😀", score: 2 },
    { name: "Calm", emoji: "🙂", score: 1 },
    { name: "Neutral", emoji: "😐", score: 0 },
    { name: "Sad", emoji: "😔", score: -1 },
    { name: "Angry", emoji: "😡", score: -2 },
    { name: "Anxious", emoji: "😰", score: -2 },
  ];

const chartConfig = {
  averageScore: {
    label: "Average Mood Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

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

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      subDays(new Date(), i)
    ).reverse();

    return last7Days.map((day) => {
      const entriesForDay = moodEntries.filter((entry) =>
        isSameDay(parseISO(entry.date), day)
      );

      if (entriesForDay.length === 0) {
        return {
          date: format(day, "MMM d"),
          averageScore: null,
        };
      }

      const totalScore = entriesForDay.reduce((sum, entry) => sum + entry.moodScore, 0);
      const averageScore = totalScore / entriesForDay.length;

      return {
        date: format(day, "MMM d"),
        averageScore: averageScore,
      };
    });
  }, [moodEntries]);

  const hasData = useMemo(() => moodEntries.length > 0, [moodEntries]);

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
          {isLoading ? <LoaderCircle className="mx-auto animate-spin" /> : hasData ? (
             <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[-2, 2]}
                  ticks={[-2, -1, 0, 1, 2]}
                  tickFormatter={(value) => {
                      if (value === 2) return "😀";
                      if (value === 1) return "🙂";
                      if (value === 0) return "😐";
                      if (value === -1) return "😔";
                      if (value === -2) return "😡/😰";
                      return "";
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                 <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <Line
                  dataKey="averageScore"
                  type="monotone"
                  stroke="var(--color-averageScore)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-averageScore)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                  connectNulls
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[300px] w-full items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-center text-muted-foreground">
                    No mood entries yet.
                    <br />
                    Start journaling to see your mood trends.
                </p>
            </div>
          )}
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
                  <p className="whitespace-pre-wrap line-clamp-6">{entry.content}</p>
                </CardContent>
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
