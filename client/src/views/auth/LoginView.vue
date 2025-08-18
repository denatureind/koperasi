<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
  >
    <div class="max-w-md w-full px-4">
      <div class="text-center mb-10">
        <div
          class="mx-auto w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <i class="fas fa-calculator text-white text-4xl"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mt-6">Selamat Datang</h1>
        <p class="text-gray-500 mt-2">Silakan masuk untuk melanjutkan</p>
      </div>

      <div
        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div class="p-8">
          <form @submit.prevent="handleLogin">
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Login Sebagai</label
                >
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="radio"
                      id="role-pengurus"
                      value="pengurus"
                      v-model="role"
                      class="hidden peer"
                    />
                    <label
                      for="role-pengurus"
                      class="flex items-center justify-center p-3 border rounded-lg cursor-pointer text-sm font-medium peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-checked:border-indigo-300 transition-colors"
                    >
                      <i class="fas fa-user-shield mr-2"></i> Pengurus
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="role-anggota"
                      value="anggota"
                      v-model="role"
                      class="hidden peer"
                    />
                    <label
                      for="role-anggota"
                      class="flex items-center justify-center p-3 border rounded-lg cursor-pointer text-sm font-medium peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-checked:border-indigo-300 transition-colors"
                    >
                      <i class="fas fa-user mr-2"></i> Anggota
                    </label>
                  </div>
                </div>
              </div>

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
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                    placeholder="Masukkan username"
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
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                    placeholder="Masukkan password"
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
                  <span>{{ isLoading ? "Memproses..." : "Login" }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.js";
import { useMemberAuthStore } from "@/stores/memberAuth.store.js";
import { useToast } from "vue-toastification";

const role = ref("pengurus"); // Default role
const username = ref("");
const password = ref("");
const isLoading = ref(false);

const router = useRouter();
const authStore = useAuthStore();
const memberAuthStore = useMemberAuthStore();
const toast = useToast();

const handleLogin = async () => {
  isLoading.value = true;
  try {
    const credentials = {
      username: username.value,
      password: password.value,
    };

    if (role.value === "pengurus") {
      await authStore.login(credentials);
      router.push("/"); // Arahkan ke dasbor admin
    } else {
      // Role 'anggota'
      await memberAuthStore.login(credentials);
      router.push("/member/dashboard"); // Arahkan ke dasbor anggota
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Login gagal. Periksa kembali data Anda."
    );
  } finally {
    isLoading.value = false;
  }
};
</script>
