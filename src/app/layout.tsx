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
  title: "SaathiAI – Chat, Journal, Track Moods, Grow",
  description: "SaathiAI helps you journal your feelings, chat safely, track your moods, and grow your personal wellness tree.",
  keywords: ["SaathiAI", "mood tracker", "AI chat", "journal", "mental wellness", "hackathon project"],
  openGraph: {
    title: "SaathiAI – My AI Wellness Companion",
    description: "Journal, monitor moods, chat with AI, and explore resources to grow with SaathiAI.",
    url: "https://saathiai-web.web.app",
    images: [
      {
        url: "https://saathiai-web.web.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "SaathiAI dashboard showing a resilience tree and mood chart.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaathiAI – Wellness Journal + Mood Tracker",
    description: "SaathiAI empowers you to log moods, chat, and discover resources to grow.",
    images: ["https://saathiai-web.web.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "SaathiAI",
              url: "https://saathiai-web.web.app",
              applicationCategory: "Lifestyle",
              operatingSystem: "Web",
              description:
                "SaathiAI helps you chat, journal, and track moods while growing your personal wellness tree.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body
        className={cn(
          "font-body antialiased",
          fontHeadline.variable,
          fontBody.variable
        )}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
