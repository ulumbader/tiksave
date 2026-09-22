"use client";

import { useEffect, useRef, useState } from "react";

import Footer from "@/components/Footer";
import FormatCard from "@/components/FormatCard";
import FAQSection from "@/components/FAQSection";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import NotificationModal from "@/components/NotificationModal";
import type { NotificationType } from "@/components/NotificationModal";
import type { VideoData } from "@/types/video";

// ── Types ─────────────────────────────────────────────────────────────────────

type DownloadApiResponse =
  | { success: true; data: VideoData }
  | { success: false; error: string };

type DownloadResult = {
  /** ID unik per request */
  id: string;
  /** URL asli yang dimasukkan user */
  url: string;
  loading: boolean;
  videoData: VideoData | null;
  error: string | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [notification, setNotification] = useState<{
    open: boolean;
    type: NotificationType;
    title: string;
    message: string;
    hint?: string;
  }>({ open: false, type: "error", title: "", message: "" });
  const [results, setResults] = useState<DownloadResult[]>([]);

  const resultSectionRef = useRef<HTMLElement | null>(null);

  // Scroll ke hasil saat pertama kali muncul
  useEffect(() => {
    if (results.length === 0) return;
    const animId = window.requestAnimationFrame(() => {
      resultSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(animId);
  }, [results.length]);

  const fetchSingle = async (result: DownloadResult) => {
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: result.url }),
      });

      const payload = (await response.json()) as DownloadApiResponse;

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.success
            ? `Error ${response.status}`
            : payload.error
        );
      }

      setResults((prev) =>
        prev.map((r) =>
          r.id === result.id
            ? { ...r, loading: false, videoData: payload.data }
            : r
        )
      );
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Gagal mengambil data.";

      setResults((prev) =>
        prev.map((r) =>
          r.id === result.id
            ? {
              ...r,
              loading: false,
              error: errorMsg,
            }
            : r
        )
      );

      // Show user-friendly notification popup
      setNotification({
        open: true,
        type: "error",
        title: "Unduhan Gagal",
        message: `Kami tidak dapat mengunduh video dari tautan ini. ${errorMsg}`,
        hint: "Pastikan tautan TikTok valid dan coba lagi. Jika masalah berlanjut, tautan mungkin bersifat privat.",
      });
    }
  };

  const handleDownload = async (urls: string[]) => {
    if (urls.length === 0) {
      setNotification({
        open: true,
        type: "warning",
        title: "Tautan Kosong",
        message: "Silakan tempel tautan TikTok terlebih dahulu sebelum mengunduh.",
        hint: "Salin tautan dari aplikasi TikTok lalu tempel di kolom input.",
      });
      return;
    }

    setNotification((prev) => ({ ...prev, open: false }));

    // Buat hasil loading untuk semua URL sekaligus
    const newResults: DownloadResult[] = urls.map((url) => ({
      id: makeId(),
      url,
      loading: true,
      videoData: null,
      error: null,
    }));

    setResults(newResults);

    // Proses semua URL secara paralel
    await Promise.all(newResults.map((r) => fetchSingle(r)));
  };

  const removeResult = (id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sedotvidio.vercel.app";

  const jsonLdWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SedotVidio",
    alternateName: ["Sedot Vidio", "SedotVideo", "TikTok Downloader SedotVidio"],
    url: siteUrl,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    inLanguage: ["id", "en"],
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0.0",
    datePublished: "2026-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
    },
    description:
      "Pengunduh video TikTok gratis terbaik di Indonesia. Unduh video TikTok tanpa watermark dalam kualitas HD dan simpan audio MP3 dengan cepat, mudah, dan aman bersama SedotVidio. Free TikTok video downloader without watermark.",
    featureList: [
      "Unduh video TikTok tanpa watermark dalam kualitas HD",
      "Unduh dan ekstrak audio TikTok ke format MP3",
      "Unduh foto dan slideshow TikTok",
      "Cepat, aman, dan privasi terjaga",
      "100% gratis tanpa registrasi atau login",
      "Mendukung unduhan massal hingga 5 URL sekaligus",
      "Responsif — berfungsi di HP, tablet, dan desktop",
      "Tidak perlu instal aplikasi apapun",
    ],
    screenshot: `${siteUrl}/og-image.png`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "2580",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SedotVidio",
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    description:
      "SedotVidio adalah layanan pengunduh video TikTok tanpa watermark dan konverter audio MP3 gratis terbaik di Indonesia.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["Indonesian", "English"],
    },
  };

  // WebSite schema — enables sitelinks search box in Google
  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SedotVidio",
    alternateName: "Sedot Vidio",
    url: siteUrl,
    inLanguage: "id",
    description:
      "Pengunduh video TikTok gratis tanpa watermark. Download video TikTok HD dan MP3 audio secara instan.",
    publisher: {
      "@type": "Organization",
      name: "SedotVidio",
      url: siteUrl,
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: siteUrl,
      },
    ],
  };

  return (
    <main className="flex flex-1 flex-col gap-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <HeroSection
        onDownload={handleDownload}
      />

      {results.length > 0 ? (
        <section ref={resultSectionRef} className="mx-auto w-full max-w-6xl space-y-6 px-4">
          {/* Header jumlah hasil */}
          {results.length > 1 && (
            <div className="flex items-center gap-3">
              <span className="border-2 border-black bg-lime px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[3px_3px_0_#000]">
                {results.length} URL diproses
              </span>
              <button
                type="button"
                onClick={() => setResults([])}
                className="border-2 border-black bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[3px_3px_0_#000] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              >
                Tutup Semua
              </button>
            </div>
          )}

          {/* Satu FormatCard per URL */}
          {results.map((result, index) => (
            <div key={result.id}>
              {/* Label URL index (hanya saat lebih dari 1) */}
              {results.length > 1 && (
                <div className="mb-2 flex items-center gap-2">
                  <span className="border-2 border-black bg-[var(--bg)] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] shadow-[2px_2px_0_#000]">
                    #{index + 1}
                  </span>
                  <span className="max-w-xs truncate text-xs font-medium text-[var(--black)]/60">
                    {result.url}
                  </span>
                </div>
              )}

              {/* Only show FormatCard for non-errored results */}
              {!result.error && (
                <FormatCard
                  key={result.id}
                  loading={result.loading}
                  videoData={result.videoData}
                  onClose={() => removeResult(result.id)}
                />
              )}
            </div>
          ))}
        </section>
      ) : null}

      <HowItWorks />
      <FAQSection />
      <Footer />

      <NotificationModal
        open={notification.open}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        hint={notification.hint}
      />
    </main>
  );
}
