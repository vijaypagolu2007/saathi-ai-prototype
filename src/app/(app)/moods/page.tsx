"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { JournalEntry } from "@/lib/types";
import { useMemo } from "react";
import { subDays, format, parseISO, isSameDay } from "date-fns";

const chartConfig = {
  valence: {
    label: "Mood Valence",
  },
  Happy: {
    label: "Happy",
    color: "hsl(var(--chart-1))",
  },
  Sad: {
    label: "Sad",
    color: "hsl(var(--chart-2))",
  },
  Anxious: {
    label: "Anxious",
    color: "hsl(var(--chart-3))",
  },
  Calm: {
    label: "Calm",
    color: "hsl(var(--chart-4))",
  },
  Angry: {
    label: "Angry",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function MoodsPage() {
  const [entries] = useLocalStorage<JournalEntry[]>("journal-entries", []);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      subDays(new Date(), i)
    ).reverse();

    return last7Days.map((day) => {
      const entriesForDay = entries.filter((entry) =>
        isSameDay(parseISO(entry.date), day)
      );
      
      let totalValence = 0;
      let analyzedEntriesCount = 0;
      const moodCounts: { [key: string]: number } = { Happy: 0, Sad: 0, Anxious: 0, Calm: 0, Angry: 0 };

      entriesForDay.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        if (entry.analysis?.valence) {
          totalValence += entry.analysis.valence;
          analyzedEntriesCount++;
        }
      });
      
      const averageValence = analyzedEntriesCount > 0 ? totalValence / analyzedEntriesCount : 0;

      return {
        date: format(day, "MMM d"),
        ...moodCounts,
        averageValence,
      };
    });
  }, [entries]);

  const hasData = useMemo(() => entries.length > 0, [entries]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline">My Moods</h1>
      <p className="text-lg text-muted-foreground">
        Visualize your mood trends over the last week based on your journal entries.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>7-Day Mood Summary</CardTitle>
          <CardDescription>
            Each bar shows the moods you've recorded on that day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasData ? (
             <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  allowDecimals={false}
                  label={{ value: 'Number of Entries', angle: -90, position: 'insideLeft' }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="Happy" stackId="a" fill="var(--color-Happy)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Sad" stackId="a" fill="var(--color-Sad)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Anxious" stackId="a" fill="var(--color-Anxious)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Calm" stackId="a" fill="var(--color-Calm)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Angry" stackId="a" fill="var(--color-Angry)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[250px] w-full items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">
                    No journal entries found for the last 7 days.
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
