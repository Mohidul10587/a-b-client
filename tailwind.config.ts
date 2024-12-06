import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      screens: {
        'xl': '1600px',
      },
    },
    extend: {
      colors: {
        main2: "#ab2647", // Fallback color
      },
    },
  },
  plugins: [],
};

export default config;
