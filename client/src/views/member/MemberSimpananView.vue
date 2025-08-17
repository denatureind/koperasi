<template>
  <div class="px-4 py-6">
    <!-- Header Section -->
    <div class="mb-8 text-center">
      <div
        class="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
      >
        <i class="fas fa-piggy-bank text-white text-2xl"></i>
      </div>
      <h1 class="text-2xl font-bold text-gray-800 mt-4">
        Rekening Simpanan Saya
      </h1>
      <p class="text-gray-500 mt-2 max-w-md mx-auto">
        Pilih rekening untuk melihat riwayat transaksi dan detail simpanan
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-12"
    >
      <div
        class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
      ></div>
      <p class="mt-4 text-gray-600">Memuat data rekening...</p>
    </div>

    <!-- Rekening List -->
    <div
      v-else-if="simpananData && simpananData.rekenings.length > 0"
      class="space-y-5"
    >
      <div
        v-for="rekening in simpananData.rekenings"
        :key="rekening.id"
        class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-md border border-blue-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
      >
        <div class="p-5">
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center mb-3">
                <div
                  :class="getSimpananIcon(rekening.jenis_simpanan).bg"
                  class="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                >
                  <i
                    :class="getSimpananIcon(rekening.jenis_simpanan).icon"
                    class="text-lg"
                  ></i>
                </div>
                <h2 class="text-lg font-bold text-gray-800">
                  {{ rekening.jenis_simpanan }}
                </h2>
              </div>

              <div class="ml-1">
                <p class="text-xs text-gray-500">Saldo saat ini</p>
                <p class="text-2xl font-bold text-indigo-600">
                  {{ formatUang(rekening.saldo) }}
                </p>

                <div class="mt-2 flex items-center text-sm">
                  <i class="fas fa-hashtag text-gray-400 mr-2"></i>
                  <span class="text-gray-600">ID Rek: {{ rekening.id }}</span>
                </div>
              </div>
            </div>

            <router-link
              :to="`/member/simpanan/${rekening.id}`"
              class="btn btn-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:from-blue-600 hover:to-indigo-700 flex items-center shadow-md"
            >
              Detail <i class="fas fa-arrow-right ml-2 text-xs"></i>
            </router-link>
          </div>
        </div>

        <div class="bg-blue-50 px-5 py-3 border-t border-blue-100">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Terakhir diupdate</span>
            <span class="font-medium">Hari ini, 15:30</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
    >
      <div
        class="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4"
      >
        <i class="fas fa-wallet text-blue-500 text-2xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-800">
        Belum Ada Rekening Simpanan
      </h3>
      <p class="text-gray-500 mt-2 max-w-md mx-auto">
        Saat ini Anda belum memiliki rekening simpanan aktif. Hubungi admin
        untuk informasi lebih lanjut.
      </p>
      <button
        class="btn btn-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 mt-4 hover:from-blue-600 hover:to-indigo-700"
      >
        <i class="fas fa-envelope mr-2"></i> Hubungi Admin
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import MemberService from "@/services/member.service.js";

const simpananData = ref(null);
const isLoading = ref(true);
const toast = useToast();

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);

// Get appropriate icon and color for each simpanan type
const getSimpananIcon = (jenis) => {
  const types = {
    "Simpanan Pokok": {
      bg: "bg-blue-100",
      icon: "fas fa-key text-blue-600",
    },
    "Simpanan Wajib": {
      bg: "bg-purple-100",
      icon: "fas fa-check-circle text-purple-600",
    },
    "Simpanan Sukarela": {
      bg: "bg-green-100",
      icon: "fas fa-heart text-green-600",
    },
    "Simpanan Lebaran": {
      bg: "bg-amber-100",
      icon: "fas fa-gift text-amber-600",
    },
  };

  return (
    types[jenis] || {
      bg: "bg-gray-100",
      icon: "fas fa-wallet text-gray-600",
    }
  );
};

onMounted(async () => {
  try {
    const response = await MemberService.getSimpananDetail();
    simpananData.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat data rekening simpanan.");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.animate-spin {
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

.btn {
  transition: all 0.3s ease;
  transform: translateY(0);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
}
</style>
