/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        paper: "var(--color-paper)",
        "paper-soft": "var(--color-paper-soft)",
        pink: "var(--color-pink)",
        yellow: "var(--color-yellow)",
        muted: "var(--color-muted)"
      }
    }
  },
  plugins: []
};
