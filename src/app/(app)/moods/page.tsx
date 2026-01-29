
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MoodEntry } from "@/lib/types";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { getMoodEntries } from "@/lib/firestore";
import { DynamicMoodChart } from "@/components/dynamic-mood-chart";


export default function MoodsPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      if (user) {
        setIsLoading(true);
        const userEntries = await getMoodEntries(user.uid);
        setEntries(userEntries);
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, [user]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline">My Moods</h1>
      <p className="text-lg text-muted-foreground">
        This chart shows your average mood score over the last 30 days. Tracking your mood can help you notice patterns and reflect on your emotional well-being.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>30-Day Mood Trend</CardTitle>
          <CardDescription>
            A higher score indicates more positive moods, while a lower score reflects more challenging days. A score of 0 is neutral.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicMoodChart moodEntries={entries} isLoading={isLoading} days={30} />
        </CardContent>
      </Card>
       <p className="text-sm text-center text-muted-foreground">
          Remember, fluctuations in mood are normal. This tool is for self-reflection, not for diagnosis.
        </p>
    </div>
  );
}
