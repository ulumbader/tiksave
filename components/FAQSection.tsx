"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Is TikSave free to use?",
    answer:
      "Yes. TikSave is designed as a free downloader for quick TikTok video and MP3 saves.",
  },
  {
    question: "Can I download without watermark?",
    answer:
      "Yes. The intended flow is to provide clean downloads without the standard TikTok watermark.",
  },
  {
    question: "What formats are supported?",
    answer:
      "You can choose between video downloads and MP3 audio extraction from the same TikTok link.",
  },
  {
    question: "Is there a download limit?",
    answer:
      "There is no limit shown in the current interface, so casual repeated downloads are supported.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes. The layout is responsive and the downloader flow is designed to work on phones and tablets.",
  },
] as const;

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section id="faq" className="mx-auto w-full max-w-6xl py-8 md:py-12">
      <h2 className="max-w-3xl font-syne text-4xl font-black leading-tight tracking-[-0.04em] text-[var(--black)] md:text-5xl">
        Frequently Asked Questions
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
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-[var(--bg)] text-xl font-black shadow-[3px_3px_0_#000] transition-transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                >
                  {">"}
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
