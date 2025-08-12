/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  // --- TAMBAHKAN BAGIAN INI ---
  plugins: [require("daisyui")],
};
