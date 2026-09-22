import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SedotVidio - Unduh Video TikTok Tanpa Watermark & MP3 Gratis",
    short_name: "SedotVidio",
    description:
      "Pengunduh video TikTok gratis terbaik. Unduh tanpa watermark dalam kualitas HD dan simpan audio MP3 dengan cepat, mudah, dan aman. Gratis tanpa registrasi.",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f5f5e8",
    theme_color: "#caff00",
    orientation: "portrait-primary",
    categories: ["utilities", "entertainment", "productivity"],
    lang: "id",
    dir: "ltr",
    prefer_related_applications: false,
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Unduh Video TikTok",
        short_name: "Unduh",
        description: "Langsung unduh video TikTok tanpa watermark",
        url: "/#download-form",
      },
      {
        name: "Cara Kerja",
        short_name: "Panduan",
        description: "Lihat panduan cara mengunduh video TikTok",
        url: "/#how-it-works",
      },
    ],
  };
}
