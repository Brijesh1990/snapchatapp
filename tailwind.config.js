/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        snapchat: {
          yellow: '#FFFC00',
          blue: '#00BBE4',
          purple: '#9B51E0',
          pink: '#FF4C82',
          black: '#000000',
          gray: '#EFEFEF',
        }
      },
      fontFamily: {
        snapchat: ['"Avenir Next"', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
