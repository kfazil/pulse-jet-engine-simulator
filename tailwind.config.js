module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        nebula: {
          "0%": { filter: "blur(10px) saturate(120%)" },
          "100%": { filter: "blur(18px) saturate(180%)" },
        },
      },
      animation: {
        nebula: "nebula 18s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};