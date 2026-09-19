"use client";

import { useEffect, useRef, useState } from "react";

import ErrorPopup from "@/components/ErrorPopup";
import Footer from "@/components/Footer";
import FormatCard, { type DownloadFormat } from "@/components/FormatCard";
import FAQSection from "@/components/FAQSection";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import type { VideoData } from "@/types/video";

type DownloadApiResponse =
  | {
      success: true;
      data: VideoData;
    }
  | {
      success: false;
      error: string;
    };

export default function Home() {
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [popupErrorMessage, setPopupErrorMessage] = useState<string | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>("video");
  const resultSectionRef = useRef<HTMLElement | null>(null);
  const formatCardKey = loading
    ? "loading-card"
    : `${videoData?.downloadUrl ?? "empty"}:${videoData?.thumbnail ?? "no-thumbnail"}:${videoData?.avatar ?? "no-avatar"}`;

  useEffect(() => {
    if (!showCard || !loading) {
      return;
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      resultSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [loading, showCard]);

  const handleDownload = async (url: string) => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setPopupErrorMessage(null);
      setFormErrorMessage("Please paste a TikTok URL first.");
      return;
    }

    setFormErrorMessage(null);
    setPopupErrorMessage(null);
    setLoading(true);
    setShowCard(true);
    setVideoData(null);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: trimmedUrl,
          format: "video",
        }),
      });

      const payload = (await response.json()) as DownloadApiResponse;

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.success ? `Download lookup failed: ${response.status}` : payload.error
        );
      }

      setVideoData(payload.data);
      setShowCard(true);
    } catch (error) {
      setShowCard(false);
      setPopupErrorMessage(
        error instanceof Error ? error.message : "Failed to fetch video info"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFormatChange = (format: "video" | "mp3") => {
    setSelectedFormat(format);
  };

  return (
    <main className="flex flex-1 flex-col gap-8 pb-16">
      <HeroSection
        errorMessage={formErrorMessage}
        onDownload={handleDownload}
      />

      {showCard ? (
        <section ref={resultSectionRef} className="mx-auto w-full max-w-6xl">
          <FormatCard
            key={formatCardKey}
            loading={loading}
            videoData={videoData}
            format={selectedFormat}
            onFormatChange={handleFormatChange}
            onClose={() => {
              setLoading(false);
              setShowCard(false);
              setVideoData(null);
            }}
          />
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
