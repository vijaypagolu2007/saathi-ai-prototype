
"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ResilienceTreeProps {
  growthPoints: number;
}

export const ResilienceTree: React.FC<ResilienceTreeProps> = ({
  growthPoints,
}) => {
  const getStage = () => {
    if (growthPoints <= 5) return 1;
    if (growthPoints <= 15) return 2;
    if (growthPoints <= 30) return 3;
    return 4;
  };

  const stage = getStage();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full max-w-md"
      >
        <path
          d="M 10 190 Q 100 170 190 190"
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
          fill="transparent"
        />

        {/* Stage 1: Sapling */}
        <g
          className={cn(
            "transition-opacity duration-1000",
            stage >= 1 ? "opacity-100" : "opacity-0"
          )}
        >
          <path
            d="M 100 190 C 100 150, 90 140, 105 130"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx="108"
            cy="128"
            r="5"
            fill="hsl(var(--accent))"
            className="animate-pulse"
          />
        </g>

        {/* Stage 2: Growing Tree */}
        <g
          className={cn(
            "transition-opacity duration-1000 delay-500",
            stage >= 2 ? "opacity-100" : "opacity-0"
          )}
        >
          <path
            d="M 100 190 C 100 120, 120 110, 110 80"
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 100 190 C 90 150, 80 140, 85 110"
            stroke="hsl(var(--primary))"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="115" cy="75" r="10" fill="hsl(var(--accent))" />
          <circle cx="80" cy="105" r="8" fill="hsl(var(--accent))" />
          <circle cx="95" cy="120" r="12" fill="hsl(var(--accent))" />
        </g>

        {/* Stage 3: Strong Tree */}
        <g
          className={cn(
            "transition-opacity duration-1000 delay-700",
            stage >= 3 ? "opacity-100" : "opacity-0"
          )}
        >
          <path
            d="M 110 80 C 130 60, 140 40, 125 30"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 85 110 C 70 90, 60 80, 75 60"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="128" cy="28" r="9" fill="hsl(var(--accent))" />
          <circle cx="73" cy="58" r="11" fill="hsl(var(--accent))" />
          <circle cx="100" cy="60" r="15" fill="hsl(var(--accent))" />
        </g>

        {/* Stage 4: Flourishing Tree */}
        <g
          className={cn(
            "transition-opacity duration-1000 delay-1000",
            stage >= 4 ? "opacity-100" : "opacity-0"
          )}
        >
          <circle
            cx="120"
            cy="50"
            r="20"
            fill="hsl(var(--accent))"
            className="opacity-70"
          />
          <circle
            cx="80"
            cy="80"
            r="25"
            fill="hsl(var(--accent))"
            className="opacity-70"
          />
          <circle
            cx="100"
            cy="95"
            r="22"
            fill="hsl(var(--accent))"
            className="opacity-70"
          />
          <circle
            cx="110"
            cy="20"
            r="15"
            fill="hsl(var(--accent))"
            className="opacity-70"
          />
          <circle
            cx="90"
            cy="40"
            r="18"
            fill="hsl(var(--accent))"
            className="opacity-70"
          />
        </g>
      </svg>
    </div>
  );
};
