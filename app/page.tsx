"use client";

import { useEffect, useRef, useState } from "react";

import ErrorPopup from "@/components/ErrorPopup";
import Footer from "@/components/Footer";
import FormatCard from "@/components/FormatCard";
import FAQSection from "@/components/FAQSection";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
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
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const [popupErrorMessage, setPopupErrorMessage] = useState<string | null>(null);
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
      setResults((prev) =>
        prev.map((r) =>
          r.id === result.id
            ? {
                ...r,
                loading: false,
                error:
                  error instanceof Error ? error.message : "Gagal mengambil data.",
              }
            : r
        )
      );
    }
  };

  const handleDownload = async (urls: string[]) => {
    if (urls.length === 0) {
      setFormErrorMessage("Please paste a TikTok URL first.");
      return;
    }

    setFormErrorMessage(null);
    setPopupErrorMessage(null);

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

  return (
    <main className="flex flex-1 flex-col gap-8 pb-16">
      <HeroSection
        errorMessage={formErrorMessage}
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

              {/* Error state per-URL */}
              {result.error ? (
                <div className="relative border-2 border-red-600 bg-white p-5 shadow-[6px_6px_0_#b91c1c]">
                  <button
                    type="button"
                    onClick={() => removeResult(result.id)}
                    aria-label="Tutup"
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border-2 border-black bg-[var(--bg)] text-xl font-black shadow-[3px_3px_0_#000] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                  >
                    ✕
                  </button>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-red-700">
                    Gagal
                  </p>
                  <p className="mt-1 text-sm font-medium text-red-700">
                    {result.error}
                  </p>
                  <p className="mt-1 truncate text-xs text-red-500">{result.url}</p>
                </div>
              ) : (
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

      {popupErrorMessage ? (
        <ErrorPopup
          message={popupErrorMessage}
          onClose={() => setPopupErrorMessage(null)}
        />
      ) : null}
    </main>
  );
}
