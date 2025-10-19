import { type Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: "#ff6b6b",
        accent2: "#7c3aed",
        bg: "#f6f9fc",
        card: "#ffffff",
        muted: "#556677",
        glass: "rgba(0,0,0,0.04)",
        text: "#0b1220",
        "dark-bg": "#071122",
        "dark-card": "#08131c",
        "dark-muted": "#9fb3c8",
        "dark-accent": "#06b6d4",
        "dark-glass": "rgba(255,255,255,0.03)",
        "dark-text": "#f9f9f9",
      },
      backgroundImage: {
        "fun-grad": "linear-gradient(90deg, #ff6b6b, #ff9966)",
      },
      borderRadius: {
        lg: "16px",
      },
      maxWidth: {
        container: "1100px",
      },
    },
  },
  plugins: [],
};

export default config;
