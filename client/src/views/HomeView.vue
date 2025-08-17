<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <i class="fas fa-tachometer-alt text-indigo-600"></i>
        Dashboard Koperasi
      </h1>
      <p class="text-gray-500 mt-1">
        Ringkasan kinerja dan aktivitas terkini koperasi Anda
      </p>
    </div>

    <div
      v-if="summary"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <div
        class="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-5 shadow-sm"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="bg-indigo-100 p-3 rounded-xl">
            <i class="fas fa-users text-indigo-600 text-xl"></i>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">Anggota Aktif</div>
            <div class="text-2xl font-bold text-gray-800">
              {{ summary.totalAnggota }}
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-5 shadow-sm"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="bg-green-100 p-3 rounded-xl">
            <i class="fas fa-piggy-bank text-green-600 text-xl"></i>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">Total Simpanan</div>
            <div class="text-2xl font-bold text-gray-800">
              {{ formatUang(summary.totalSimpanan) }}
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-xl p-5 shadow-sm"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="bg-amber-100 p-3 rounded-xl">
            <i class="fas fa-hand-holding-usd text-amber-600 text-xl"></i>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">Pinjaman Aktif</div>
            <div class="text-2xl font-bold text-gray-800">
              {{ formatUang(summary.totalPinjaman) }}
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-5 shadow-sm"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="bg-blue-100 p-3 rounded-xl">
            <i class="fas fa-chart-line text-blue-600 text-xl"></i>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">SHU Tahun Ini</div>
            <div class="text-2xl font-bold text-gray-800">
              {{ formatUang(summary.shuSaatIni) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse"
    >
      <div v-for="i in 4" :key="i" class="bg-gray-200 rounded-xl h-28"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DashboardService from "@/services/dashboard.service.js";
import { useToast } from "vue-toastification";

const summary = ref(null);
const toast = useToast();

const formatUang = (angka) => {
  if (typeof angka !== "number") return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

onMounted(async () => {
  try {
    const response = await DashboardService.getSummary();
    summary.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat data ringkasan dasbor.");
    console.error("Error fetching dashboard summary:", error);
  }
});
</script>
