const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  // Konfigurasi PWA
  pwa: {
    name: "Koperasi Lite",
    themeColor: "#4F46E5", // Warna tema (misalnya indigo)
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    // Konfigurasi manifest
    manifestOptions: {
      short_name: "KopLite",
      description: "Aplikasi Manajemen Koperasi Simpan Pinjam",
      background_color: "#ffffff",
      icons: [
        {
          src: "./img/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "./img/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  },

  // Konfigurasi proxy server (agar tetap berfungsi)
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
