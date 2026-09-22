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
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
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
        ],
      },
    ];
  },
};

export default nextConfig;
