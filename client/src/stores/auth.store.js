import { defineStore } from "pinia";
import AuthService from "@/services/auth.service.js";

// Coba ambil user dan token dari localStorage jika ada
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: token || null,
    user: user || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    async login(userCredentials) {
      try {
        const response = await AuthService.login(userCredentials);
        const { token, user } = response.data;

        // Simpan token dan user di state
        this.token = token;
        this.user = user;

        // Simpan juga di localStorage agar tidak hilang saat refresh
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        return Promise.resolve(response.data);
      } catch (error) {
        this.token = null;
        this.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return Promise.reject(error.response.data);
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
