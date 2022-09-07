module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        all: "0 0 4px rgba(0, 0, 0, 0.15)",
      },
      colors: {
        primary: "#5CB5E8",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
        160: "40rem",
        176: "44rem",
        192: "48rem",
        208: "52rem",
        224: "56rem",
        240: "60rem",
        256: "64rem",
        272: "68rem",
        288: "72rem",
        304: "76rem",
        320: "80rem",
        336: "84rem",
        352: "88rem",
        368: "92rem",
      },
      height: {
        "95/100": "95%",
      },
      fontFamily: {
        "sans-thai": ["IBM Plex Sans Thai Looped", "sans-serif"],
      },
    },
  },
  plugins: [],
};
