"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

import { useFFmpeg } from "@/hooks/useFFmpeg";
import type { VideoData } from "@/types/video";

export type DownloadFormat = "video" | "mp3";

type FormatCardProps = {
  loading: boolean;
  videoData: VideoData | null;
  format: DownloadFormat;
  onFormatChange: (format: DownloadFormat) => void;
  onClose: () => void;
};

const qualities = ["720p", "1080p", "Original"] as const;
type VideoQuality = (typeof qualities)[number];

export default function FormatCard({
  loading,
  videoData,
  format,
  onFormatChange,
  onClose,
}: FormatCardProps) {
  const [failedVideoSrc, setFailedVideoSrc] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>("Original");
  const [failedThumbnailSrc, setFailedThumbnailSrc] = useState<string | null>(null);
  const [failedAvatarSrc, setFailedAvatarSrc] = useState<string | null>(null);
  const {
    convertToMp3,
    loading: mp3Loading,
    progress,
  } = useFFmpeg();

  const accentClass =
    format === "video" ? "bg-lime text-[var(--black)]" : "bg-pink text-white";
  const primaryHref =
    videoData?.sourceUrl
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
    if (!conversionVideoSrc) {
      return;
    }

    void convertToMp3(conversionVideoSrc).catch((error) => {
      console.error(error);
    });
  };

  if (loading) {
    return (
      <article className="relative border-2 border-black bg-white p-5 shadow-[6px_6px_0_#000] md:p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close format card"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border-2 border-black bg-[var(--bg)] text-xl font-black text-[var(--black)] shadow-[3px_3px_0_#000] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
          {"\u2715"}
        </button>

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="relative animate-pulse">
            <div className="absolute inset-x-4 bottom-0 top-4 border-2 border-black bg-pink" />
            <div className="relative border-2 border-black bg-lime p-3">
              <div className="border-2 border-black bg-white p-3 shadow-[4px_4px_0_#000]">
                <div className="aspect-[4/5] w-full border-2 border-black bg-black/10" />
                <div className="mt-4 h-4 w-24 border-2 border-black bg-black/10" />
              </div>
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
                {qualities.map((quality) => (
                  <div
                    key={quality}
                    className="h-12 w-28 border-2 border-black bg-black/10"
                  />
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

  if (!videoData) {
    return null;
  }

  return (
    <article className="relative border-2 border-black bg-white p-5 shadow-[6px_6px_0_#000] md:p-6">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close format card"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border-2 border-black bg-[var(--bg)] text-xl font-black text-[var(--black)] shadow-[3px_3px_0_#000] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
      >
        {"\u2715"}
      </button>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="relative">
          <div className="absolute inset-x-4 bottom-0 top-4 border-2 border-black bg-pink" />
          <div className="relative border-2 border-black bg-lime p-3">
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
          </div>
        </div>

        <div className="pt-10 lg:pt-3">
          <span
            className={`inline-flex border-2 border-black px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[3px_3px_0_#000] ${accentClass}`}
          >
            {format === "video" ? "Video Ready" : "MP3 Ready"}
          </span>

          <h2 className="mt-5 max-w-3xl font-syne text-3xl font-bold leading-tight text-[var(--black)] md:text-4xl">
            {videoData.title}
          </h2>

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
              onClick={() => onFormatChange("video")}
              className={`btn-brutal flex-1 flex items-center justify-center bg-lime px-6 py-4 text-center text-lg font-black text-[var(--black)] ${
                format === "video" ? "ring-4 ring-black" : ""
              }`}
            >
              {"\u2B07"} Download MP4
            </a>

            <button
              type="button"
              onClick={() => {
                onFormatChange("mp3");
                handleMp3Download();
              }}
              disabled={mp3Loading}
              className={`btn-brutal flex-1 bg-pink px-6 py-4 text-lg font-black text-white ${
                mp3Loading ? "cursor-not-allowed opacity-80" : ""
              } ${format === "mp3" ? "ring-4 ring-black" : ""}`}
            >
              {mp3Loading
                ? `\u2699\uFE0F Converting... ${progress}%`
                : "\uD83C\uDFB5 Download MP3"}
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
        </div>
      </div>
    </article>
  );
}
