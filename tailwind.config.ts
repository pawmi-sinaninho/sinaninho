/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:  '#27CDBA',
        secondary:'#FFA726',
        accent:   '#A46BD9',
      },
    },
  },
  plugins: [],
};
