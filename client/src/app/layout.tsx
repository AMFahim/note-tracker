import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { AppHeader } from "@/components/layout/app-header";
import { Providers } from "./providers";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: { default: "Note Tracker", template: "%s · Note Tracker" },
  description: "Private notes and public posts",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${sourceSerif.variable} ${plexMono.variable}`}
    >
      <body className="min-h-dvh" suppressHydrationWarning>
        <Providers>
          <AppHeader />
          <main className="mx-auto w-full max-w-[960px] px-4 py-8 md:px-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
