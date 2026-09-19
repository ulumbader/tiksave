import type { Config } from "tailwindcss";

const config = {
  theme: {
    extend: {
      colors: {
        lime: "#CAFF00",
        pink: "#FF2D78",
        "brutal-bg": "#F5F5E8",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        dmsans: ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
} satisfies Config;

export default config;
