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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sedotvidio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "SedotVidio - Unduh Video TikTok Tanpa Watermark & MP3 Gratis | TikTok Downloader",
    template: "%s | SedotVidio - TikTok Downloader Indonesia",
  },
  description:
    "Pengunduh video TikTok gratis terbaik di Indonesia. Unduh video TikTok tanpa watermark dalam kualitas HD, simpan audio MP3, dan download foto slideshow TikTok dengan cepat, mudah, dan aman bersama SedotVidio. Tanpa instalasi, tanpa registrasi, tanpa batas unduhan. Free TikTok video downloader without watermark — save TikTok videos in HD quality and extract MP3 audio instantly.",
  keywords: [
    // ── Indonesia Keywords ───────────────────────────────────
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
    "tiktok mp3 converter",
    "download tiktok hd",
    "unduh tiktok tanpa aplikasi",
    "download tiktok online",
    "cara download video tiktok",
    "cara simpan video tiktok tanpa watermark",
    "download video tiktok hd gratis",
    "download tiktok tanpa login",
    "unduh video tiktok tanpa watermark gratis",
    "convert tiktok ke mp3",
    "download slideshow tiktok",
    "download foto tiktok",
    "simpan audio tiktok mp3",
    "tiktok video downloader indonesia",
    "download tiktok 2024 2025 2026",
    "pengunduh tiktok terbaik",
    "sedot video tiktok",
    // ── English Keywords (international reach) ───────────────
    "tiktok downloader",
    "tiktok video downloader",
    "download tiktok without watermark",
    "tiktok to mp3",
    "save tiktok video",
    "tiktok video saver",
    "tiktok mp3 download",
    "tiktok downloader online free",
    "tiktok hd download",
    "tiktok no watermark",
    "save tiktok without watermark",
    "free tiktok downloader",
    "tiktok audio extractor",
    "tiktok slideshow download",
    "snaptik alternative",
    "ssstik alternative",
    "musicaldown alternative",
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
    languages: {
      "id-ID": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "SedotVidio - Unduh Video TikTok Tanpa Watermark & MP3 Gratis",
    description:
      "Unduh video TikTok tanpa watermark dalam kualitas HD dan simpan audio MP3 dalam hitungan detik. Gratis, cepat, dan aman. 100% online, tanpa instalasi. Coba SedotVidio sekarang!",
    url: siteUrl,
    siteName: "SedotVidio",
    locale: "id_ID",
    type: "website",
    countryName: "Indonesia",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "SedotVidio - Pengunduh Video TikTok Tanpa Watermark & MP3 Gratis",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "SedotVidio - Unduh Video TikTok Tanpa Watermark & MP3 Gratis",
    description:
      "Unduh video TikTok tanpa watermark dalam kualitas HD dan simpan audio MP3 dalam hitungan detik. 100% gratis, tanpa instalasi!",
    site: "@sedotvidio",
    creator: "@sedotvidio",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "SedotVidio - TikTok Downloader",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
      noimageindex: false,
    },
  },
  // Uncomment setelah mendaftar Google Search Console & Bing Webmaster:
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_CODE",
  //   yandex: "YOUR_YANDEX_VERIFICATION_CODE",
  //   other: {
  //     "msvalidate.01": "YOUR_BING_VERIFICATION_CODE",
  //   },
  // },
  other: {
    "theme-color": "#caff00",
    "color-scheme": "light",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "SedotVidio",
    // SEO crawl hints
    "revisit-after": "1 days",
    distribution: "global",
    rating: "general",
    "geo.region": "ID",
    "geo.placename": "Indonesia",
    "content-language": "id, en",
  },
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