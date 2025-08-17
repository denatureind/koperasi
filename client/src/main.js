import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css"; // <-- PASTIKAN INI ADA

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./registerServiceWorker";
import "./registerServiceWorker";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast);

app.mount("#app");
