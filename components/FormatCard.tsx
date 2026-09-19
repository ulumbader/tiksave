"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useCallback } from "react";

import { useFFmpeg } from "@/hooks/useFFmpeg";
import type { VideoData } from "@/types/video";

export type DownloadFormat = "video" | "mp3";

type FormatCardProps = {
  loading: boolean;
  videoData: VideoData | null;
  onClose: () => void;
};

const qualities = ["720p", "1080p", "Original"] as const;
type VideoQuality = (typeof qualities)[number];

// ─── Photo Carousel Sub-component ────────────────────────────────────────────

type PhotoCarouselProps = {
  images: string[];
  title: string;
};

function PhotoCarousel({ images, title }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set());

  const proxied = (url: string) =>
    `/api/image?url=${encodeURIComponent(url)}`;

  const goTo = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(images.length - 1, index)));
  };

  const currentSrc = proxied(images[currentIndex]);
  const isFailed = failedSrcs.has(currentSrc);

  return (
    <div className="relative select-none">
      {/* Foto utama */}
      <div className="relative overflow-hidden border-2 border-black bg-black shadow-[4px_4px_0_#000]">
        {!isFailed ? (
          <img
            key={currentSrc}
            src={currentSrc}
            alt={`${title} — foto ${currentIndex + 1}`}
            onError={() =>
              setFailedSrcs((prev) => new Set([...prev, currentSrc]))
            }
            className="aspect-[4/5] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/5] w-full items-center justify-center bg-[var(--bg)] px-4 text-center font-syne text-lg font-bold text-[var(--black)]">
            Foto tidak tersedia
          </div>
        )}

        {/* Counter badge */}
        <div className="absolute bottom-3 right-3 border-2 border-black bg-white px-2 py-1 text-xs font-black text-[var(--black)] shadow-[2px_2px_0_#000]">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Navigasi ← → */}
      {images.length > 1 && (
        <div className="absolute inset-y-0 flex w-full items-center justify-between px-2 pointer-events-none">
          <button
            type="button"
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            aria-label="Foto sebelumnya"
            className="pointer-events-auto flex h-10 w-10 items-center justify-center border-2 border-black bg-white text-lg font-black text-[var(--black)] shadow-[3px_3px_0_#000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goTo(currentIndex + 1)}
            disabled={currentIndex === images.length - 1}
            aria-label="Foto berikutnya"
            className="pointer-events-auto flex h-10 w-10 items-center justify-center border-2 border-black bg-white text-lg font-black text-[var(--black)] shadow-[3px_3px_0_#000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}

      {/* Label */}
      <div className="mt-3 border-2 border-black bg-[var(--bg)] px-3 py-2 text-center text-xs font-black uppercase tracking-[0.14em] text-[var(--black)]">
        TikSave
      </div>
    </div>
  );
}

// ─── Main FormatCard ──────────────────────────────────────────────────────────

export default function FormatCard({
  loading,
  videoData,
  onClose,
}: FormatCardProps) {
  const [failedVideoSrc, setFailedVideoSrc] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>("Original");
  const [failedThumbnailSrc, setFailedThumbnailSrc] = useState<string | null>(null);
  const [failedAvatarSrc, setFailedAvatarSrc] = useState<string | null>(null);
  // format state dikelola internal — tiap card independen
  const [format, setFormat] = useState<DownloadFormat>("video");
  // minimize state
  const [minimized, setMinimized] = useState(false);

  // Photo selection state (set of selected indices, 0-based)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(
    new Set([0])
  );
  const [downloadingPhotos, setDownloadingPhotos] = useState(false);

  const {
    convertToMp3,
    loading: mp3Loading,
    progress,
  } = useFFmpeg();

  const isPhotoPost = videoData?.type === "image";
  const images = videoData?.images ?? [];

  const accentClass = isPhotoPost
    ? "bg-pink text-white"
    : format === "video"
      ? "bg-lime text-[var(--black)]"
      : "bg-pink text-white";

  // Download MP4: pakai downloadUrl langsung (sudah tersedia dari preview) — tidak perlu fetch ulang API
  const primaryHref = videoData?.downloadUrl
    ? `/api/video?url=${encodeURIComponent(videoData.downloadUrl)}&download=1`
    : videoData?.sourceUrl
      ? `/api/video?sourceUrl=${encodeURIComponent(videoData.sourceUrl)}&download=1`
      : undefined;

  // Preview: pakai downloadUrl langsung
  const previewVideoSrc = videoData?.downloadUrl
    ? `/api/video?url=${encodeURIComponent(videoData.downloadUrl)}`
    : null;

  // MP3 conversion: pakai downloadUrl jika ada, fallback ke sourceUrl
  const conversionVideoSrc = videoData?.downloadUrl
    ? `/api/video?url=${encodeURIComponent(videoData.downloadUrl)}`
    : videoData?.sourceUrl
      ? `/api/video?sourceUrl=${encodeURIComponent(videoData.sourceUrl)}`
      : undefined;
  const thumbnailSrc = videoData?.thumbnail
    ? `/api/image?url=${encodeURIComponent(videoData.thumbnail)}`
    : null;
  const avatarSrc = videoData?.avatar
    ? `/api/image?url=${encodeURIComponent(videoData.avatar)}`
    : null;

  const handleMp3Download = () => {
    if (!conversionVideoSrc) return;
    void convertToMp3(conversionVideoSrc).catch((error) => {
      console.error(error);
    });
  };

  // Toggle pilihan foto (multi-select)
  const togglePhotoSelection = useCallback((index: number) => {
    setSelectedPhotos((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        // Jangan hapus jika hanya tinggal 1 yang dipilih
        if (next.size > 1) next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  // Download semua foto terpilih satu per satu
  const handleDownloadPhotos = useCallback(async () => {
    if (!images.length || downloadingPhotos) return;
    setDownloadingPhotos(true);
    const sortedIndices = [...selectedPhotos].sort((a, b) => a - b);
    for (const idx of sortedIndices) {
      const url = images[idx];
      if (!url) continue;
      const href = `/api/photo?url=${encodeURIComponent(url)}&index=${idx + 1}`;
      const a = document.createElement("a");
      a.href = href;
      a.download = `tiktok_photo_${idx + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Jeda kecil agar browser tidak blokir multi-download
      await new Promise((r) => setTimeout(r, 400));
    }
    setDownloadingPhotos(false);
  }, [images, selectedPhotos, downloadingPhotos]);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <article className="relative border-2 border-black bg-white shadow-[6px_6px_0_#000] overflow-hidden">
        {/* Mobile header bar */}
        <div className="flex items-center justify-between border-b-2 border-black px-4 py-3 lg:hidden animate-pulse">
          <div className="h-10 w-10 border-2 border-black bg-black/10" />
          <div className="h-6 w-20 border-2 border-black bg-black/10" />
          <div className="h-10 w-10 opacity-0" />
        </div>

        {/* Desktop close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close format card"
          className="absolute right-4 top-4 hidden lg:flex h-10 w-10 items-center justify-center border-2 border-black bg-[var(--bg)] text-xl font-black text-[var(--black)] shadow-[3px_3px_0_#000] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
          {"✕"}
        </button>

        <div className="grid gap-0 lg:gap-8 lg:grid-cols-[320px_1fr] lg:p-6">
          {/* Preview skeleton */}
          <div className="animate-pulse">
            <div className="lg:hidden aspect-video w-full bg-black/10 border-b-2 border-black" />
            <div className="hidden lg:block border-2 border-black bg-white p-3 shadow-[4px_4px_0_#000]">
              <div className="aspect-[4/5] w-full border-2 border-black bg-black/10" />
              <div className="mt-4 h-4 w-24 border-2 border-black bg-black/10" />
            </div>
          </div>

          {/* Info skeleton */}
          <div className="animate-pulse p-4 lg:p-0 lg:pt-3">
            <div className={`inline-flex h-8 w-28 border-2 border-black ${accentClass}`} />
            <div className="mt-4 h-7 w-full border-2 border-black bg-black/10" />
            <div className="mt-2 h-7 w-4/5 border-2 border-black bg-black/10" />

            <div className="mt-4 flex gap-3">
              <div className="h-12 w-12 rounded-full border-2 border-black bg-black/10" />
              <div className="flex flex-col gap-2 justify-center">
                <div className="h-4 w-24 border-2 border-black bg-black/10" />
                <div className="h-3 w-16 border-2 border-black bg-black/10" />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-9 w-20 border-2 border-black bg-black/10" />
              ))}
            </div>

            <div className="mt-5">
              <div className="h-4 w-28 border-2 border-black bg-black/10" />
              <div className="mt-3 flex gap-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-11 w-20 border-2 border-black bg-black/10" />
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <div className="h-14 w-full border-2 border-black bg-black/10" />
              <div className="h-14 w-full border-2 border-black bg-black/10" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (!videoData) return null;

  // ── Rendered ──────────────────────────────────────────────────────────────
  return (
    <article className="relative border-2 border-black bg-white shadow-[6px_6px_0_#000] overflow-hidden">

      {/* ── MOBILE HEADER BAR (only on mobile) ────────────────────── */}
      <div className="flex items-center justify-between border-b-2 border-black px-4 py-3 lg:hidden">
        {/* Tombol kiri: [X] [−] */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close format card"
            className="flex h-10 w-10 items-center justify-center border-2 border-black bg-[var(--bg)] text-xl font-black text-[var(--black)] shadow-[3px_3px_0_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={() => setMinimized((p) => !p)}
            aria-label={minimized ? "Expand card" : "Minimize card"}
            className="flex h-10 w-10 items-center justify-center border-2 border-black bg-[var(--bg)] text-xl font-black text-[var(--black)] shadow-[3px_3px_0_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <span
              className={`inline-block transition-transform duration-300 ${minimized ? "rotate-180" : ""}`}
              style={{ lineHeight: 1 }}
            >
              {minimized ? "＋" : "－"}
            </span>
          </button>
        </div>

        {/* TikSave title tengah */}
        <span className="border-2 border-black px-4 py-1.5 text-sm font-black uppercase tracking-[0.14em] text-[var(--black)]">
          {minimized && videoData ? (
            <span className="max-w-[140px] truncate inline-block align-middle text-xs">
              {videoData.title}
            </span>
          ) : "TikSave"}
        </span>

        {/* Spacer kanan biar center seimbang */}
        <div className="h-10 w-10 opacity-0 pointer-events-none" />
      </div>

      {/* ── DESKTOP HEADER BAR (only on desktop) ─────────────────── */}
      <div className="hidden lg:flex items-center justify-between border-b-2 border-black px-5 py-3">
        {/* Logo/label kiri */}
        <span className="border-2 border-black px-4 py-1.5 text-sm font-black uppercase tracking-[0.14em] text-[var(--black)]">
          {minimized && videoData ? (
            <span className="max-w-xs truncate inline-block align-middle text-xs">
              {videoData.title}
            </span>
          ) : "TikSave"}
        </span>

        {/* Tombol kanan: [－] [✕] */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMinimized((p) => !p)}
            aria-label={minimized ? "Expand card" : "Minimize card"}
            className="flex h-10 w-10 items-center justify-center border-2 border-black bg-[var(--bg)] text-xl font-black text-[var(--black)] shadow-[3px_3px_0_#000] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            <span
              className={`inline-block transition-transform duration-300 ${minimized ? "rotate-180" : ""}`}
              style={{ lineHeight: 1 }}
            >
              {minimized ? "＋" : "－"}
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close format card"
            className="flex h-10 w-10 items-center justify-center border-2 border-black bg-[var(--bg)] text-xl font-black text-[var(--black)] shadow-[3px_3px_0_#000] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            {"✕"}
          </button>
        </div>
      </div>

      {/* ── COLLAPSIBLE BODY — animasi smooth collapse/expand ─── */}
      <div
        className="transition-all duration-500 ease-in-out"
        style={{
          maxHeight: minimized ? "0px" : "9999px",
          opacity: minimized ? 0 : 1,
          overflow: "hidden",
          pointerEvents: minimized ? "none" : undefined,
        }}
      >

        {/* ── LAYOUT GRID: Mobile=stacked | Desktop=side-by-side ─── */}
        <div className="grid gap-0 lg:gap-8 lg:grid-cols-[320px_1fr] lg:p-6">

          {/* ── Kolom kiri / atas: preview ────────────────────────── */}
          <div className="relative">
            {isPhotoPost && images.length > 0 ? (
              // MODE FOTO: carousel
              <div className="p-4 lg:p-0">
                <PhotoCarousel images={images} title={videoData.title} />
              </div>
            ) : (
              // MODE VIDEO: satu elemen untuk mobile & desktop — wrapper responsif
              <div className="
              border-b-2 border-black bg-black
              lg:border-2 lg:bg-white lg:p-3 lg:shadow-[4px_4px_0_#000]
            ">
                {previewVideoSrc && failedVideoSrc !== previewVideoSrc ? (
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    poster={thumbnailSrc || undefined}
                    onError={() => setFailedVideoSrc(previewVideoSrc)}
                    className="w-full aspect-video bg-black object-contain lg:aspect-[4/5] lg:border-2 lg:border-black lg:object-cover"
                  >
                    <source src={previewVideoSrc} />
                    Your browser does not support the video tag.
                  </video>
                ) : thumbnailSrc && failedThumbnailSrc !== thumbnailSrc ? (
                  <img
                    src={thumbnailSrc}
                    alt={videoData.title}
                    onError={() => setFailedThumbnailSrc(thumbnailSrc)}
                    className="w-full aspect-video object-cover lg:aspect-[4/5] lg:border-2 lg:border-black"
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center bg-[var(--bg)] px-4 text-center font-syne text-xl font-bold text-[var(--black)] lg:aspect-[4/5] lg:border-2 lg:border-black">
                    No Preview
                  </div>
                )}
                {/* Label TikSave — hanya desktop */}
                <div className="hidden lg:block mt-4 border-2 border-black bg-[var(--bg)] px-3 py-2 text-center text-xs font-black uppercase tracking-[0.14em] text-[var(--black)]">
                  TikSave
                </div>
              </div>
            )}
          </div>

          {/* ── Kolom kanan / bawah: info & actions ──────────────── */}
          <div className="p-4 lg:p-0 lg:pt-3">
            {/* Badge status */}
            <span
              className={`inline-flex border-2 border-black px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] shadow-[3px_3px_0_#000] ${accentClass}`}
            >
              {isPhotoPost
                ? `📷 Photo (${images.length} foto)`
                : format === "video"
                  ? "Video Ready"
                  : "MP3 Ready"}
            </span>

            {/* Judul */}
            <h2 className="mt-3 font-syne text-2xl font-bold leading-tight text-[var(--black)] md:text-3xl lg:text-4xl">
              {videoData.title}
            </h2>

            {/* Creator */}
            <div className="mt-4 flex items-center gap-3">
              {avatarSrc && failedAvatarSrc !== avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={videoData.nickname}
                  onError={() => setFailedAvatarSrc(avatarSrc)}
                  className="h-12 w-12 rounded-full border-2 border-black object-cover shadow-[3px_3px_0_#000]"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-lime text-base font-black text-[var(--black)] shadow-[3px_3px_0_#000]">
                  {videoData.nickname.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-syne text-lg font-bold text-[var(--black)] leading-tight">
                  {videoData.nickname}
                </p>
                <p className="text-sm font-medium text-[var(--black)]/70">
                  {videoData.username}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-3 flex flex-wrap gap-2">
              {videoData.duration ? (
                <span className="border-2 border-black bg-white px-3 py-1.5 text-sm font-bold text-[var(--black)] shadow-[3px_3px_0_#000]">
                  {videoData.duration}
                </span>
              ) : null}
              {typeof videoData.views === "number" ? (
                <span className="border-2 border-black bg-[var(--bg)] px-3 py-1.5 text-sm font-bold text-[var(--black)] shadow-[3px_3px_0_#000]">
                  {videoData.views.toLocaleString()} views
                </span>
              ) : null}
              {typeof videoData.likes === "number" ? (
                <span className="border-2 border-black bg-[var(--bg)] px-3 py-1.5 text-sm font-bold text-[var(--black)] shadow-[3px_3px_0_#000]">
                  {videoData.likes.toLocaleString()} likes
                </span>
              ) : null}
            </div>

            {/* ── Foto mode: Choose Photo ─────────────────────────────── */}
            {isPhotoPost ? (
              <>
                <div className="mt-6">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--black)]">
                    Choose Photo
                    <span className="ml-2 font-medium normal-case text-[var(--black)]/60">
                      (pilih foto yang ingin didownload)
                    </span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {images.map((_, idx) => {
                      const isSelected = selectedPhotos.has(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => togglePhotoSelection(idx)}
                          aria-label={`Pilih foto ${idx + 1}`}
                          className={`h-11 w-11 border-2 border-black text-sm font-black shadow-[3px_3px_0_#000] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${isSelected
                              ? "bg-pink text-white"
                              : "bg-[var(--bg)] text-[var(--black)]"
                            }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-xs font-medium text-[var(--black)]/50">
                    {selectedPhotos.size} dari {images.length} foto dipilih
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void handleDownloadPhotos()}
                  disabled={downloadingPhotos}
                  className={`btn-brutal mt-6 flex w-full items-center justify-center gap-2 bg-pink px-6 py-4 text-lg font-black text-white ${downloadingPhotos ? "cursor-not-allowed opacity-70" : ""
                    }`}
                >
                  {downloadingPhotos ? (
                    <>⏳ Mengunduh foto...</>
                  ) : (
                    <>
                      {"⬇"} Download Photo
                      {selectedPhotos.size > 1
                        ? ` (${selectedPhotos.size} foto)`
                        : ""}
                    </>
                  )}
                </button>
              </>
            ) : (
              /* ── Video mode: Choose Quality + MP4 + MP3 ──────────── */
              <>
                <div className="mt-5">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--black)]">
                    Choose Quality
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {qualities.map((quality) => {
                      const isSelected = selectedQuality === quality;
                      return (
                        <button
                          key={quality}
                          type="button"
                          onClick={() => setSelectedQuality(quality)}
                          className={`border-2 border-black px-4 py-2.5 text-sm font-black uppercase tracking-[0.14em] shadow-[3px_3px_0_#000] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${isSelected
                              ? "bg-lime text-[var(--black)]"
                              : "bg-[var(--bg)] text-[var(--black)]"
                            }`}
                        >
                          {quality}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Download buttons: full-width stacked on mobile */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <a
                    href={primaryHref}
                    onClick={() => setFormat("video")}
                    className={`btn-brutal flex w-full items-center justify-center gap-2 bg-lime px-6 py-4 text-center text-base font-black text-[var(--black)] sm:flex-1 ${format === "video" ? "ring-4 ring-black" : ""
                      }`}
                  >
                    ↓ Download MP4
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setFormat("mp3");
                      handleMp3Download();
                    }}
                    disabled={mp3Loading}
                    className={`btn-brutal flex w-full items-center justify-center gap-2 bg-pink px-6 py-4 text-base font-black text-white sm:flex-1 ${mp3Loading ? "cursor-not-allowed opacity-80" : ""
                      } ${format === "mp3" ? "ring-4 ring-black" : ""}`}
                  >
                    {mp3Loading
                      ? `⚙️ Converting... ${progress}%`
                      : "🎵 Download MP3"}
                  </button>
                </div>

                {mp3Loading ? (
                  <div className="mt-4">
                    <div className="overflow-hidden border-2 border-black bg-white shadow-[4px_4px_0_#000]">
                      <div
                        className="h-4 bg-lime transition-[width] duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-sm font-black uppercase tracking-[0.14em] text-[var(--black)]">
                      Converting... {progress}%
                    </p>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>

        {/* ── end collapsible body ── */}
      </div>
    </article>
  );
}
