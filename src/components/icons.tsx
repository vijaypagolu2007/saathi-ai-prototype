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
    <path d="M12 5C7.03 5 3 9.03 3 14c0 2.22.89 4.25 2.34 5.74" />
    <path d="M12 5c4.97 0 9 4.03 9 9 0 2.22-.89 4.25-2.34 5.74" />
    <path d="M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="M18.66 19.74c-1.45-1.49-3.48-2.5-5.66-2.5s-4.21 1.01-5.66 2.5" />
  </svg>
);
