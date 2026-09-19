import { NextResponse } from "next/server";

import {
  TikTokDownloaderError,
  fetchTikTokVideoDetail,
} from "@/lib/tiktokdownloader-client";
import { TikTokUrlError, normalizeTikTokVideoUrl } from "@/lib/tiktok-url";
import type { VideoData } from "@/types/video";

type DownloadRequestBody = {
  url: string;
};

function isValidBody(body: unknown): body is DownloadRequestBody {
  if (!body || typeof body !== "object") {
    return false;
  }

  const candidate = body as Record<string, unknown>;

  return typeof candidate.url === "string";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;

    if (!isValidBody(body)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body. Expected { url }.",
        },
        { status: 400 }
      );
    }

    // 1. Normalisasi URL TikTok (resolve short link, validasi host, dll.)
    //    Sekarang mendukung /video/ dan /photo/
    const normalizedUrl = await normalizeTikTokVideoUrl(body.url);

    // 2. Fetch data raw dari TikTokDownloader API (source:true → struktur TikTok API asli)
    const detail = await fetchTikTokVideoDetail(normalizedUrl, true);

    // 3. Ekstrak struktur raw TikTok API
    const video = detail.video as Record<string, unknown> | undefined;
    const music = detail.music as Record<string, unknown> | undefined;
    const author = detail.author as Record<string, unknown> | undefined;
    const stats = detail.stats as Record<string, unknown> | undefined;

    // 4. Deteksi apakah post foto atau video
    //
    //    Dari inspeksi response aktual TikTokDownloader:
    //    - Field foto ada di: data.imagePost.images[].imageURL.urlList[0]
    //    - Cover foto ada di: data.video.cover ATAU data.imagePost.cover.imageURL.urlList[0]
    //    - Format parsed (source:false): detail.images = string[]

    // Format a — parsed (source:false)
    let resolvedImages: string[] = [];
    if (Array.isArray(detail.images) && detail.images.length > 0) {
      resolvedImages = detail.images as string[];
    }

    // Format b — raw TikTok API (source:true): field adalah "imagePost" (camelCase)
    if (resolvedImages.length === 0) {
      type RawImageItem = {
        imageURL?: { urlList?: string[] };
        display_image?: { url_list?: string[] };
        url?: string;
      };
      type ImagePost = {
        images?: RawImageItem[];
        cover?: { imageURL?: { urlList?: string[] } };
      };

      // Coba "imagePost" (camelCase — dari TikTok API raw)
      const imagePost = (detail.imagePost ?? detail.image_post_info) as ImagePost | undefined;
      const rawList = imagePost?.images ?? [];
      resolvedImages = rawList
        .map(
          (img) =>
            img.imageURL?.urlList?.[0] ??
            img.display_image?.url_list?.[0] ??
            img.url ??
            ""
        )
        .filter(Boolean);
    }

    const isPhotoPost = resolvedImages.length > 0;

    // Log untuk debugging
    console.log("[download] isPhotoPost:", isPhotoPost, "| images count:", resolvedImages.length);

    const videoUrl =
      (video?.playAddr as string | undefined) ||
      (video?.downloadAddr as string | undefined) ||
      "";
    const audioUrl = (music?.playUrl as string | undefined) ?? videoUrl;

    // Thumbnail: coba dari video.cover, lalu field top-level, lalu fallback ke foto pertama
    const thumbnailUrl =
      (video?.cover as string | undefined) ||
      (video?.dynamicCover as string | undefined) ||
      (detail.origin_cover as string | undefined) ||
      (detail.static_cover as string | undefined) ||
      (detail.dynamic_cover as string | undefined) ||
      resolvedImages[0] ||
      "";

    // 5. Untuk post foto: images[] harus ada
    if (isPhotoPost) {
      const normalized: VideoData = {
        sourceUrl: normalizedUrl,
        title: (detail.desc as string | undefined)?.trim() || "TikTok Photo Post",
        thumbnail: thumbnailUrl,
        duration: "",
        username: author?.uniqueId ? `@${author.uniqueId as string}` : "@unknown",
        nickname: (author?.nickname as string | undefined) || "Unknown creator",
        avatar:
          (author?.avatarLarger as string | undefined) ||
          (author?.avatarMedium as string | undefined) ||
          "",
        downloadUrl: "",
        downloadMp3: "",
        views: stats?.playCount as number | undefined,
        likes: stats?.diggCount as number | undefined,
        type: "image",
        images: resolvedImages,
      };

      return NextResponse.json({ success: true, data: normalized });
    }

    // 6. Post video — logika yang sudah ada
    if (!videoUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Video tidak tersedia untuk diunduh. Coba lagi nanti.",
        },
        { status: 404 }
      );
    }

    const durationSec = video?.duration as number | undefined;

    const normalized: VideoData = {
      sourceUrl: normalizedUrl,
      title:
        (detail.desc as string | undefined)?.trim() || "Untitled TikTok Video",
      thumbnail: thumbnailUrl,
      duration: durationSec
        ? `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, "0")}`
        : "",
      username: author?.uniqueId ? `@${author.uniqueId as string}` : "@unknown",
      nickname: (author?.nickname as string | undefined) || "Unknown creator",
      avatar:
        (author?.avatarLarger as string | undefined) ||
        (author?.avatarMedium as string | undefined) ||
        "",
      downloadUrl: videoUrl,
      downloadMp3: audioUrl,
      views: stats?.playCount as number | undefined,
      likes: stats?.diggCount as number | undefined,
      type: "video",
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
