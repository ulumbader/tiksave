import { NextResponse } from "next/server";

import { isAllowedImageHost } from "@/lib/remote-media";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing image url parameter.",
      },
      { status: 400 }
    );
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid image url.",
      },
      { status: 400 }
    );
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return NextResponse.json(
      {
        success: false,
        error: "Unsupported image protocol.",
      },
      { status: 400 }
    );
  }

  if (!isAllowedImageHost(parsedUrl.hostname)) {
    return NextResponse.json(
      {
        success: false,
        error: "Image host is not allowed.",
      },
      { status: 403 }
    );
  }

  try {
    const upstreamResponse = await fetch(parsedUrl.toString(), {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.tiktok.com/",
        Origin: "https://www.tiktok.com",
      },
    });

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch remote image.",
        },
        { status: upstreamResponse.status }
      );
    }

    const contentType =
      upstreamResponse.headers.get("content-type") || "image/jpeg";
    const imageBuffer = await upstreamResponse.arrayBuffer();

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Cross-Origin-Resource-Policy": "same-origin",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unexpected image proxy error.",
      },
      { status: 500 }
    );
  }
}
