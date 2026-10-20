/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#7200F5", 50: "#FBF5FF", 100: "#F3E8FF", 200: "#E9D5FF", 300: "#D8B4FE", 400: "#C084FC", 500: "#A855F7", 600: "#9333EA", 700: "#7E22CE", 800: "#6D28D9", 900: "#581C87" },
        secondary: { DEFAULT: "#2048F5", 50: "#EEF5FF", 100: "#DBEAFE", 600: "#2048F5", 700: "#1D4ED8", 900: "#1E3A8A" },
        accent: "#8A00F5",
        lavender: "#F7F3FF",
        cool: "#EEF5FF",
        muted: "#5F5868",
        line: "#E8E2F2",
        base: "#F8FAFC",
        ink: "#17121F"
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(114,0,245,0.25)",
        glow: "0 0 40px -8px rgba(138,0,245,0.45)",
        card: "0 10px 40px -15px rgba(23,18,31,0.12)",
        elevated: "0 1px 2px rgba(23,18,31,0.04), 0 24px 48px -24px rgba(72,24,160,0.22)"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "primary-gradient": "linear-gradient(135deg, #7200F5 0%, #8A00F5 30%, #2048F5 100%)",
        "accent-gradient": "linear-gradient(135deg, #8A00F5 0%, #7200F5 100%)",
        "text-gradient": "linear-gradient(100deg, #7200F5 0%, #8A00F5 35%, #2048F5 100%)"
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        blob: "blob 12s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        marquee: "marquee 30s linear infinite",
        shimmer: "shimmer 2s linear infinite"
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-18px)" } },
        blob: { "0%,100%": { transform: "translate(0,0) scale(1)" }, "33%": { transform: "translate(30px,-40px) scale(1.1)" }, "66%": { transform: "translate(-20px,20px) scale(0.9)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        shimmer: { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } }
      }
    }
  },
  plugins: []
};