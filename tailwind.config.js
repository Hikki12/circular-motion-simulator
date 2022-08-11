/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: ["./src/**/*.{html,js}", "./js/index.js", "./index.html"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
