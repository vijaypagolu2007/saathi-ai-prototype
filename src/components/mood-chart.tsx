"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis, ReferenceLine } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MoodEntry } from "@/lib/types";
import { useMemo } from "react";
import { subDays, format, parseISO, isSameDay } from "date-fns";
import { LoaderCircle } from "lucide-react";

const chartConfig = {
  averageScore: {
    label: "Average Mood Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface MoodChartProps {
    moodEntries: MoodEntry[];
    isLoading: boolean;
    days: number;
}

export function MoodChart({ moodEntries, isLoading, days }: MoodChartProps) {
    const chartData = useMemo(() => {
        const lastXDays = Array.from({ length: days }, (_, i) =>
        subDays(new Date(), i)
        ).reverse();

        return lastXDays.map((day) => {
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
    }, [moodEntries, days]);

    const hasData = useMemo(() => moodEntries.length > 0, [moodEntries]);
    const tickFormatter = (value: string, index: number) => {
        if (days > 7) {
            return index % 5 === 0 ? value : "";
        }
        return value;
    }

    if (isLoading) {
        return <div className="flex h-[300px] w-full items-center justify-center"><LoaderCircle className="mx-auto animate-spin" /></div>
    }

    if (!hasData) {
        return (
            <div className="flex h-[300px] w-full items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-center text-muted-foreground">
                    No mood entries yet.
                    <br />
                    Start journaling to see your mood trends.
                </p>
            </div>
        );
    }

    return (
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
            tickFormatter={tickFormatter}
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
            dot={days <= 7}
            activeDot={{
                r: 6,
            }}
            connectNulls
            />
        </LineChart>
        </ChartContainer>
    );
}
