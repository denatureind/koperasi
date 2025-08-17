<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white"
  >
    <div class="max-w-md w-full px-4">
      <div class="text-center mb-10">
        <div
          class="mx-auto w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <i class="fas fa-user-lock text-white text-4xl"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mt-6">Login Anggota</h1>
        <p class="text-gray-500 mt-2">
          Masukkan kredensial Anda untuk mengakses dashboard anggota
        </p>
      </div>

      <div
        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div class="p-8">
          <form @submit.prevent="handleLogin">
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Username</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <i class="fas fa-user text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    v-model="username"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Masukkan username Anda"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Password</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <i class="fas fa-lock text-gray-400"></i>
                  </div>
                  <input
                    type="password"
                    v-model="password"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Masukkan password Anda"
                    required
                  />
                </div>
              </div>

              <div class="pt-4">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <span
                    v-if="isLoading"
                    class="loading loading-spinner mr-3"
                  ></span>
                  <span v-else><i class="fas fa-sign-in-alt mr-2"></i></span>
                  <span>{{
                    isLoading ? "Sedang memproses..." : "Masuk ke Dashboard"
                  }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
          <p class="text-gray-500 text-sm">
            Lupa password? Hubungi admin di
            <a href="#" class="text-indigo-600 hover:underline"
              >admin@koperasi.com</a
            >
          </p>
        </div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-gray-500">
          © 2023 Koperasi Digital. Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMemberAuthStore } from "@/stores/memberAuth.store.js";
import { useToast } from "vue-toastification";

const username = ref("");
const password = ref("");
const isLoading = ref(false);
const router = useRouter();
const memberAuthStore = useMemberAuthStore();
const toast = useToast();

const handleLogin = async () => {
  isLoading.value = true;
  try {
    await memberAuthStore.login({
      username: username.value,
      password: password.value,
    });
    // Arahkan ke dasbor anggota setelah login berhasil
    router.push("/member/dashboard");
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Login gagal. Periksa username dan password Anda."
    );
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.loading {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, #f0f4ff, #ffffff);
}
</style>
