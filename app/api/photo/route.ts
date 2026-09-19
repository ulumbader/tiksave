import { NextResponse } from "next/server";

/**
 * Proxy endpoint untuk download foto TikTok satu per satu.
 * Dibutuhkan karena foto TikTok di-host di CDN yang punya CORS restriction.
 *
 * GET /api/photo?url=<encoded_photo_url>&index=<1>
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const photoUrl = searchParams.get("url");
  const indexParam = searchParams.get("index") ?? "1";

  if (!photoUrl) {
    return NextResponse.json(
      { success: false, error: "Missing 'url' query parameter." },
      { status: 400 }
    );
  }

  // Validasi URL hanya dari domain TikTok CDN
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(photoUrl);
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid URL." },
      { status: 400 }
    );
  }

  const allowedHosts = [
    "tiktok.com",
    "tiktokcdn.com",
    "tiktokcdn-us.com",
    "p16-common-sign.tiktokcdn.com",
    "p19-common-sign.tiktokcdn.com",
    "p16-sign.tiktokcdn-us.com",
    "p19-sign.tiktokcdn-us.com",
    "p77-sign-sg.tiktokcdn.com",
    "p16-amd-va.tiktokcdn.com",
    "p16-sign-va.tiktokcdn.com",
    "p77-sign-va.tiktokcdn.com",
    "p16-photomode-sg.tiktokcdn.com",
    "p19-photomode-sg.tiktokcdn.com",
  ];

  const isAllowed =
    allowedHosts.some(
      (host) =>
        parsedUrl.hostname === host ||
        parsedUrl.hostname.endsWith(`.${host}`)
    ) ||
    // Izinkan semua subdomain tiktokcdn.com dan tiktokcdn-us.com
    parsedUrl.hostname.endsWith(".tiktokcdn.com") ||
    parsedUrl.hostname.endsWith(".tiktokcdn-us.com");

  if (!isAllowed) {
    return NextResponse.json(
      { success: false, error: "URL host not allowed." },
      { status: 403 }
    );
  }

  try {
    const upstream = await fetch(photoUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.tiktok.com/",
      },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Upstream responded with ${upstream.status}`,
        },
        { status: 502 }
      );
    }

    const contentType =
      upstream.headers.get("content-type") ?? "image/jpeg";
    const arrayBuffer = await upstream.arrayBuffer();

    // Tentukan ekstensi dari content-type
    const extMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };
    const ext = extMap[contentType.split(";")[0].trim()] ?? "jpg";
    const filename = `tiktok_photo_${indexParam}.${ext}`;

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch photo.",
      },
      { status: 500 }
    );
  }
}
