/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "code-1": {
          "0%": { opacity: 0 },
          "2.5%": { opacity: 1 },
          "97.5%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "code-2": {
          "16.2%": { opacity: 0 },
          "18.75%": { opacity: 1 },
          "97.5%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "code-3": {
          "32.5%": { opacity: 0 },
          "35%": { opacity: 1 },
          "97.5%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "code-4": {
          "48.75%": { opacity: 0 },
          "51.25%": { opacity: 1 },
          "97.5%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "code-5": {
          "65%": { opacity: 0 },
          "72.5%": { opacity: 1 },
          "97.5%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "code-6": {
          "81.25%": { opacity: 0 },
          "83.75%": { opacity: 1 },
          "97.5%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        breath: {
          "0%, 100%": { transform: "scale(0.95)" },
          "50%": { transform: "scale(1.1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5%)" },
        },
        line: {
          "0%, 100%": { left: 0, opacity: 0 },
          "50%": { left: "100%", transform: "translateX(-100%)" },
          "10%, 40%, 60%, 90%": { opacity: 0 },
          "25%, 75%": { opacity: 1 },
        },
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"], // Fuente principal para textos
        mono: ["DM Mono", "monospace"], // Fuente para código o elementos monoespaciados
      },
      colors: {
        strongBlue: "rgba(69, 88, 200, 1)",
        lightGray: "#F2F7F9",
        grayBg: "#FAFAFA",
        headerButtonActive: "#F2F2F7", 
        borrderHeaderButtonActive: "#E4E7EC", 
        borderGray: "#E4E7EC",
        darkGrayText: "#46505E",
        darkBlue: '#4558C8',
        darkHeader: "#1D2B33",
        
      },
      'bounce-in-down': {
        '0%': {
          transform: 'translateY(-100%)',
          opacity: '0',
        },
        '60%': {
          transform: 'translateY(10%)',
          opacity: '1',
        },
        '80%': {
          transform: 'translateY(-5%)',
        },
        '100%': {
          transform: 'translateY(0)',
        },
      },
      animation: {
        'bounce-in-down': 'bounce-in-down 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};
