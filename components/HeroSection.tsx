"use client";

import { useState, useCallback } from "react";

type HeroSectionProps = {
  errorMessage?: string | null;
  onDownload: (urls: string[]) => void | Promise<void>;
};

const badges = [
  { label: "Free", className: "lg:-left-2 lg:top-4 lg:-rotate-6" },
  { label: "No Watermark", className: "lg:right-8 lg:top-0 lg:rotate-4" },
  { label: "HD Quality", className: "lg:right-0 lg:bottom-24 lg:-rotate-3" },
];

const MAX_URLS = 5;

export default function HeroSection({
  errorMessage = null,
  onDownload,
}: HeroSectionProps) {
  const [urls, setUrls] = useState<string[]>([""]);

  const validCount = urls.filter((u) => u.trim().length > 0).length;

  const updateUrl = (index: number, value: string) => {
    setUrls((prev) => prev.map((u, i) => (i === index ? value : u)));
  };

  const addUrl = useCallback(() => {
    if (urls.length < MAX_URLS) {
      setUrls((prev) => [...prev, ""]);
    }
  }, [urls.length]);

  const removeUrl = useCallback(
    (index: number) => {
      if (urls.length > 1) {
        setUrls((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [urls.length]
  );

  const handlePasteOrClear = useCallback(
    async (index: number) => {
      if (urls[index].trim()) {
        updateUrl(index, "");
        return;
      }
      try {
        const text = await navigator.clipboard.readText();
        updateUrl(index, text);
      } catch {
        // Ignore clipboard errors — user can still type manually.
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [urls]
  );

  const handleDownload = () => {
    const trimmed = urls.map((u) => u.trim()).filter(Boolean);
    if (trimmed.length === 0) return;
    void onDownload(trimmed);
  };

  return (
    <section id="home" className="flex flex-1 flex-col py-6 md:py-8">
      <header className="border-2 border-black bg-white px-4 py-4 shadow-[6px_6px_0_#000] md:px-6">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
          <a
            href="#home"
            className="font-syne text-2xl font-black tracking-tight text-[var(--black)]"
          >
            TikSave
          </a>

          <nav className="flex flex-wrap items-center justify-center gap-5 text-sm font-bold uppercase tracking-[0.14em] text-[var(--black)]">
            <a href="#home" className="transition-transform hover:-translate-y-0.5">
              Home
            </a>
            <a href="#how-it-works" className="transition-transform hover:-translate-y-0.5">
              How It Works
            </a>
            <a href="#faq" className="transition-transform hover:-translate-y-0.5">
              FAQ
            </a>
          </nav>

          <div className="flex justify-start md:justify-end">
            <a
              href="#download-form"
              className="btn-brutal inline-flex items-center justify-center bg-lime px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[var(--black)]"
            >
              Try Free
            </a>
          </div>
        </div>
      </header>

      <div className="relative flex flex-1 items-center justify-center py-14 md:py-20">
        <div className="relative flex w-full max-w-6xl flex-col items-center text-center">
          {/* Floating badges */}
          <div className="mb-6 flex flex-wrap justify-center gap-3 lg:mb-0">
            {badges.map((badge) => (
              <span
                key={badge.label}
                className={`border-2 border-black bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-[var(--black)] shadow-[3px_3px_0_#000] lg:absolute ${badge.className}`}
              >
                {badge.label}
              </span>
            ))}
          </div>

          <h1 className="max-w-5xl font-syne text-5xl font-black leading-[0.92] tracking-[-0.04em] text-[var(--black)] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            Download TikTok Videos &{" "}
            <span className="bg-lime px-1">MP3</span> Instantly
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--black)] md:text-xl">
            Free, fast, no watermark. Paste any TikTok link below.
          </p>

          {/* ── URL Input Rows ─────────────────────────────────────── */}
          <div id="download-form" className="mt-10 w-full max-w-4xl space-y-3">
            {urls.map((url, index) => {
              const hasValue = url.trim().length > 0;
              const isFirst = index === 0;
              const canRemove = urls.length > 1;
              const canAdd = urls.length < MAX_URLS;

              return (
                <div
                  key={index}
                  className="flex items-center gap-0 border-2 border-black bg-white shadow-[4px_4px_0_#000]"
                >
                  {/* Row number badge (só aparece quando > 1 URL) */}
                  {urls.length > 1 && (
                    <div className="flex h-full items-center border-r-2 border-black bg-[var(--bg)] px-3 py-4 text-xs font-black text-[var(--black)]">
                      {index + 1}
                    </div>
                  )}

                  {/* Input field */}
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleDownload();
                    }}
                    placeholder={
                      isFirst
                        ? "Paste TikTok URL here..."
                        : `TikTok URL ${index + 1}...`
                    }
                    className="h-16 min-w-0 flex-1 bg-transparent px-4 text-base font-medium text-[var(--black)] outline-none placeholder:text-black/40 md:text-lg"
                  />

                  {/* [−] Remove button — hanya tampil jika bisa remove */}
                  {canRemove && (
                    <button
                      type="button"
                      onClick={() => removeUrl(index)}
                      aria-label={`Hapus URL ${index + 1}`}
                      className="flex h-full items-center border-l-2 border-black px-3 py-4 text-sm font-black text-[var(--black)] transition-colors hover:bg-black/5"
                      title="Hapus field ini"
                    >
                      −
                    </button>
                  )}

                  {/* [+] Add new URL — sebelum Paste */}
                  <button
                    type="button"
                    onClick={addUrl}
                    disabled={!canAdd}
                    aria-label="Tambah URL baru"
                    className="flex h-full items-center border-l-2 border-black px-3 py-4 text-sm font-black text-[var(--black)] transition-colors hover:bg-lime/60 disabled:cursor-not-allowed disabled:opacity-30"
                    title={canAdd ? "Tambah URL baru" : `Maksimal ${MAX_URLS} URL`}
                  >
                    +
                  </button>

                  {/* [Paste / Clear] */}
                  <button
                    type="button"
                    onClick={() => void handlePasteOrClear(index)}
                    className="m-2 border-2 border-black bg-pink px-4 py-2 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[3px_3px_0_#000] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                  >
                    {hasValue ? "Clear" : "Paste"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Error message */}
          {errorMessage ? (
            <div className="mt-4 w-full max-w-4xl border-2 border-red-600 bg-white px-4 py-3 text-left text-sm font-bold text-red-700 shadow-[4px_4px_0_#b91c1c]">
              {errorMessage}
            </div>
          ) : null}

          {/* Download button */}
          <div className="mt-6 flex w-full max-w-4xl">
            <button
              type="button"
              onClick={handleDownload}
              disabled={validCount === 0}
              className="btn-brutal w-full bg-lime px-6 py-4 text-lg font-black text-[var(--black)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {"⬇"}{" "}
              {validCount > 1
                ? `Download ${validCount} URL`
                : "Download"}
            </button>
          </div>

          {/* Hint max URLs */}
          {urls.length >= MAX_URLS && (
            <p className="mt-2 text-xs font-medium text-[var(--black)]/50">
              Maksimal {MAX_URLS} URL sekaligus
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
