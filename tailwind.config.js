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
      width: {
        "30/100": "30%",
        "1/7": "14.2857143%",
        "2/7": "28.5714286%",
        "3/7": "42.8571429%",
        "4/7": "57.1428571%",
        "5/7": "71.4285714%",
        "6/7": "85.7142857%",
      },
      fontFamily: {
        "sans-thai": ["IBM Plex Sans Thai Looped", "sans-serif"],
      },
    },
  },
  plugins: [],
};
