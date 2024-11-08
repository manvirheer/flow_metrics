// tailwind.config.ts

import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin"; // Correct import from 'tailwindcss/plugin'

// Ensure '@tailwindcss/forms' is installed:
// npm install @tailwindcss/forms

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Add other paths if necessary
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Custom CSS variables
        foreground: "var(--foreground)",
        "git-blue": "#0D1117", // Custom color
      },
      // Add other extensions like spacing, fonts, etc., if needed
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(function ({ addBase }) {
      addBase({
        'input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button': {
          "-webkit-appearance": "none",
          margin: "0",
        },
        'input[type="number"]': {
          "-moz-appearance": "textfield",
        },
      });
    }),
  ],
};

export default config;
