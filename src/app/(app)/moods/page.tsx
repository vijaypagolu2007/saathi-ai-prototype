
"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis, ReferenceLine } from "recharts";
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
  averageScore: {
    label: "Average Mood Score",
    color: "hsl(var(--chart-1))",
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
  }, [entries]);

  const hasData = useMemo(() => entries.length > 0, [entries]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline">My Moods</h1>
      <p className="text-lg text-muted-foreground">
        This chart shows your average mood score over the last week. Tracking your mood can help you notice patterns and reflect on your emotional well-being.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>7-Day Mood Trend</CardTitle>
          <CardDescription>
            A higher score indicates more positive moods, while a lower score reflects more challenging days. A score of 0 is neutral.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasData ? (
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
                    No journal entries found for the last 7 days.
                    <br />
                    Start journaling to see your mood trends.
                </p>
            </div>
          )}
        </CardContent>
      </Card>
       <p className="text-sm text-center text-muted-foreground">
          Remember, fluctuations in mood are normal. This tool is for self-reflection, not for diagnosis.
        </p>
    </div>
  );
}

