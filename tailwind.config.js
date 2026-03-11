const {nextui} = require('@nextui-org/theme');
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'instrument-sans': ['"Instrument Sans"', 'sans-serif'],
        'instrument-serif': ['"Instrument Serif"', 'serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [nextui()],
}
