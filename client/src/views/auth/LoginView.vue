<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleLogin">
      <h1>Login Pengurus</h1>
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.js";

const username = ref("");
const password = ref("");
const errorMessage = ref(null);

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = null; // Reset pesan error
  try {
    await authStore.login({
      username: username.value,
      password: password.value,
    });
    // Redirect ke halaman utama setelah login berhasil
    router.push("/");
  } catch (error) {
    errorMessage.value = error.message || "Terjadi kesalahan saat login.";
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.login-form {
  width: 350px;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
h1 {
  text-align: center;
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.error-message {
  color: red;
  margin-top: 15px;
  text-align: center;
}
</style>
