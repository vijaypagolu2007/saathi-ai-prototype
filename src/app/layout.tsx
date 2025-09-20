
import type { Metadata } from "next";
import { Belleza, Alegreya } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/auth-context";

const fontHeadline = Belleza({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-headline",
});

const fontBody = Alegreya({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "SaathiAI",
  description: "Your personal wellness companion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "font-body antialiased",
          fontHeadline.variable,
          fontBody.variable
        )}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
