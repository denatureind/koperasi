<template>
  <div>
    <!-- Stats Overview -->
    <div class="px-4 pt-4">
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div
          class="bg-gradient-to-br from-white to-blue-50 rounded-xl p-3 shadow-md border border-blue-100"
        >
          <p class="text-xs text-gray-500">Total Simpanan</p>
          <p class="font-bold text-indigo-600">
            {{ formatCompact(summary?.simpanan.total) }}
          </p>
        </div>
        <div
          class="bg-gradient-to-br from-white to-rose-50 rounded-xl p-3 shadow-md border border-rose-100"
        >
          <p class="text-xs text-gray-500">Pinjaman Aktif</p>
          <p class="font-bold text-rose-600">
            {{ formatCompact(summary?.pinjaman.totalAktif) }}
          </p>
        </div>
        <div
          class="bg-gradient-to-br from-white to-teal-50 rounded-xl p-3 shadow-md border border-teal-100"
        >
          <p class="text-xs text-gray-500">SHU Tahun Ini</p>
          <p class="font-bold text-teal-600">
            {{ formatCompact(summary?.shu.totalTerakhir) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Cards Section -->
    <div class="px-4 space-y-4">
      <!-- Simpanan Card -->
      <div
        class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-sm overflow-hidden border border-blue-100"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-100 flex items-center justify-center"
              >
                <i class="fas fa-wallet text-indigo-500 text-lg"></i>
              </div>
              <h2 class="font-semibold text-gray-800">Simpanan Saya</h2>
            </div>
            <router-link
              to="/member/simpanan"
              class="text-indigo-500 text-sm flex items-center hover:text-indigo-700 transition-colors"
            >
              Lihat semua <i class="fas fa-chevron-right ml-1 text-xs"></i>
            </router-link>
          </div>

          <div class="space-y-3">
            <div
              v-for="item in summary?.simpanan.rincian"
              :key="item.jenis"
              class="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-50 hover:bg-blue-50 transition-colors"
            >
              <div class="flex items-center space-x-2">
                <div
                  :class="`w-8 h-8 rounded-full ${
                    getSimpananColor(item.jenis).bg
                  } flex items-center justify-center`"
                >
                  <i
                    :class="`${getSimpananColor(item.jenis).icon} text-sm`"
                  ></i>
                </div>
                <span class="text-sm font-medium text-gray-700">{{
                  item.jenis
                }}</span>
              </div>
              <span class="font-bold text-gray-800">{{
                formatUang(item.saldo)
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pinjaman Card -->
      <div
        class="bg-gradient-to-br from-white to-rose-50 rounded-2xl shadow-sm overflow-hidden border border-rose-100"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-r from-rose-50 to-pink-100 flex items-center justify-center"
              >
                <i class="fas fa-hand-holding-usd text-rose-500 text-lg"></i>
              </div>
              <h2 class="font-semibold text-gray-800">Pinjaman Saya</h2>
            </div>
            <router-link
              to="/member/pinjaman"
              class="text-rose-500 text-sm flex items-center hover:text-rose-700 transition-colors"
            >
              Lihat semua <i class="fas fa-chevron-right ml-1 text-xs"></i>
            </router-link>
          </div>

          <div
            v-if="summary?.pinjaman.angsuranBerikutnya"
            class="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200"
          >
            <div class="flex items-center space-x-2 mb-2">
              <i class="fas fa-calendar-check text-amber-500"></i>
              <span class="text-sm font-medium text-amber-700"
                >Angsuran Berikutnya</span
              >
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">{{
                formatShortDate(summary.pinjaman.angsuranBerikutnya.tanggal)
              }}</span>
              <span class="font-bold text-rose-600">{{
                formatUang(summary.pinjaman.angsuranBerikutnya.jumlah)
              }}</span>
            </div>
          </div>
          <div
            v-else
            class="text-center py-4 text-sm text-gray-400 bg-gray-50 rounded-lg"
          >
            Tidak ada pinjaman aktif
          </div>
        </div>
      </div>

      <!-- SHU Card -->
      <div
        class="bg-gradient-to-br from-white to-teal-50 rounded-2xl shadow-sm overflow-hidden border border-teal-100"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-2">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-100 flex items-center justify-center"
              >
                <i class="fas fa-chart-pie text-teal-500 text-lg"></i>
              </div>
              <h2 class="font-semibold text-gray-800">Sisa Hasil Usaha</h2>
            </div>
            <router-link
              to="/member/shu"
              class="text-teal-500 text-sm flex items-center hover:text-teal-700 transition-colors"
            >
              Riwayat <i class="fas fa-chevron-right ml-1 text-xs"></i>
            </router-link>
          </div>

          <div
            class="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-200"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-gray-600">Terakhir diterima</span>
              <span
                class="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full"
              >
                {{ formatShortDate(summary?.shu.tanggalTerakhir) }}
              </span>
            </div>
            <div class="flex items-end justify-between">
              <div>
                <p class="text-xs text-gray-500">Total SHU</p>
                <p class="font-bold text-teal-600 text-lg">
                  {{ formatUang(summary?.shu.totalTerakhir) }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500">Periode</p>
                <p class="text-sm font-medium">
                  {{ formatYear(summary?.shu.periodeTerakhir) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="!summary"
      class="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50"
    >
      <div
        class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
      ></div>
      <p class="mt-4 text-gray-600">Memuat data...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"; // Hapus computed yang tidak digunakan
import { useToast } from "vue-toastification";
import MemberService from "@/services/member.service.js";

const summary = ref(null);
const toast = useToast();

// Formatting functions
const formatUang = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);
};

const formatCompact = (angka) => {
  if (!angka) return "-";
  if (angka >= 1000000000) {
    return (angka / 1000000000).toFixed(1) + "M";
  }
  if (angka >= 1000000) {
    return (angka / 1000000).toFixed(1) + "Jt";
  }
  if (angka >= 1000) {
    return (angka / 1000).toFixed(1) + "Rb";
  }
  return formatUang(angka);
};

const formatShortDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
};

const formatYear = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
  });
};

const getSimpananColor = (jenis) => {
  const colors = {
    Pokok: { bg: "bg-blue-100", icon: "fas fa-key text-blue-600" },
    Wajib: { bg: "bg-purple-100", icon: "fas fa-check-circle text-purple-600" },
    Sukarela: { bg: "bg-green-100", icon: "fas fa-heart text-green-600" },
    Lebaran: { bg: "bg-amber-100", icon: "fas fa-gift text-amber-600" },
  };
  return (
    colors[jenis] || { bg: "bg-gray-100", icon: "fas fa-wallet text-gray-600" }
  );
};

// Fetch data
onMounted(async () => {
  try {
    const response = await MemberService.getDashboardSummary();
    summary.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat data dashboard");
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
</style>
