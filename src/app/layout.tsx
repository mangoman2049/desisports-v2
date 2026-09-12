import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "DesiSports V2 — Indoor Cricket Analytics & Scorecard Intake",
  description: "Next-generation indoor cricket tracking, ball-by-ball OCR maker-checker, and captain intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        <Navigation />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
