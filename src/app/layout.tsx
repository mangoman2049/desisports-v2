import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  metadataBase: new URL("https://desisports.milanchheda.com"),
  title: {
    default: "DesiSports V2 — Team DNA™ & Indoor Cricket Intelligence",
    template: "%s | DesiSports V2",
  },
  description:
    "More Than Scorecards. Player insights. Team chemistry. Smarter decisions. Built by players, for players.",
  keywords: [
    "DesiSports",
    "Indoor Cricket",
    "Spawtz",
    "Team DNA",
    "Cricket Intelligence",
    "Dubai Cricket",
    "Cricket Scorecards",
  ],
  authors: [{ name: "DesiSports Team" }],
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://desisports.milanchheda.com",
    siteName: "DesiSports V2",
    title: "Team DNAs — More Than Scorecards | DesiSports V2",
    description:
      "Player insights. Team chemistry. Smarter decisions. Built by players. For players.",
    images: [
      {
        url: "/images/team-dna-share.png",
        width: 1200,
        height: 675,
        alt: "DesiSports Team DNA™ — Player Insights & Team Chemistry",
      },
      {
        url: "/og-image.png",
        width: 1200,
        height: 675,
        alt: "DesiSports V2 Indoor Cricket Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Team DNAs — More Than Scorecards | DesiSports V2",
    description:
      "Player insights. Team chemistry. Smarter decisions. Built by players. For players.",
    images: ["/images/team-dna-share.png"],
  },
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
