import { IconCoffee } from "@/components/icons";

export default function Footer() {
  return (
    <footer aria-label="Footer situs SedotVidio" className="mt-4 w-full border-t-2 border-lime bg-black text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8 md:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xs">
          <a
            href="#home"
            className="font-syne text-3xl font-black tracking-tight text-lime"
          >
            SedotVidio
          </a>
          <p className="mt-3 text-sm leading-7 text-white/80">
            Unduh video TikTok tanpa watermark dan simpan audio MP3, gratis dan cepat. Pengunduh TikTok terbaik di Indonesia.
          </p>
        </div>

        <nav aria-label="Navigasi footer" className="flex flex-col gap-3 text-sm font-bold uppercase tracking-[0.14em] text-white/90 md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-6">
          <a href="#home" className="transition-colors hover:text-lime">
            Beranda
          </a>
          <a
            href="#how-it-works"
            className="transition-colors hover:text-lime"
          >
            Cara Kerja
          </a>
          <a href="#faq" className="transition-colors hover:text-lime">
            FAQ
          </a>
          <a href="/sitemap.xml" className="transition-colors hover:text-lime">
            Sitemap
          </a>
        </nav>

        <p className="text-sm font-bold text-white/80 lg:text-right">
          Dibuat dengan <IconCoffee className="inline h-4 w-4 mx-1 -mt-0.5" /> untuk para kreator
        </p>
      </div>

      <div className="border-t border-white/15 px-5 py-4 text-xs font-medium text-white/65 md:px-6">
        <div className="mx-auto w-full max-w-6xl">
          {"\u00A9"} 2026 SedotVidio. Tidak berafiliasi dengan TikTok.
        </div>
      </div>
    </footer>
  );
}
