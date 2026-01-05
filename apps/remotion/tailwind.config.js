/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", '"Noto Sans CJK JP"', '"Noto Sans JP"', "sans-serif"],
        mono: ["JetBrains Mono", '"Noto Sans Mono CJK JP"', "monospace"],
      },
    },
  },
  plugins: [],
};
