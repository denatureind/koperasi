<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4"
  >
    <div class="login-container max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header elegan dengan gradient -->
        <div class="bg-gradient-to-r from-indigo-600 to-blue-500 py-6 px-8">
          <h1 class="text-2xl font-bold text-white text-center">
            Login Pengurus
          </h1>
          <p class="text-indigo-200 text-center mt-2">
            Masukkan kredensial Anda
          </p>
        </div>

        <form class="login-form p-8" @submit.prevent="handleLogin">
          <!-- Input fields -->
          <div class="form-group mb-6">
            <label for="username" class="block text-gray-700 font-medium mb-2"
              >Username</label
            >
            <input
              type="text"
              id="username"
              v-model="username"
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200 outline-none"
              placeholder="Masukkan username"
            />
          </div>

          <div class="form-group mb-8">
            <label for="password" class="block text-gray-700 font-medium mb-2"
              >Password</label
            >
            <input
              type="password"
              id="password"
              v-model="password"
              required
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200 outline-none"
              placeholder="Masukkan password"
            />
          </div>

          <!-- Tombol submit -->
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-0.5"
          >
            Login
          </button>

          <!-- Pesan error dengan animasi -->
          <div v-if="errorMessage" class="mt-6 animate-fade-in">
            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div class="flex items-center">
                <svg
                  class="h-5 w-5 text-red-500 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <p class="text-red-700 font-medium">{{ errorMessage }}</p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer kecil -->
      <p class="text-center text-gray-500 mt-8 text-sm">
        &copy; 2023 Sistem Pengurus. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
// Logika tetap sama seperti semula
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.js";

const username = ref("");
const password = ref("");
const errorMessage = ref(null);

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = null;
  try {
    await authStore.login({
      username: username.value,
      password: password.value,
    });
    router.push("/");
  } catch (error) {
    errorMessage.value = error.message || "Terjadi kesalahan saat login.";
  }
};
</script>

<style scoped>
/* Animasi tambahan */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Menghilangkan outline pada input saat focus (sudah dihandle Tailwind) */
input:focus {
  outline: none;
}
</style>
