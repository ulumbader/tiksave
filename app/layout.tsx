import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "TikSave - Download TT Video & MP3",
  description:
    "Free TikTok video downloader. Download TikTok videos without watermark and save MP3 audio fast, easily, and securely with TikSave.",
  keywords: [
    "tiktok downloader",
    "tiktok video downloader",
    "download tiktok mp3",
    "tiktok no watermark",
    "save tiktok video",
    "tt downloader",
    "tiktok audio download",
    "tiksave",
  ],
  authors: [{ name: "TikSave" }],
  creator: "TikSave",
  publisher: "TikSave",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "TikSave - Fast TikTok Video & Audio Downloader",
    description:
      "Download TikTok videos without watermark and save MP3 audio in seconds. Try TikSave now!",
    url: "/",
    siteName: "TikSave",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TikSave - Fast TikTok Video & Audio Downloader",
    description:
      "Download TikTok videos without watermark and save MP3 audio in seconds. Try TikSave now!",
    creator: "@tiksave",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen antialiased">
        <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 sm:px-6 lg:px-8">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}