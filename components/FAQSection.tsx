"use client";

import { useState } from "react";
import { IconFaqChevron } from "@/components/icons";

const faqs = [
  {
    question: "Apakah SedotVidio gratis?",
    answer:
      "Ya. SedotVidio dirancang sebagai pengunduh gratis untuk menyimpan video dan MP3 TikTok dengan cepat.",
  },
  {
    question: "Bisakah saya mengunduh tanpa watermark?",
    answer:
      "Ya. SedotVidio menyediakan unduhan bersih tanpa watermark standar TikTok.",
  },
  {
    question: "Format apa saja yang didukung?",
    answer:
      "Anda bisa memilih antara unduhan video atau ekstraksi audio MP3 dari tautan TikTok yang sama.",
  },
  {
    question: "Apakah ada batas unduhan?",
    answer:
      "Tidak ada batas yang ditampilkan di antarmuka saat ini, jadi unduhan berulang secara kasual didukung.",
  },
  {
    question: "Apakah bisa digunakan di HP?",
    answer:
      "Ya. Tata letak responsif dan alur pengunduhan dirancang untuk bekerja di ponsel dan tablet.",
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
