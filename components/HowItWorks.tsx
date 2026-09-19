const steps = [
  {
    title: "Paste Link",
    description: "Copy any TikTok URL and drop it into the input bar in one tap.",
    icon: "\uD83D\uDD17",
    cardClass: "bg-white text-[var(--black)]",
    badgeClass: "bg-lime text-[var(--black)]",
  },
  {
    title: "Choose Format",
    description: "Pick high-quality video or extract clean MP3 audio before downloading.",
    icon: "\uD83C\uDFA7",
    cardClass: "bg-pink text-white",
    badgeClass: "bg-black text-lime",
  },
  {
    title: "Download",
    description: "Save the file instantly with a bold, fast, no-fuss download flow.",
    icon: "\u2B07",
    cardClass: "bg-black text-white",
    badgeClass: "bg-lime text-[var(--black)]",
  },
] as const;

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-6xl py-8 md:py-12"
    >
      <div className="flex flex-col gap-4">
        <span className="inline-flex w-fit border-2 border-black bg-lime px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--black)] shadow-[3px_3px_0_#000]">
          Simple Steps
        </span>

        <h2 className="max-w-3xl font-syne text-4xl font-black leading-tight tracking-[-0.04em] text-[var(--black)] md:text-5xl">
          3 Easy Steps To Download
        </h2>
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
              <span className="text-4xl leading-none">{step.icon}</span>
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
