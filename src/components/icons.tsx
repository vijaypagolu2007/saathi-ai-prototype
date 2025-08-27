import { cn } from "@/lib/utils";
import React from "react";

export const SaathiIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 21a9 9 0 0 0-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 0-9 9z" />
    <path d="M12 3a9 9 0 0 0 9 9" />
    <path d="M12 21a9 9 0 0 1-9-9" />
  </svg>
);
