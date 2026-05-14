import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        cream: "#FFF8ED",
        field: "#2F6B3F",
        harvest: "#F59E0B",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(47, 107, 63, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
