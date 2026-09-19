import { NextResponse } from "next/server";

import {
  TikTokDownloaderError,
  fetchTikTokVideoDetail,
} from "@/lib/tiktokdownloader-client";
import { TikTokUrlError, normalizeTikTokVideoUrl } from "@/lib/tiktok-url";
import type { VideoData } from "@/types/video";

type DownloadFormat = "video" | "mp3";

type DownloadRequestBody = {
  url: string;
  format: DownloadFormat;
};

function isValidBody(body: unknown): body is DownloadRequestBody {
  if (!body || typeof body !== "object") {
    return false;
  }

  const candidate = body as Record<string, unknown>;

  return (
    typeof candidate.url === "string" &&
    typeof candidate.format === "string" &&
    (candidate.format === "video" || candidate.format === "mp3")
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;

    if (!isValidBody(body)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body. Expected { url, format }.",
        },
        { status: 400 }
      );
    }

    // 1. Normalisasi URL TikTok (resolve short link, validasi host, dll.)
    const normalizedUrl = await normalizeTikTokVideoUrl(body.url);

    // 2. Fetch data raw dari TikTokDownloader API (source:true → struktur TikTok API asli)
    //    source:true memberikan akses ke author.avatarLarger, video.playAddr, music.playUrl, dll.
    const detail = await fetchTikTokVideoDetail(normalizedUrl, true);

    // 3. Ekstrak URL dari struktur raw TikTok API
    const video = detail.video as Record<string, unknown> | undefined;
    const music = detail.music as Record<string, unknown> | undefined;
    const author = detail.author as Record<string, unknown> | undefined;
    const stats = detail.stats as Record<string, unknown> | undefined;

    const videoUrl =
      (video?.playAddr as string | undefined) ||
      (video?.downloadAddr as string | undefined) ||
      "";
    const audioUrl = (music?.playUrl as string | undefined) ?? videoUrl;

    const downloadUrl = body.format === "mp3" ? audioUrl : videoUrl;

    if (!downloadUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Video tidak tersedia untuk diunduh. Coba lagi nanti.",
        },
        { status: 404 }
      );
    }

    // 4. Petakan ke format VideoData
    const durationSec = video?.duration as number | undefined;

    const normalized: VideoData = {
      sourceUrl: normalizedUrl,
      title: (detail.desc as string | undefined)?.trim() || "Untitled TikTok Video",
      thumbnail:
        (video?.cover as string | undefined) ||
        (video?.dynamicCover as string | undefined) ||
        "",
      duration: durationSec
        ? `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, "0")}`
        : "",
      username: author?.uniqueId ? `@${author.uniqueId as string}` : "@unknown",
      nickname: (author?.nickname as string | undefined) || "Unknown creator",
      avatar: (author?.avatarLarger as string | undefined) || (author?.avatarMedium as string | undefined) || "",
      downloadUrl: videoUrl,
      downloadMp3: audioUrl,
      views: stats?.playCount as number | undefined,
      likes: stats?.diggCount as number | undefined,
    };

    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON body.",
        },
        { status: 400 }
      );
    }

    if (error instanceof TikTokUrlError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof TikTokDownloaderError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          raw: error.payload,
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}

