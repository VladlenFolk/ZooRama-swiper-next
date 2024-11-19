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
      minHeight: {
        "600": "600px",
      },
      height: {
        "300h": "300px",
      },
      maxWidth: {
        "260": "260px",
        "maxW-300": "300px",
      },
      width: {
        "90v": "90vw",
        "80v": "80vw",
        "300": "300px",
        "w-9/10": "90%",
      },
      colors: {
        "button-color": "#9198e5",
      },
      boxShadow: {
        "shadow-1": "0 10px 20px rgba(0, 0, 0, 0.3)",//не применяется
        "shadow-button": "0px 0px 30px 0px rgba(0,0,0,0.10)",
      },
      animation: {
        fadeIn : 'fadeIn .3s ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': {opacity: '0', transform: 'translateY(20px)'},
          '100%': {opacity: '1', transform: 'translateY(0)'}
        },        
      },
      translate :{
        x: "var(--x)",
        y: "var(--y)"
      }
    },
  },
  plugins: [],
};
export default config;
