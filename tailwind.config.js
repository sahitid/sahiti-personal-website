const {nextui} = require('@nextui-org/theme');
module.exports = {
  content: [
    "./node_modules/@nextui-org/theme/dist/components/[object Object].js"
],
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [nextui()],
}
