<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-200"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-balance-scale text-indigo-600"></i>
          Laporan Neraca
        </h1>
        <p class="text-gray-500 mt-1">
          Posisi Keuangan per
          {{
            new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          }}
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
          class="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
          @click="printNeraca"
        >
          <i class="fas fa-print"></i>
          <span>Cetak Neraca</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-16"
    >
      <div
        class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-gray-600 font-medium">Mempersiapkan laporan neraca...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!neracaData"
      class="bg-white rounded-xl border border-gray-200 p-8 text-center"
    >
      <i class="fas fa-file-invoice text-4xl text-gray-300 mb-4"></i>
      <h3 class="text-lg font-medium text-gray-700 mb-1">
        Data neraca tidak tersedia
      </h3>
      <p class="text-gray-500 mb-6">
        Silakan pilih periode lain atau tambahkan transaksi
      </p>
    </div>

    <!-- Neraca Content -->
    <div
      v-else
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        <!-- Aset Section -->
        <div
          class="bg-gradient-to-br from-indigo-50/50 to-white border border-indigo-100 rounded-xl shadow-sm"
        >
          <div class="bg-indigo-600 text-white px-6 py-4 rounded-t-xl">
            <h2 class="text-lg font-semibold flex items-center gap-2">
              <i class="fas fa-building"></i>
              ASET
            </h2>
          </div>
          <div class="p-4">
            <div class="divide-y divide-gray-200">
              <div
                v-for="(item, index) in neracaData.aset"
                :key="'aset-' + index"
                class="py-3 flex justify-between items-center"
              >
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3"
                  >
                    <i class="fas fa-wallet text-indigo-600 text-sm"></i>
                  </div>
                  <span class="font-medium text-gray-800">{{
                    item.nama_akun
                  }}</span>
                </div>
                <span class="font-medium text-gray-800">{{
                  formatUang(item.saldo)
                }}</span>
              </div>
            </div>
            <div
              class="mt-4 pt-4 border-t-2 border-dashed border-gray-300 flex justify-between items-center"
            >
              <span class="font-bold text-lg text-gray-800">Total Aset</span>
              <span class="font-bold text-lg text-indigo-700">{{
                formatUang(neracaData.totalAset)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Kewajiban & Modal Section -->
        <div>
          <!-- Kewajiban -->
          <div
            class="bg-gradient-to-br from-blue-50/50 to-white border border-blue-100 rounded-xl shadow-sm mb-8"
          >
            <div class="bg-blue-600 text-white px-6 py-4 rounded-t-xl">
              <h2 class="text-lg font-semibold flex items-center gap-2">
                <i class="fas fa-file-invoice-dollar"></i>
                KEWAJIBAN
              </h2>
            </div>
            <div class="p-4">
              <div class="divide-y divide-gray-200">
                <div
                  v-for="(item, index) in neracaData.kewajiban"
                  :key="'kewajiban-' + index"
                  class="py-3 flex justify-between items-center"
                >
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3"
                    >
                      <i
                        class="fas fa-hand-holding-usd text-blue-600 text-sm"
                      ></i>
                    </div>
                    <span class="font-medium text-gray-800">{{
                      item.nama_akun
                    }}</span>
                  </div>
                  <span class="font-medium text-gray-800">{{
                    formatUang(item.saldo)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal -->
          <div
            class="bg-gradient-to-br from-purple-50/50 to-white border border-purple-100 rounded-xl shadow-sm"
          >
            <div class="bg-purple-600 text-white px-6 py-4 rounded-t-xl">
              <h2 class="text-lg font-semibold flex items-center gap-2">
                <i class="fas fa-chart-line"></i>
                MODAL
              </h2>
            </div>
            <div class="p-4">
              <div class="divide-y divide-gray-200">
                <div
                  v-for="(item, index) in neracaData.modal"
                  :key="'modal-' + index"
                  class="py-3 flex justify-between items-center"
                >
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3"
                    >
                      <i class="fas fa-landmark text-purple-600 text-sm"></i>
                    </div>
                    <span class="font-medium text-gray-800">{{
                      item.nama_akun
                    }}</span>
                  </div>
                  <span class="font-medium text-gray-800">{{
                    formatUang(item.saldo)
                  }}</span>
                </div>

                <!-- Pendapatan -->
                <div class="pt-4 mt-2">
                  <h3 class="text-sm font-semibold text-gray-500 mb-2">
                    PENDAPATAN
                  </h3>
                  <div
                    v-for="(item, index) in neracaData.pendapatan"
                    :key="'pendapatan-' + index"
                    class="py-2 pl-8 flex justify-between items-center"
                  >
                    <div class="flex items-center">
                      <i class="fas fa-circle text-xs text-green-500 mr-2"></i>
                      <span class="text-gray-700">{{ item.nama_akun }}</span>
                    </div>
                    <span class="font-medium text-gray-800">{{
                      formatUang(item.saldo)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Kewajiban & Modal -->
          <div
            class="mt-6 pt-4 border-t-2 border-dashed border-gray-300 flex justify-between items-center"
          >
            <span class="font-bold text-lg text-gray-800"
              >Total Kewajiban & Modal</span
            >
            <span class="font-bold text-lg text-purple-700">{{
              formatUang(neracaData.totalKewajibanDanModal)
            }}</span>
          </div>
        </div>
      </div>

      <!-- Balance Status -->
      <div
        v-if="neracaData.totalAset === neracaData.totalKewajibanDanModal"
        class="bg-green-50 border-t border-green-200 p-4 text-center"
      >
        <div class="flex items-center justify-center text-green-700">
          <i class="fas fa-check-circle text-xl mr-2"></i>
          <span class="font-semibold"
            >Neraca Seimbang: Aset = Kewajiban + Modal</span
          >
        </div>
      </div>
      <div v-else class="bg-rose-50 border-t border-rose-200 p-4 text-center">
        <div class="flex items-center justify-center text-rose-700">
          <i class="fas fa-exclamation-triangle text-xl mr-2"></i>
          <span class="font-semibold"
            >Neraca Tidak Seimbang: Periksa Kembali Data</span
          >
        </div>
      </div>
    </div>

    <!-- Summary Footer -->
    <div
      v-if="!isLoading && neracaData"
      class="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm text-gray-500"
    >
      <div class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
        <i class="fas fa-info-circle text-indigo-500"></i>
        <span>Laporan neraca periode {{ currentPeriodName }}</span>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center">
          <div class="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
          <span class="text-sm">Aset</span>
        </div>
        <div class="flex items-center ml-4">
          <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span class="text-sm">Kewajiban</span>
        </div>
        <div class="flex items-center ml-4">
          <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
          <span class="text-sm">Modal</span>
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

const neracaData = ref(null);
const isLoading = ref(true);
const laporanStore = useLaporanStore();
const toast = useToast();

const fetchNeraca = async (periodeId) => {
  if (!periodeId) {
    isLoading.value = false;
    neracaData.value = null;
    return;
  }

  isLoading.value = true;
  try {
    const response = await LaporanService.getNeraca(periodeId);
    neracaData.value = response.data;
  } catch (error) {
    console.error("Error mengambil data neraca:", error);
    toast.error("Gagal memuat data neraca");
    neracaData.value = null;
  } finally {
    isLoading.value = false;
  }
};

const formatUang = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);
};

const printNeraca = () => {
  toast.info("Fitur cetak neraca akan segera tersedia");
};

const currentPeriodName = computed(() => {
  if (!laporanStore.periodeAktifId || !laporanStore.periodeList.length)
    return "Belum dipilih";

  const period = laporanStore.periodeList.find(
    (p) => p.id === laporanStore.periodeAktifId
  );

  return period ? period.nama_periode : "Belum dipilih";
});

watch(
  () => laporanStore.periodeAktifId,
  (newId) => {
    fetchNeraca(newId);
  },
  { immediate: true }
);
</script>

<style scoped>
/* Animations */
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
