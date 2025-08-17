<template>
  <div class="fade-in">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
            Buku Besar
          </h1>
          <p class="text-gray-500 mt-1 max-w-3xl">
            Ringkasan saldo akhir untuk setiap akun pada periode terpilih
          </p>
        </div>
        <div class="flex gap-3">
          <div
            class="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg flex items-center"
          >
            <i class="fas fa-calendar-alt mr-2"></i>
            <span>{{
              laporanStore.periodeAktif?.nama_periode || "Periode belum dipilih"
            }}</span>
          </div>
        </div>
      </div>
      <div class="w-16 h-1 bg-indigo-600 rounded-full mt-4"></div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      <div
        class="bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-100 rounded-xl p-5 shadow-sm"
      >
        <div class="text-indigo-600 font-medium mb-2">Total Debit</div>
        <div class="text-2xl font-bold text-gray-800">
          {{ formatUang(totalDebit) }}
        </div>
      </div>
      <div
        class="bg-gradient-to-r from-rose-50 to-rose-100 border border-rose-100 rounded-xl p-5 shadow-sm"
      >
        <div class="text-rose-600 font-medium mb-2">Total Kredit</div>
        <div class="text-2xl font-bold text-gray-800">
          {{ formatUang(totalKredit) }}
        </div>
      </div>
      <div
        class="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-100 rounded-xl p-5 shadow-sm"
      >
        <div class="text-emerald-600 font-medium mb-2">Saldo Akhir</div>
        <div class="text-2xl font-bold text-gray-800">
          {{ formatUang(totalSaldo) }}
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div
      class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kode Akun
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Akun
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Debit
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kredit
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Saldo Akhir
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loading State -->
            <tr v-if="isLoading">
              <td colspan="5" class="px-6 py-8 text-center">
                <div class="flex justify-center items-center">
                  <i
                    class="fas fa-circle-notch fa-spin text-2xl text-indigo-600 mr-3"
                  ></i>
                  <span class="text-gray-600">Memuat data buku besar...</span>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
              v-for="akun in daftarAkun"
              :key="akun.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm font-medium"
                >
                  {{ akun.kode }}
                </span>
              </td>
              <td class="px-6 py-4">
                <router-link
                  :to="`/pembukuan/buku-besar/${akun.id}`"
                  class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center"
                >
                  {{ akun.nama_akun }}
                  <i class="fas fa-chevron-right text-xs ml-2 opacity-70"></i>
                </router-link>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-gray-700 font-medium"
              >
                {{ formatUang(akun.total_debit) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-gray-700 font-medium"
              >
                {{ formatUang(akun.total_kredit) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <span
                  :class="{
                    'text-emerald-600 font-bold': akun.saldo_akhir > 0,
                    'text-rose-600 font-bold': akun.saldo_akhir < 0,
                    'text-gray-700 font-bold': akun.saldo_akhir === 0,
                  }"
                >
                  {{ formatUang(akun.saldo_akhir) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!isLoading && daftarAkun.length === 0"
      class="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center mt-6"
    >
      <div class="mx-auto max-w-md">
        <div
          class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-book text-2xl text-indigo-600"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-1">
          Belum ada data buku besar
        </h3>
        <p class="text-gray-500 mb-6">
          Tidak ditemukan data buku besar untuk periode terpilih
        </p>
        <button
          @click="fetchData(laporanStore.periodeAktifId)"
          class="btn bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <i class="fas fa-sync-alt mr-2"></i> Muat Ulang Data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useLaporanStore } from "@/stores/laporan.store.js";
import LaporanService from "@/services/laporan.service.js";
import { useToast } from "vue-toastification";

const daftarAkun = ref([]);
const isLoading = ref(true);
const laporanStore = useLaporanStore();
const toast = useToast();

// Komputasi untuk nilai total
const totalDebit = computed(() =>
  daftarAkun.value.reduce((sum, akun) => sum + akun.total_debit, 0)
);

const totalKredit = computed(() =>
  daftarAkun.value.reduce((sum, akun) => sum + akun.total_kredit, 0)
);

const totalSaldo = computed(() =>
  daftarAkun.value.reduce((sum, akun) => sum + akun.saldo_akhir, 0)
);

const fetchData = async (periodeId) => {
  if (!periodeId) {
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  try {
    const response = await LaporanService.getBukuBesarSummary(periodeId);
    daftarAkun.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat ringkasan buku besar.");
  } finally {
    isLoading.value = false;
  }
};

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(angka || 0);

watch(
  () => laporanStore.periodeAktifId,
  (newId) => {
    fetchData(newId);
  },
  { immediate: true }
);
</script>

<style scoped>
/* Animasi untuk fade-in */
.fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

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

/* Efek hover pada link */
a {
  transition: color 0.2s ease;
}

/* Garis pemisah tabel yang lebih halus */
table tbody tr:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}
</style>
