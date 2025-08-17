import { defineStore } from "pinia";
import axios from "axios";

const API_URL = "/api/member";

// ID 'memberAuth' menjadi argumen pertama, objek options menjadi argumen kedua
export const useMemberAuthStore = defineStore("memberAuth", {
  state: () => ({
    token: localStorage.getItem("member_token") || null,
    user: JSON.parse(localStorage.getItem("member_user")) || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    // BARU: Tambahkan getter ini untuk membuat header otentikasi
    authHeader: (state) => {
      if (state.token) {
        return { Authorization: "Bearer " + state.token };
      } else {
        return {};
      }
    },
  },
  actions: {
    async login(credentials) {
      const response = await axios.post(`${API_URL}/login`, credentials);
      const { token, user } = response.data;
      this.token = token;
      this.user = user;
      localStorage.setItem("member_token", token);
      localStorage.setItem("member_user", JSON.stringify(user));
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("member_token");
      localStorage.removeItem("member_user");
    },
  },
});
