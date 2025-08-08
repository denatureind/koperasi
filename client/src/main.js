import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// --- BAGIAN BARU UNTUK NOTIFIKASI TOAST ---
import Toast from "vue-toastification";
// Import CSS-nya juga
import "vue-toastification/dist/index.css";
// -----------------------------------------

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast); // <-- GUNAKAN PLUGIN TOAST

app.mount("#app");
