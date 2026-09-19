"use client";

import { useState } from "react";

type HeroSectionProps = {
  errorMessage?: string | null;
  onDownload: (url: string) => void | Promise<void>;
};

const badges = [
  { label: "Free", className: "lg:-left-2 lg:top-4 lg:-rotate-6" },
  { label: "No Watermark", className: "lg:right-8 lg:top-0 lg:rotate-4" },
  { label: "HD Quality", className: "lg:right-0 lg:bottom-24 lg:-rotate-3" },
];

export default function HeroSection({
  errorMessage = null,
  onDownload,
}: HeroSectionProps) {
  const [inputValue, setInputValue] = useState("");
  const hasInputValue = inputValue.trim().length > 0;

  const handleInputAction = async () => {
    if (hasInputValue) {
      setInputValue("");
      return;
    }

    try {
      const pastedValue = await navigator.clipboard.readText();
      setInputValue(pastedValue);
    } catch {
      // Ignore clipboard errors and leave manual paste available.
    }
  };

  const handleDownload = () => {
    void onDownload(inputValue.trim());
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
            <a
              href="#how-it-works"
              className="transition-transform hover:-translate-y-0.5"
            >
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
            Download TikTok Videos & <span className="bg-lime px-1">MP3</span>{" "}
            Instantly
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--black)] md:text-xl">
            Free, fast, no watermark. Paste any TikTok link below.
          </p>

          <div
            id="download-form"
            className="mt-10 w-full max-w-4xl border-2 border-black bg-white p-2 shadow-[6px_6px_0_#000]"
          >
            <div className="relative">
              <input
                type="url"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Paste TikTok URL here..."
                className="h-16 w-full bg-transparent px-4 pr-28 text-base font-medium text-[var(--black)] outline-none placeholder:text-black/45 md:text-lg"
              />
              <button
                type="button"
                onClick={handleInputAction}
                className="absolute right-2 top-2 bottom-2 border-2 border-black bg-pink px-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[4px_4px_0_#000] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                {hasInputValue ? "Clear" : "Paste"}
              </button>
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-4 w-full max-w-4xl border-2 border-red-600 bg-white px-4 py-3 text-left text-sm font-bold text-red-700 shadow-[4px_4px_0_#b91c1c]">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-6 flex w-full max-w-4xl">
            <button
              type="button"
              onClick={handleDownload}
              className="btn-brutal w-full bg-lime px-6 py-4 text-lg font-black text-[var(--black)]"
            >
              {"\u2B07"} Download
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
