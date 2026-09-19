import { NextResponse } from "next/server";

import {
  TikTokDownloaderError,
  fetchTikTokVideoDetail,
} from "@/lib/tiktokdownloader-client";
import { isAllowedVideoHost } from "@/lib/remote-media";
import { TikTokUrlError, normalizeTikTokVideoUrl } from "@/lib/tiktok-url";

function buildProxyHeaders(upstreamResponse: Response): Headers {
  const headers = new Headers();
  const contentType = upstreamResponse.headers.get("content-type");
  const contentLength = upstreamResponse.headers.get("content-length");
  const contentRange = upstreamResponse.headers.get("content-range");
  const acceptRanges = upstreamResponse.headers.get("accept-ranges");

  headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  if (contentRange) {
    headers.set("Content-Range", contentRange);
  }

  if (acceptRanges) {
    headers.set("Accept-Ranges", acceptRanges);
  }

  return headers;
}

async function resolveUpstreamVideoUrl(
  targetUrl: string | null,
  sourceUrl: string | null
): Promise<string> {
  // Jika sudah ada URL langsung (dari frontend setelah fetch /api/download)
  if (targetUrl) {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      throw new TikTokDownloaderError("Invalid video url.", 400);
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new TikTokDownloaderError("Unsupported video protocol.", 400);
    }

    if (!isAllowedVideoHost(parsedUrl.hostname)) {
      throw new TikTokDownloaderError("Video host is not allowed.", 403);
    }

    return parsedUrl.toString();
  }

  // Jika hanya ada source URL (URL TikTok), fetch ulang dari TikTokDownloader
  if (!sourceUrl) {
    throw new TikTokDownloaderError(
      "Missing video url parameter. Expected url or sourceUrl.",
      400
    );
  }

  const normalizedUrl = await normalizeTikTokVideoUrl(sourceUrl);
  const detail = await fetchTikTokVideoDetail(normalizedUrl, true);

  // Dari raw response (source:true), URL video ada di video.playAddr
  const video = detail.video as Record<string, unknown> | undefined;
  const upstreamUrl =
    (video?.playAddr as string | undefined) ||
    (video?.downloadAddr as string | undefined) ||
    (detail.downloads as string | undefined);

  if (!upstreamUrl) {
    throw new TikTokDownloaderError("Video not available for download", 404);
  }

  const parsedUrl = new URL(upstreamUrl);

  if (!isAllowedVideoHost(parsedUrl.hostname)) {
    throw new TikTokDownloaderError("Video host is not allowed.", 403);
  }

  return parsedUrl.toString();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");
  const sourceUrl = searchParams.get("sourceUrl");
  const shouldDownload = searchParams.get("download") === "1";

  try {
    const upstreamUrl = await resolveUpstreamVideoUrl(targetUrl, sourceUrl);
    const range = request.headers.get("range");

    // Header diperlukan agar CDN TikTok tidak mengembalikan 403
    const fetchHeaders: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://www.tiktok.com/",
      Origin: "https://www.tiktok.com",
    };

    if (range) {
      fetchHeaders["Range"] = range;
    }

    const upstreamResponse = await fetch(upstreamUrl, {
      method: "GET",
      headers: fetchHeaders,
    });

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch remote video.",
        },
        { status: upstreamResponse.status }
      );
    }

    const contentType = upstreamResponse.headers.get("content-type") ?? "video/mp4";

    // Beberapa CDN TikTok mengembalikan content-type yang tidak dimulai dengan "video/"
    // tapi tetap berisi stream video. Kita periksa lebih longgar.
    if (
      !contentType.toLowerCase().startsWith("video/") &&
      !contentType.toLowerCase().includes("octet-stream")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Remote asset is not a playable video.",
        },
        { status: 415 }
      );
    }

    const headers = buildProxyHeaders(upstreamResponse);

    if (shouldDownload) {
      headers.set("Content-Disposition", 'attachment; filename="tiksave-video.mp4"');
    }

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers,
    });
  } catch (error) {
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
          error instanceof Error ? error.message : "Unexpected video proxy error.",
      },
      { status: 500 }
    );
  }
}
