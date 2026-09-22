import type { ReactNode } from "react";
import { IconLink, IconHeadphones, IconDownload } from "@/components/icons";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sedotvidio.vercel.app";

const steps: ReadonlyArray<{
  title: string;
  description: string;
  icon: ReactNode;
  cardClass: string;
  badgeClass: string;
}> = [
  {
    title: "Tempel Tautan",
    description: "Salin tautan video TikTok dari aplikasi TikTok, lalu tempel ke kolom input SedotVidio. Mendukung hingga 5 tautan sekaligus untuk unduhan massal.",
    icon: <IconLink className="h-10 w-10" />,
    cardClass: "bg-white text-[var(--black)]",
    badgeClass: "bg-lime text-[var(--black)]",
  },
  {
    title: "Pilih Format",
    description: "Pilih format unduhan yang diinginkan: video HD tanpa watermark (MP4) atau ekstrak audio MP3 jernih dari video TikTok.",
    icon: <IconHeadphones className="h-10 w-10" />,
    cardClass: "bg-pink text-white",
    badgeClass: "bg-black text-lime",
  },
  {
    title: "Unduh Gratis",
    description: "Klik unduh dan file langsung tersimpan ke perangkat Anda. Cepat, gratis, tanpa registrasi, tanpa watermark.",
    icon: <IconDownload className="h-10 w-10" />,
    cardClass: "bg-black text-white",
    badgeClass: "bg-lime text-[var(--black)]",
  },
];

// HowTo JSON-LD schema for Google rich snippets
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cara Mengunduh Video TikTok Tanpa Watermark dengan SedotVidio",
  description:
    "Panduan lengkap langkah demi langkah untuk mengunduh video TikTok tanpa watermark dan menyimpan audio MP3 menggunakan SedotVidio secara gratis. Proses cepat, mudah, dan aman tanpa perlu instal aplikasi.",
  totalTime: "PT1M",
  image: `${siteUrl}/og-image.png`,
  url: `${siteUrl}/#how-it-works`,
  tool: [
    {
      "@type": "HowToTool",
      name: "Browser web (Chrome, Firefox, Safari, Edge, atau browser lainnya)",
    },
  ],
  supply: [
    {
      "@type": "HowToSupply",
      name: "Tautan/link video TikTok yang ingin diunduh",
    },
  ],
  step: steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.title,
    text: step.description,
    url: `${siteUrl}/#how-it-works`,
  })),
};

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-6xl py-8 md:py-12"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <div className="flex flex-col gap-4">
        <span className="inline-flex w-fit border-2 border-black bg-lime px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--black)] shadow-[3px_3px_0_#000]">
          Langkah Mudah
        </span>

        <h2 className="max-w-3xl font-syne text-4xl font-black leading-tight tracking-[-0.04em] text-[var(--black)] md:text-5xl">
          Cara Unduh Video TikTok dalam 3 Langkah
        </h2>

        <p className="max-w-2xl text-base leading-7 text-[var(--black)]/80">
          Unduh video TikTok tanpa watermark, simpan audio MP3, dan download foto slideshow dengan mudah menggunakan SedotVidio. Gratis, cepat, dan aman.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className={`border-2 border-black p-6 shadow-[4px_4px_0_#000] ${step.cardClass}`}
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={`inline-flex h-12 w-12 items-center justify-center border-2 border-black text-lg font-black shadow-[3px_3px_0_#000] ${step.badgeClass}`}
              >
                {index + 1}
              </span>
              <span className="leading-none">{step.icon}</span>
            </div>

            <h3 className="mt-6 font-syne text-2xl font-bold">{step.title}</h3>

            <p className="mt-3 text-base leading-7 opacity-90">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
