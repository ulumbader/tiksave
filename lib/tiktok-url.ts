const SHORT_LINK_HOSTS = new Set(["vt.tiktok.com", "vm.tiktok.com"]);
const VIDEO_PATH_PATTERN = /^\/(@[^/]+)\/(video|photo)\/(\d+)\/?$/;

export class TikTokUrlError extends Error {
  constructor(
    message: string,
    readonly statusCode = 400
  ) {
    super(message);
    this.name = "TikTokUrlError";
  }
}

function parseUrl(rawUrl: string): URL {
  try {
    return new URL(rawUrl);
  } catch {
    throw new TikTokUrlError("Invalid TikTok URL.");
  }
}

function isTikTokHost(hostname: string): boolean {
  const normalizedHost = hostname.toLowerCase();

  return normalizedHost === "tiktok.com" || normalizedHost.endsWith(".tiktok.com");
}

function isShortTikTokUrl(url: URL): boolean {
  const hostname = url.hostname.toLowerCase();

  return SHORT_LINK_HOSTS.has(hostname) || url.pathname.startsWith("/t/");
}

function toCanonicalVideoUrl(url: URL): string | null {
  const match = url.pathname.match(VIDEO_PATH_PATTERN);

  if (!match) {
    return null;
  }

  // match[1] = @user, match[2] = "video" | "photo", match[3] = id
  return `https://www.tiktok.com/${match[1]}/${match[2]}/${match[3]}`;
}

async function resolveShortTikTokUrl(url: URL): Promise<URL> {
  let manualTarget = url;

  try {
    const redirectResponse = await fetch(url.toString(), {
      method: "HEAD",
      redirect: "manual",
      cache: "no-store",
    });
    const location = redirectResponse.headers.get("location");

    if (location) {
      manualTarget = new URL(location, url);
    }
  } catch {
    // Fall through to a normal fetch-based resolution.
  }

  if (manualTarget.toString() !== url.toString()) {
    return manualTarget;
  }

  try {
    const response = await fetch(url.toString(), {
      redirect: "follow",
      cache: "no-store",
    });

    return new URL(response.url);
  } catch {
    throw new TikTokUrlError("Failed to resolve TikTok short link.", 502);
  }
}

export async function normalizeTikTokVideoUrl(rawUrl: string): Promise<string> {
  const parsedUrl = parseUrl(rawUrl);

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new TikTokUrlError("Invalid TikTok URL.");
  }

  if (!isTikTokHost(parsedUrl.hostname)) {
    throw new TikTokUrlError("Only TikTok URLs are supported.");
  }

  const resolvedUrl = isShortTikTokUrl(parsedUrl)
    ? await resolveShortTikTokUrl(parsedUrl)
    : parsedUrl;

  if (!isTikTokHost(resolvedUrl.hostname)) {
    throw new TikTokUrlError("Only TikTok URLs are supported.");
  }

  const canonicalVideoUrl = toCanonicalVideoUrl(resolvedUrl);

  if (!canonicalVideoUrl) {
    throw new TikTokUrlError("Only TikTok video or photo URLs are supported.");
  }

  return canonicalVideoUrl;
}
