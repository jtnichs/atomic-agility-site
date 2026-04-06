import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#000E22",
        navyMid: "#00234B",
        cyan: "#00A5F0",
        muted: "#94a3b8",
      },
    },
  },
  plugins: [],
};
export default config;
