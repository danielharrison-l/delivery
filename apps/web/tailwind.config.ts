import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        steel: "#496070",
        mint: "#2f9e87",
        coral: "#d95f43"
      }
    }
  },
  plugins: []
} satisfies Config;
