"use client";
import dynamic from 'next/dynamic'
import { LoaderCircle } from 'lucide-react'

export const DynamicMoodChart = dynamic(
    () => import('./mood-chart').then((mod) => mod.MoodChart),
    {
        ssr: false,
        loading: () => <div className="flex h-[300px] w-full items-center justify-center"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>
    }
)
