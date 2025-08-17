<template>
  <div
    class="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50"
  >
    <!-- Modern Gradient Header -->
    <header
      class="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg sticky top-0 z-10"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo & Brand with Glassmorphism Effect -->
          <div class="flex items-center space-x-3">
            <div class="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-md"
              >
                <i class="fas fa-cooperative text-white text-xl"></i>
              </div>
            </div>
            <span class="text-xl font-bold text-white tracking-wide">
              <span class="text-blue-200">Koperasi</span> BinaMakmur
            </span>
          </div>

          <!-- User Info & Actions -->
          <div class="flex items-center">
            <div class="relative group">
              <button
                class="flex items-center space-x-2 focus:outline-none transition-all hover:scale-105"
              >
                <div class="relative">
                  <div
                    class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center shadow-md"
                  >
                    <i class="fas fa-user text-white"></i>
                  </div>
                  <div
                    class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white"
                  ></div>
                </div>
                <span
                  class="hidden md:block font-medium text-blue-100 bg-blue-500/30 px-3 py-1 rounded-full"
                >
                  {{ memberAuthStore.user?.nama || "Member" }}
                  <i class="fas fa-chevron-down ml-1 text-xs"></i>
                </span>
              </button>

              <!-- Dropdown Menu with Glassmorphism -->
              <div
                class="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl py-1 hidden group-hover:block z-10 border border-blue-100 transform transition-all duration-300 origin-top-right scale-95 group-hover:scale-100"
              >
                <div class="px-4 py-2 border-b border-blue-100">
                  <p class="text-xs text-blue-500">Terakhir login:</p>
                  <p class="text-sm font-medium text-gray-700">
                    Hari ini, 15:30
                  </p>
                </div>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 flex items-center"
                >
                  <i class="fas fa-sign-out-alt mr-3 text-red-500"></i>
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 pb-20">
      <router-view />
    </main>

    <!-- Modern Glassmorphism Footer -->
    <footer
      class="bg-gradient-to-r from-blue-600 to-indigo-700 border-t border-blue-300/50 mt-auto"
    >
      <div class="max-w-3xl mx-auto px-4 py-4">
        <div class="flex flex-col items-center text-center">
          <p class="text-sm text-blue-100">
            &copy; {{ new Date().getFullYear() }} Koperasi BinaMakmur
          </p>
          <p class="text-xs text-blue-200 mt-1">
            Developed with <i class="fas fa-heart text-red-300 mx-0.5"></i> by
            Lulu Sofi K
          </p>
          <p class="text-xs text-blue-200 mt-1">
            Designing tomorrow, today – by Lulu Sofi Kurniawan
          </p>
        </div>
      </div>
    </footer>

    <!-- Enhanced Mobile Bottom Navigation -->
    <div
      class="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-blue-200 shadow-lg z-20"
    >
      <div class="flex justify-around py-2">
        <router-link
          to="/member/dashboard"
          class="flex flex-col items-center text-gray-600 group relative pt-1 px-4"
          active-class="text-indigo-600"
        >
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center group-[.router-link-active]:bg-gradient-to-r group-[.router-link-active]:from-blue-500 group-[.router-link-active]:to-indigo-500 group-[.router-link-active]:text-white transition-all duration-300 mb-1"
          >
            <i
              class="fas fa-home text-xl group-[.router-link-active]:text-white"
            ></i>
          </div>
          <span
            class="text-xs font-medium group-[.router-link-active]:text-indigo-600 group-[.router-link-active]:font-bold"
            >Beranda</span
          >
          <div
            class="absolute top-0 w-1 h-1 rounded-full bg-indigo-600 opacity-0 group-[.router-link-active]:opacity-100 transition-opacity"
          ></div>
        </router-link>

        <router-link
          to="/member/simpanan"
          class="flex flex-col items-center text-gray-600 group relative pt-1 px-4"
          active-class="text-indigo-600"
        >
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center group-[.router-link-active]:bg-gradient-to-r group-[.router-link-active]:from-blue-500 group-[.router-link-active]:to-indigo-500 group-[.router-link-active]:text-white transition-all duration-300 mb-1"
          >
            <i
              class="fas fa-wallet text-xl group-[.router-link-active]:text-white"
            ></i>
          </div>
          <span
            class="text-xs font-medium group-[.router-link-active]:text-indigo-600 group-[.router-link-active]:font-bold"
            >Simpanan</span
          >
          <div
            class="absolute top-0 w-1 h-1 rounded-full bg-indigo-600 opacity-0 group-[.router-link-active]:opacity-100 transition-opacity"
          ></div>
        </router-link>

        <router-link
          to="/member/pinjaman"
          class="flex flex-col items-center text-gray-600 group relative pt-1 px-4"
          active-class="text-indigo-600"
        >
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center group-[.router-link-active]:bg-gradient-to-r group-[.router-link-active]:from-blue-500 group-[.router-link-active]:to-indigo-500 group-[.router-link-active]:text-white transition-all duration-300 mb-1"
          >
            <i
              class="fas fa-hand-holding-usd text-xl group-[.router-link-active]:text-white"
            ></i>
          </div>
          <span
            class="text-xs font-medium group-[.router-link-active]:text-indigo-600 group-[.router-link-active]:font-bold"
            >Pinjaman</span
          >
          <div
            class="absolute top-0 w-1 h-1 rounded-full bg-indigo-600 opacity-0 group-[.router-link-active]:opacity-100 transition-opacity"
          ></div>
        </router-link>

        <router-link
          to="/member/shu"
          class="flex flex-col items-center text-gray-600 group relative pt-1 px-4"
          active-class="text-indigo-600"
        >
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center group-[.router-link-active]:bg-gradient-to-r group-[.router-link-active]:from-blue-500 group-[.router-link-active]:to-indigo-500 group-[.router-link-active]:text-white transition-all duration-300 mb-1"
          >
            <i
              class="fas fa-chart-pie text-xl group-[.router-link-active]:text-white"
            ></i>
          </div>
          <span
            class="text-xs font-medium group-[.router-link-active]:text-indigo-600 group-[.router-link-active]:font-bold"
            >SHU</span
          >
          <div
            class="absolute top-0 w-1 h-1 rounded-full bg-indigo-600 opacity-0 group-[.router-link-active]:opacity-100 transition-opacity"
          ></div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useMemberAuthStore } from "@/stores/memberAuth.store.js";

const memberAuthStore = useMemberAuthStore();
const router = useRouter();

const handleLogout = () => {
  memberAuthStore.logout();
  router.push("/member/login");
};
</script>

<style scoped>
/* Smooth transitions for interactive elements */
header,
footer,
.router-link {
  transition: all 0.3s ease;
}

/* Enhanced dropdown animation */
.group:hover .group-hover\:block {
  display: block;
  animation: fadeIn 0.3s ease;
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

/* Mobile bottom navigation styling */
@media (max-width: 768px) {
  /* Active indicator animation */
  .group[class*="router-link-active"] div:last-child {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
}
</style>
