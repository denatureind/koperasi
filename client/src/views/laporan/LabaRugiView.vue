<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-200"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-chart-line text-indigo-600"></i>
          Laporan Laba Rugi
        </h1>
        <p class="text-gray-500 mt-1">
          Perhitungan Hasil Usaha untuk periode yang dipilih
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div
          class="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100"
        >
          <span class="text-sm text-indigo-700 font-medium">
            Periode: {{ currentPeriodName }}
          </span>
        </div>
        <button
          @click="handleExport"
          :disabled="!laporanStore.periodeAktifId || isExporting"
          class="btn btn-success btn-sm"
        >
          <span
            v-if="isExporting"
            class="loading loading-spinner loading-xs"
          ></span>
          <i v-else class="fas fa-file-excel mr-2"></i>
          {{ isExporting ? "Mengekspor..." : "Download Excel" }}
        </button>
        <button class="btn btn-primary btn-sm" @click="printLaporan">
          <i class="fas fa-print"></i>
          <span>Cetak Laporan</span>
        </button>
      </div>
    </div>

    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-16"
    >
      <div
        class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-gray-600 font-medium">Memuat data laporan...</p>
    </div>

    <div
      v-else-if="!laporanData"
      class="bg-white rounded-xl border border-gray-200 p-8 text-center"
    >
      <i class="fas fa-chart-pie text-4xl text-gray-300 mb-4"></i>
      <h3 class="text-lg font-medium text-gray-700 mb-1">
        Data laporan tidak tersedia
      </h3>
      <p class="text-gray-500 mb-6">
        Coba pilih periode lain atau tambahkan transaksi
      </p>
    </div>

    <div v-else class="space-y-6">
      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h4 class="text-lg font-medium text-gray-800">Pendapatan</h4>
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-for="(item, index) in laporanData.pendapatan"
            :key="'pendapatan-' + index"
            class="px-6 py-4 flex justify-between hover:bg-indigo-50/50 transition-colors"
          >
            <div class="flex items-center">
              <div
                class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3"
              >
                <i class="fas fa-arrow-down text-green-600 text-sm"></i>
              </div>
              <div>
                <div class="font-medium text-gray-900">
                  {{ item.nama_akun }}
                </div>
              </div>
            </div>
            <div class="text-right text-green-600 font-medium">
              {{ formatUang(item.total) }}
            </div>
          </div>
          <div
            class="px-6 py-4 bg-gray-50 flex justify-between border-t border-gray-300"
          >
            <div class="font-bold text-gray-900">Total Pendapatan</div>
            <div class="text-right font-bold text-green-600">
              {{ formatUang(laporanData.totalPendapatan) }}
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h4 class="text-lg font-medium text-gray-800">Beban</h4>
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-for="(item, index) in laporanData.beban"
            :key="'beban-' + index"
            class="px-6 py-4 flex justify-between hover:bg-amber-50/50 transition-colors"
          >
            <div class="flex items-center">
              <div
                class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3"
              >
                <i class="fas fa-arrow-up text-amber-600 text-sm"></i>
              </div>
              <div>
                <div class="font-medium text-gray-900">
                  {{ item.nama_akun }}
                </div>
              </div>
            </div>
            <div class="text-right text-amber-600 font-medium">
              {{ formatUang(item.total) }}
            </div>
          </div>
          <div
            class="px-6 py-4 bg-gray-50 flex justify-between border-t border-gray-300"
          >
            <div class="font-bold text-gray-900">Total Beban</div>
            <div class="text-right font-bold text-amber-600">
              {{ formatUang(laporanData.totalBeban) }}
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div
          class="px-6 py-4 flex justify-between"
          :class="laporanData.labaRugi >= 0 ? 'bg-green-50' : 'bg-red-50'"
        >
          <div class="font-bold text-lg text-gray-900">
            Sisa Hasil Usaha ({{ laporanData.labaRugi >= 0 ? "Laba" : "Rugi" }})
          </div>
          <div
            class="text-right font-bold text-lg"
            :class="
              laporanData.labaRugi >= 0 ? 'text-green-600' : 'text-red-600'
            "
          >
            {{ formatUang(laporanData.labaRugi) }}
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4 text-sm text-gray-500 mt-6">
        <div class="flex items-center">
          <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span>Pendapatan</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
          <span>Beban</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useLaporanStore } from "@/stores/laporan.store.js";
import LaporanService from "@/services/laporan.service.js";
import { useToast } from "vue-toastification";

const laporanData = ref(null);
const isLoading = ref(true);
const isExporting = ref(false);
const laporanStore = useLaporanStore();
const toast = useToast();

const fetchLabaRugi = async (periodeId) => {
  if (!periodeId) {
    laporanData.value = null;
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  try {
    const response = await LaporanService.getLabaRugi(periodeId);
    laporanData.value = response.data;
  } catch (error) {
    console.error("Error mengambil data laba rugi:", error);
    toast.error("Gagal memuat data laba rugi.");
  } finally {
    isLoading.value = false;
  }
};

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);

const currentPeriodName = computed(() => {
  if (!laporanStore.periodeAktifId || !laporanStore.periodeList.length)
    return "Belum dipilih";
  const period = laporanStore.periodeList.find(
    (p) => p.id === laporanStore.periodeAktifId
  );
  return period ? period.nama_periode : "Belum dipilih";
});

const printLaporan = () => {
  toast.info("Fitur cetak laporan akan segera tersedia");
};

const handleExport = async () => {
  if (!laporanStore.periodeAktifId) {
    toast.error("Silakan pilih periode terlebih dahulu.");
    return;
  }
  isExporting.value = true;
  try {
    // PERBAIKAN: Mengganti 'LaporansebagaiService' dengan 'LaporanService'
    const response = await LaporanService.exportLabaRugi(
      laporanStore.periodeAktifId
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Laporan_Laba_Rugi.xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Laporan berhasil diunduh.");
  } catch (error) {
    toast.error("Gagal mengunduh laporan.");
    console.error("Error saat ekspor:", error);
  } finally {
    isExporting.value = false;
  }
};

watch(
  () => laporanStore.periodeAktifId,
  (newId) => {
    fetchLabaRugi(newId);
  },
  { immediate: true }
);
</script>

<style scoped>
/* Animasi untuk transisi */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
