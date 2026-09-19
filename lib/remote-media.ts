const COMMON_TIKTOK_MEDIA_HOST_SUFFIXES = [
  "tiktokcdn.com",
  "tiktokcdn-us.com",
  "tiktokcdn-eu.com",
  "tiktok.com",
  "tiktokv.com",
  "muscdn.com",
  "byteimg.com",
  "ibyteimg.com",
  "ibytedtos.com",
] as const;

const VIDEO_ONLY_HOST_SUFFIXES = ["akamaized.net", "robotilab.online"] as const;

function hasAllowedHostSuffix(
  hostname: string,
  suffixes: readonly string[]
): boolean {
  return suffixes.some(
    (suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`)
  );
}

export function isAllowedImageHost(hostname: string): boolean {
  return hasAllowedHostSuffix(hostname.toLowerCase(), COMMON_TIKTOK_MEDIA_HOST_SUFFIXES);
}

export function isAllowedVideoHost(hostname: string): boolean {
  return hasAllowedHostSuffix(hostname.toLowerCase(), [
    ...COMMON_TIKTOK_MEDIA_HOST_SUFFIXES,
    ...VIDEO_ONLY_HOST_SUFFIXES,
  ]);
}
