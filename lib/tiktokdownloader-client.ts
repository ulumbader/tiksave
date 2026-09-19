/**
 * Client untuk TikTokDownloader Web API (FastAPI server lokal).
 * Dokumentasi API: http://127.0.0.1:5555/docs
 *
 * Jalankan server terlebih dahulu:
 *   cd TikTokDownloader && python main.py  (pilih mode Web API)
 */

// ---------------------------------------------------------------------------
// Types – Response dari TikTokDownloader (POST /tiktok/detail & /douyin/detail)
// ---------------------------------------------------------------------------

export type TikTokDownloaderDataResponse = {
  message: string;
  data: TikTokVideoDetail | null;
  params: Record<string, unknown>;
};

export type TikTokVideoDetail = {
  // Identitas
  id?: string;
  detail_id?: string;

  // Penulis
  uid?: string;
  sec_uid?: string;
  unique_id?: string;
  nickname?: string;
  avatar?: string;

  // Field raw (tersedia saat source: true)
  author?: {
    avatarLarger?: string;
    avatarMedium?: string;
    avatarThumb?: string;
    nickname?: string;
    uniqueId?: string;
    [key: string]: unknown;
  };

  // Konten
  desc?: string;
  create_time?: number;
  duration?: number | string;

  // URL media
  downloads?: string;       // URL download video (no watermark)
  music?: string;           // URL audio/mp3
  music_url?: string;       // URL audio/mp3 (versi processed)
  images?: string[];        // URL gambar (jika slide/foto)
  dynamic_cover?: string;   // Cover bergerak
  static_cover?: string;    // Cover statis
  origin_cover?: string;    // Cover asli

  // Statistik
  digg_count?: number;      // likes
  comment_count?: number;
  play_count?: number;
  share_count?: number;
  collect_count?: number;

  // Lainnya
  [key: string]: unknown;
};

// ---------------------------------------------------------------------------
// Error class
// ---------------------------------------------------------------------------

export class TikTokDownloaderError extends Error {
  constructor(
    message: string,
    readonly statusCode = 500,
    readonly payload?: unknown
  ) {
    super(message);
    this.name = "TikTokDownloaderError";
  }
}

// ---------------------------------------------------------------------------
// Helpers internal
// ---------------------------------------------------------------------------

function getBaseUrl(): string {
  const url = process.env.TIKTOKDOWNLOADER_URL;

  if (!url) {
    throw new TikTokDownloaderError(
      "TIKTOKDOWNLOADER_URL tidak dikonfigurasi di .env.local",
      500
    );
  }

  return url.replace(/\/$/, ""); // hilangkan trailing slash
}

function getToken(): string {
  return process.env.TIKTOKDOWNLOADER_TOKEN ?? "";
}

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getToken();

  if (token) {
    headers["token"] = token;
  }

  return headers;
}

/**
 * Ekstrak numeric video ID dari URL TikTok yang sudah dinormalisasi.
 * Contoh: https://www.tiktok.com/@user/video/7123456789012345678 → "7123456789012345678"
 */
export function extractTikTokDetailId(normalizedUrl: string): string {
  const match = normalizedUrl.match(/\/video\/(\d+)/);

  if (!match) {
    throw new TikTokDownloaderError(
      "Tidak dapat mengekstrak video ID dari URL TikTok. Pastikan URL berformat: tiktok.com/@user/video/ID",
      400
    );
  }

  return match[1];
}

// ---------------------------------------------------------------------------
// Fungsi utama
// ---------------------------------------------------------------------------

/**
 * Fetch detail video TikTok (international) dari TikTokDownloader API.
 * @param normalizedUrl URL TikTok yang sudah dinormalisasi (dari normalizeTikTokVideoUrl)
 * @param source Jika true, kembalikan data raw (termasuk field author dengan avatarLarger)
 */
export async function fetchTikTokVideoDetail(
  normalizedUrl: string,
  source = true
): Promise<TikTokVideoDetail> {
  const baseUrl = getBaseUrl();
  const detailId = extractTikTokDetailId(normalizedUrl);

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/tiktok/detail`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ detail_id: detailId, source }),
    });
  } catch (err) {
    throw new TikTokDownloaderError(
      `Tidak dapat terhubung ke TikTokDownloader server (${baseUrl}). ` +
        "Pastikan server sudah dijalankan: python main.py",
      502,
      err
    );
  }

  const json = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new TikTokDownloaderError(
      `TikTokDownloader server merespons dengan status ${response.status}`,
      response.status,
      json
    );
  }

  const body = json as TikTokDownloaderDataResponse;

  if (!body.data) {
    throw new TikTokDownloaderError(
      body.message || "TikTokDownloader tidak menemukan data video.",
      404,
      json
    );
  }

  return body.data;
}

/**
 * Fetch detail video DouYin dari TikTokDownloader API.
 * @param detailId numeric ID video DouYin
 */
export async function fetchDouyinVideoDetail(
  detailId: string
): Promise<TikTokVideoDetail> {
  const baseUrl = getBaseUrl();

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/douyin/detail`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ detail_id: detailId }),
    });
  } catch (err) {
    throw new TikTokDownloaderError(
      `Tidak dapat terhubung ke TikTokDownloader server (${baseUrl}). ` +
        "Pastikan server sudah dijalankan: python main.py",
      502,
      err
    );
  }

  const json = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new TikTokDownloaderError(
      `TikTokDownloader server merespons dengan status ${response.status}`,
      response.status,
      json
    );
  }

  const body = json as TikTokDownloaderDataResponse;

  if (!body.data) {
    throw new TikTokDownloaderError(
      body.message || "TikTokDownloader tidak menemukan data video DouYin.",
      404,
      json
    );
  }

  return body.data;
}
