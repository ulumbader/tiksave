import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sedotvidio.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SedotVidio - Unduh Video TikTok Tanpa Watermark & MP3 Gratis",
    template: "%s | SedotVidio",
  },
  description:
    "Pengunduh video TikTok gratis terbaik. Unduh video TikTok tanpa watermark dalam kualitas HD dan simpan audio MP3 dengan cepat, mudah, dan aman bersama SedotVidio. Tanpa instalasi, tanpa registrasi.",
  keywords: [
    "unduh tiktok",
    "download video tiktok",
    "download tiktok tanpa watermark",
    "download tiktok mp3",
    "tiktok tanpa watermark",
    "simpan video tiktok",
    "tt downloader",
    "unduh audio tiktok",
    "sedotvidio",
    "tiktok downloader gratis",
    "unduh video tiktok gratis",
    "save tiktok video",
    "tiktok mp3 converter",
    "download tiktok hd",
    "tiktok video saver",
    "unduh tiktok tanpa aplikasi",
    "download tiktok online",
  ],
  applicationName: "SedotVidio",
  authors: [{ name: "SedotVidio", url: siteUrl }],
  creator: "SedotVidio",
  publisher: "SedotVidio",
  category: "utility",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SedotVidio - Unduh Video TikTok Tanpa Watermark & MP3 Gratis",
    description:
      "Unduh video TikTok tanpa watermark dalam kualitas HD dan simpan audio MP3 dalam hitungan detik. Gratis, cepat, dan aman. Coba SedotVidio sekarang!",
    url: siteUrl,
    siteName: "SedotVidio",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "SedotVidio - Unduh Video TikTok Tanpa Watermark",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SedotVidio - Unduh Video TikTok Tanpa Watermark & MP3 Gratis",
    description:
      "Unduh video TikTok tanpa watermark dalam kualitas HD dan simpan audio MP3 dalam hitungan detik. Coba SedotVidio sekarang!",
    creator: "@sedotvidio",
    images: [`${siteUrl}/og-image.png`],
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
  other: {
    "theme-color": "#caff00",
    "color-scheme": "light",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "SedotVidio",
  },
  // Uncomment dan isi setelah mendaftar Google Search Console:
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_CODE",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
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