import axios from "axios";

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "/api", // Menggunakan proxy di development
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token ke setiap request
instance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers["Authorization"] = "Bearer " + user.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
