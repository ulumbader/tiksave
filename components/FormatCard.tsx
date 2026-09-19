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

  const primaryHref = videoData?.sourceUrl
    ? `/api/video?sourceUrl=${encodeURIComponent(videoData.sourceUrl)}&download=1`
    : undefined;
  const previewVideoSrc = videoData?.downloadUrl
    ? `/api/video?url=${encodeURIComponent(videoData.downloadUrl)}`
    : null;
  const conversionVideoSrc = videoData?.sourceUrl
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
      <article className="relative border-2 border-black bg-white p-5 shadow-[6px_6px_0_#000] md:p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close format card"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border-2 border-black bg-[var(--bg)] text-xl font-black text-[var(--black)] shadow-[3px_3px_0_#000] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
          {"✕"}
        </button>

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="relative animate-pulse">
            <div className="border-2 border-black bg-white p-3 shadow-[4px_4px_0_#000]">
              <div className="aspect-[4/5] w-full border-2 border-black bg-black/10" />
              <div className="mt-4 h-4 w-24 border-2 border-black bg-black/10" />
            </div>
          </div>

          <div className="animate-pulse pt-10 lg:pt-3">
            <div className={`inline-flex h-10 w-32 border-2 border-black ${accentClass}`} />
            <div className="mt-5 h-12 w-full max-w-2xl border-2 border-black bg-black/10" />
            <div className="mt-3 h-12 w-4/5 border-2 border-black bg-black/10" />

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="h-10 w-40 border-2 border-black bg-black/10" />
              <div className="h-10 w-28 border-2 border-black bg-black/10" />
            </div>

            <div className="mt-8">
              <div className="h-4 w-32 border-2 border-black bg-black/10" />
              <div className="mt-3 flex flex-wrap gap-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-12 w-12 border-2 border-black bg-black/10" />
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <div className="h-16 flex-1 border-2 border-black bg-black/10" />
              <div className="h-16 flex-1 border-2 border-black bg-black/10" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (!videoData) return null;

  // ── Rendered ──────────────────────────────────────────────────────────────
  return (
    <article className="relative border-2 border-black bg-white p-5 shadow-[6px_6px_0_#000] md:p-6">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close format card"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border-2 border-black bg-[var(--bg)] text-xl font-black text-[var(--black)] shadow-[3px_3px_0_#000] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
      >
        {"✕"}
      </button>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* ── Kolom kiri: preview ──────────────────────────────────── */}
        <div className="relative">
          {isPhotoPost && images.length > 0 ? (
            // MODE FOTO: carousel
            <PhotoCarousel images={images} title={videoData.title} />
          ) : (
            // MODE VIDEO: preview video / thumbnail
            <div className="border-2 border-black bg-white p-3 shadow-[4px_4px_0_#000]">
              {previewVideoSrc && failedVideoSrc !== previewVideoSrc ? (
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={thumbnailSrc || undefined}
                  onError={() => setFailedVideoSrc(previewVideoSrc)}
                  className="aspect-[4/5] w-full border-2 border-black bg-black object-cover"
                >
                  <source src={previewVideoSrc} />
                  Your browser does not support the video tag.
                </video>
              ) : thumbnailSrc && failedThumbnailSrc !== thumbnailSrc ? (
                <img
                  src={thumbnailSrc}
                  alt={videoData.title}
                  onError={() => setFailedThumbnailSrc(thumbnailSrc)}
                  className="aspect-[4/5] w-full border-2 border-black object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center border-2 border-black bg-[var(--bg)] px-4 text-center font-syne text-xl font-bold text-[var(--black)]">
                  No Preview
                </div>
              )}
              <div className="mt-4 border-2 border-black bg-[var(--bg)] px-3 py-2 text-center text-xs font-black uppercase tracking-[0.14em] text-[var(--black)]">
                TikSave
              </div>
            </div>
          )}
        </div>

        {/* ── Kolom kanan: info & actions ──────────────────────────── */}
        <div className="pt-10 lg:pt-3">
          {/* Badge status */}
          <span
            className={`inline-flex border-2 border-black px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[3px_3px_0_#000] ${accentClass}`}
          >
            {isPhotoPost
              ? `📷 Photo (${images.length} foto)`
              : format === "video"
              ? "Video Ready"
              : "MP3 Ready"}
          </span>

          {/* Judul */}
          <h2 className="mt-5 max-w-3xl font-syne text-3xl font-bold leading-tight text-[var(--black)] md:text-4xl">
            {videoData.title}
          </h2>

          {/* Creator */}
          <div className="mt-6 flex items-center gap-4">
            {avatarSrc && failedAvatarSrc !== avatarSrc ? (
              <img
                src={avatarSrc}
                alt={videoData.nickname}
                onError={() => setFailedAvatarSrc(avatarSrc)}
                className="h-14 w-14 rounded-full border-2 border-black object-cover shadow-[3px_3px_0_#000]"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-lime text-lg font-black text-[var(--black)] shadow-[3px_3px_0_#000]">
                {videoData.nickname.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-syne text-xl font-bold text-[var(--black)]">
                {videoData.nickname}
              </p>
              <p className="text-sm font-medium text-[var(--black)]/70">
                {videoData.username}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex flex-wrap gap-3">
            {videoData.duration ? (
              <span className="border-2 border-black bg-white px-3 py-2 text-sm font-bold text-[var(--black)] shadow-[3px_3px_0_#000]">
                {videoData.duration}
              </span>
            ) : null}
            {typeof videoData.views === "number" ? (
              <span className="border-2 border-black bg-[var(--bg)] px-3 py-2 text-sm font-bold text-[var(--black)] shadow-[3px_3px_0_#000]">
                {videoData.views.toLocaleString()} views
              </span>
            ) : null}
            {typeof videoData.likes === "number" ? (
              <span className="border-2 border-black bg-[var(--bg)] px-3 py-2 text-sm font-bold text-[var(--black)] shadow-[3px_3px_0_#000]">
                {videoData.likes.toLocaleString()} likes
              </span>
            ) : null}
          </div>

          {/* ── Foto mode: Choose Photo ─────────────────────────────── */}
          {isPhotoPost ? (
            <>
              <div className="mt-8">
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
                        className={`h-12 w-12 border-2 border-black text-sm font-black shadow-[3px_3px_0_#000] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${
                          isSelected
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
                className={`btn-brutal mt-10 flex w-full items-center justify-center gap-2 bg-pink px-6 py-4 text-lg font-black text-white ${
                  downloadingPhotos ? "cursor-not-allowed opacity-70" : ""
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
              <div className="mt-8">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--black)]">
                  Choose Quality
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {qualities.map((quality) => {
                    const isSelected = selectedQuality === quality;
                    return (
                      <button
                        key={quality}
                        type="button"
                        onClick={() => setSelectedQuality(quality)}
                        className={`border-2 border-black px-4 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-[3px_3px_0_#000] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${
                          isSelected
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

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href={primaryHref}
                  onClick={() => setFormat("video")}
                  className={`btn-brutal flex-1 flex items-center justify-center bg-lime px-6 py-4 text-center text-lg font-black text-[var(--black)] ${
                    format === "video" ? "ring-4 ring-black" : ""
                  }`}
                >
                  {"⬇"} Download MP4
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setFormat("mp3");
                    handleMp3Download();
                  }}
                  disabled={mp3Loading}
                  className={`btn-brutal flex-1 bg-pink px-6 py-4 text-lg font-black text-white ${
                    mp3Loading ? "cursor-not-allowed opacity-80" : ""
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
    </article>
  );
}
