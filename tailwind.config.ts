import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      minHeight:{
        '600': '600px'
      },
      height:{
        '300': '300px'
      },
      maxWidth:{
        '260': '260px'
      },
      width:{
        '90v': '90vw',
        '80v': '80vw',
      },
      boxShadow:{
        'shadow-card': '0px 0px 60px 0px rgba(0,0,0,0.30)',
        'shadow-button': '0px 0px 30px 0px rgba(0,0,0,0.10)',
      },
      colors: {
        'button-color': '#9198e5',
      },
    },
  },
  plugins: [],
};
export default config;
