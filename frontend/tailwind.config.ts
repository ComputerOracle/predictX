import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        stellar: "#3B82F6",
        signal: "#10B981",
        warning: "#F59E0B"
      }
    }
  },
  plugins: []
};

export default config;

