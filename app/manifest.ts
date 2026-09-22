import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SedotVidio - Unduh Video TikTok & MP3",
    short_name: "SedotVidio",
    description:
      "Pengunduh video TikTok gratis. Unduh tanpa watermark dan simpan audio MP3 dengan cepat dan aman.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5e8",
    theme_color: "#caff00",
    orientation: "portrait-primary",
    categories: ["utilities", "entertainment"],
    lang: "id",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
