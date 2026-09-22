"use client";

import { useState } from "react";
import { IconFaqChevron } from "@/components/icons";

const faqs = [
  {
    question: "Apakah SedotVidio gratis?",
    answer:
      "Ya, SedotVidio adalah pengunduh video TikTok 100% gratis. Tidak ada biaya tersembunyi, tidak perlu berlangganan, dan tidak ada batas unduhan harian. Anda bisa mengunduh video TikTok tanpa watermark dan audio MP3 kapan saja tanpa dipungut biaya. SedotVidio is completely free to use — no hidden charges, no subscriptions required.",
  },
  {
    question: "Bisakah saya mengunduh video TikTok tanpa watermark?",
    answer:
      "Ya, SedotVidio secara otomatis menyediakan unduhan video TikTok bersih tanpa watermark standar TikTok. Cukup tempel tautan video TikTok, dan pilih format video — Anda akan mendapatkan video kualitas HD tanpa logo TikTok yang mengganggu.",
  },
  {
    question: "Format apa saja yang didukung SedotVidio?",
    answer:
      "SedotVidio mendukung beberapa format unduhan: (1) Video MP4 tanpa watermark dalam kualitas HD, (2) Audio MP3 yang diekstrak dari video TikTok, dan (3) Foto/gambar dari slideshow TikTok. Semua format dapat diunduh langsung dari satu tautan TikTok.",
  },
  {
    question: "Apakah ada batas jumlah unduhan?",
    answer:
      "Tidak ada batas unduhan di SedotVidio. Anda bisa mengunduh video TikTok sebanyak yang Anda mau secara gratis. Selain itu, SedotVidio mendukung unduhan massal hingga 5 URL sekaligus untuk menghemat waktu Anda.",
  },
  {
    question: "Apakah bisa digunakan di HP (mobile)?",
    answer:
      "Ya, SedotVidio dirancang sepenuhnya responsif dan berfungsi sempurna di semua perangkat — smartphone Android, iPhone, iPad, tablet, dan komputer desktop. Tidak perlu menginstal aplikasi apapun, cukup buka browser dan kunjungi SedotVidio.",
  },
  {
    question: "Bagaimana cara download video TikTok dengan SedotVidio?",
    answer:
      "Sangat mudah! Ikuti 3 langkah ini: (1) Salin tautan/link video TikTok dari aplikasi TikTok, (2) Tempel tautan tersebut di kolom input SedotVidio, (3) Klik tombol 'Unduh' dan pilih format yang diinginkan (video HD atau MP3). File akan langsung terunduh ke perangkat Anda.",
  },
  {
    question: "Apakah SedotVidio aman digunakan?",
    answer:
      "Ya, SedotVidio sangat aman. Kami tidak menyimpan data pribadi pengguna, tidak memerlukan login atau registrasi, dan tidak menginstal software apapun di perangkat Anda. Semua proses dilakukan secara online melalui browser. Website kami juga menggunakan HTTPS untuk keamanan data.",
  },
  {
    question: "Bisakah mengunduh video TikTok yang di-private?",
    answer:
      "Tidak, SedotVidio hanya dapat mengunduh video TikTok yang bersifat publik (dapat diakses oleh siapa saja). Video yang diatur sebagai privat oleh pembuatnya tidak dapat diakses oleh layanan pihak ketiga manapun demi menghormati privasi pengguna TikTok.",
  },
  {
    question: "Apakah perlu install aplikasi untuk menggunakan SedotVidio?",
    answer:
      "Tidak perlu! SedotVidio adalah aplikasi web berbasis browser yang sepenuhnya online. Anda tidak perlu mengunduh atau menginstal aplikasi apapun. Cukup buka sedotvidio.vercel.app di browser favorit Anda (Chrome, Safari, Firefox, dll.) dan langsung gunakan. Anda juga bisa menambahkan SedotVidio ke layar utama HP sebagai PWA (Progressive Web App) untuk akses cepat.",
  },
  {
    question: "Apa perbedaan SedotVidio dengan pengunduh TikTok lainnya?",
    answer:
      "SedotVidio menawarkan beberapa keunggulan: (1) Unduhan massal hingga 5 URL sekaligus, (2) Desain modern dan cepat tanpa iklan mengganggu, (3) Mendukung video, audio MP3, dan foto slideshow, (4) Tidak perlu registrasi atau login, (5) Kualitas HD tanpa kompresi, (6) Sepenuhnya gratis tanpa batasan. SedotVidio is designed to be the fastest, cleanest TikTok downloader available.",
  },
] as const;

// FAQPage JSON-LD schema for Google rich snippets
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section id="faq" className="mx-auto w-full max-w-6xl py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <h2 className="max-w-3xl font-syne text-4xl font-black leading-tight tracking-[-0.04em] text-[var(--black)] md:text-5xl">
        Pertanyaan yang Sering Diajukan
      </h2>

      <div className="mt-8 flex flex-col gap-4">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <article
              key={item.question}
              className="overflow-hidden border-2 border-black bg-white shadow-[4px_4px_0_#000]"
            >
              <button
                type="button"
                onClick={() => toggleItem(index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[var(--black)]"
              >
                <span className="font-syne text-xl font-bold leading-tight md:text-2xl">
                  {item.question}
                </span>
                <span
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-[var(--bg)] shadow-[3px_3px_0_#000] transition-transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                >
                  <IconFaqChevron className="h-5 w-5" />
                </span>
              </button>

              {isOpen ? (
                <div className="border-t-2 border-black bg-lime/20 px-5 py-4 text-base leading-7 text-[var(--black)]">
                  {item.answer}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
