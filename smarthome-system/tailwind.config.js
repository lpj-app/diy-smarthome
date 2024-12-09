/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        CardBackground: "#323232",
        background: "#707070",
        cardItem: "#3DB87B",
        textColor: "#054468",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
