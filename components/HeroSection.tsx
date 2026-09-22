"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconDownload } from "@/components/icons";

type HeroSectionProps = {
  onDownload: (urls: string[]) => void | Promise<void>;
};

const badges = [
  { label: "Gratis", className: "lg:-left-2 lg:top-4 lg:-rotate-6" },
  { label: "Tanpa Watermark", className: "lg:right-8 lg:top-0 lg:rotate-4" },
  { label: "Kualitas HD", className: "lg:right-0 lg:bottom-24 lg:-rotate-3" },
];

const MAX_URLS = 5;

type UrlEntry = { id: string; value: string };

let nextUrlId = 1;
function makeUrlId() {
  return `url-${nextUrlId++}-${Date.now().toString(36)}`;
}

export default function HeroSection({
  onDownload,
}: HeroSectionProps) {
  const [urlEntries, setUrlEntries] = useState<UrlEntry[]>([
    { id: makeUrlId(), value: "" },
  ]);

  // Derived arrays for compatibility
  const urls = urlEntries.map((e) => e.value);
  const validCount = urls.filter((u) => u.trim().length > 0).length;

  const updateUrl = (index: number, value: string) => {
    setUrlEntries((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, value } : entry))
    );
  };

  const addUrl = useCallback(() => {
    if (urlEntries.length < MAX_URLS) {
      setUrlEntries((prev) => [...prev, { id: makeUrlId(), value: "" }]);
    }
  }, [urlEntries.length]);

  const removeUrl = useCallback(
    (index: number) => {
      if (urlEntries.length > 1) {
        setUrlEntries((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [urlEntries.length]
  );

  const handlePasteOrClear = useCallback(
    async (index: number) => {
      if (urlEntries[index]?.value.trim()) {
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
    [urlEntries]
  );

  const handleDownload = () => {
    const trimmed = urls.map((u) => u.trim()).filter(Boolean);
    if (trimmed.length === 0) return;
    void onDownload(trimmed);
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  // Tutup menu saat klik di luar header
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <section id="home" className="relative flex flex-1 flex-col pb-6 md:pb-8">
      {/* ── Background Video with Gradient Overlay ── */}
      <div className="absolute inset-y-0 left-1/2 z-0 w-[100vw] -translate-x-1/2 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay to blend into the solid background at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg)]/60 to-[var(--bg)]" />
      </div>

      <header ref={menuRef} className="relative z-10 mt-6 mx-4 md:mx-6 md:mt-8 border-2 border-black bg-white shadow-[6px_6px_0_#000]">

        {/* ── Navbar row ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-4 md:px-6 md:grid md:grid-cols-[1fr_auto_1fr]">

          {/* Logo */}
          <a
            href="#home"
            className="font-syne text-2xl font-black tracking-tight text-[var(--black)]"
          >
            SedotVidio
          </a>

          {/* Nav links — hidden on mobile, visible on md+ */}
          <nav className="hidden md:flex items-center justify-center gap-5 text-sm font-bold uppercase tracking-[0.14em] text-[var(--black)]">
            <a href="#home" className="transition-transform hover:-translate-y-0.5">
              Beranda
            </a>
            <a href="#how-it-works" className="transition-transform hover:-translate-y-0.5">
              Cara Kerja
            </a>
            <a href="#faq" className="transition-transform hover:-translate-y-0.5">
              FAQ
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3 md:justify-end">
            {/* Try Free — hidden on mobile */}
            <a
              href="#download-form"
              className="hidden md:inline-flex btn-brutal items-center justify-center bg-lime px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[var(--black)]"
            >
              Coba Gratis
            </a>

            {/* Hamburger button — only on mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              className="flex md:hidden h-10 w-10 flex-col items-center justify-center gap-1.5 border-2 border-black bg-[var(--bg)] shadow-[3px_3px_0_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              {/* Animated 3-bar icon */}
              <span
                className={`block h-0.5 w-5 bg-[var(--black)] transition-all duration-200 ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-[var(--black)] transition-all duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-[var(--black)] transition-all duration-200 ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown menu ──────────────────────────────────── */}
        <div
          className={`md:hidden overflow-hidden border-t-2 border-black transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col px-4 pb-4 pt-3 gap-1">
            <a
              href="#home"
              onClick={() => setMenuOpen(false)}
              className="block border-2 border-transparent px-3 py-3 text-sm font-black uppercase tracking-[0.14em] text-[var(--black)] transition-colors hover:border-black hover:bg-[var(--bg)]"
            >
              Beranda
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="block border-2 border-transparent px-3 py-3 text-sm font-black uppercase tracking-[0.14em] text-[var(--black)] transition-colors hover:border-black hover:bg-[var(--bg)]"
            >
              Cara Kerja
            </a>
            <a
              href="#faq"
              onClick={() => setMenuOpen(false)}
              className="block border-2 border-transparent px-3 py-3 text-sm font-black uppercase tracking-[0.14em] text-[var(--black)] transition-colors hover:border-black hover:bg-[var(--bg)]"
            >
              FAQ
            </a>
            <a
              href="#download-form"
              onClick={() => setMenuOpen(false)}
              className="btn-brutal mt-2 block bg-lime px-5 py-3 text-center text-sm font-black uppercase tracking-[0.14em] text-[var(--black)]"
            >
              Coba Gratis
            </a>
          </nav>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center py-14 md:py-20">
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
            Unduh Video TikTok &{" "}
            <span className="bg-lime px-1">MP3</span> Instan
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--black)] md:text-xl">
            Gratis, cepat, tanpa watermark. Tempel tautan TikTok di bawah.
          </p>

          {/* ── URL Input Rows ─────────────────────────────────────── */}
          <div id="download-form" className="mt-10 w-full max-w-4xl space-y-3">
            <AnimatePresence initial={false} mode="popLayout">
              {urlEntries.map((entry, index) => {
                const hasValue = entry.value.trim().length > 0;
                const isFirst = index === 0;
                const canRemove = urlEntries.length > 1;
                const canAdd = urlEntries.length < MAX_URLS;

                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, height: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, height: "auto", scale: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95, y: -10 }}
                    transition={{
                      layout: { type: "spring", stiffness: 500, damping: 35 },
                      opacity: { duration: 0.2 },
                      height: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                      scale: { duration: 0.2 },
                      y: { duration: 0.2 },
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="flex items-center gap-0 border-2 border-black bg-white shadow-[4px_4px_0_#000]">
                      {/* Row number badge (só aparece quando > 1 URL) */}
                      {urlEntries.length > 1 && (
                        <div className="flex h-full items-center border-r-2 border-black bg-[var(--bg)] px-3 py-4 text-xs font-black text-[var(--black)]">
                          {index + 1}
                        </div>
                      )}

                      {/* Input field */}
                      <input
                        type="url"
                        value={entry.value}
                        onChange={(e) => updateUrl(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleDownload();
                        }}
                        placeholder={
                          isFirst
                            ? "Tempel tautan TikTok di sini..."
                            : `Tautan TikTok ${index + 1}...`
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
                        {hasValue ? "Hapus" : "Tempel"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>


          {/* Download button */}
          <div className="mt-6 flex w-full max-w-4xl">
            <button
              type="button"
              onClick={handleDownload}
              disabled={validCount === 0}
              className="btn-brutal w-full bg-lime px-6 py-4 text-lg font-black text-[var(--black)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IconDownload className="inline h-5 w-5 mr-1 -mt-0.5" />{" "}
              {validCount > 1
                ? `Unduh ${validCount} URL`
                : "Unduh"}
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
