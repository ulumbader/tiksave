import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Izinkan akses dari jaringan WiFi lokal (LAN)
  allowedDevOrigins: [
    "192.168.100.109",   // IP WiFi lokal komputer ini
    "192.168.100.*",     // seluruh subnet WiFi
    "192.168.56.*",      // subnet VirtualBox (jika ada)
    "10.0.0.*",          // subnet alternatif umum
  ],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            // Using credentialless instead of require-corp to avoid blocking
            // external embeds that crawlers might follow
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            // Explicitly tell crawlers: index everything
            key: "X-Robots-Tag",
            value: "all, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
