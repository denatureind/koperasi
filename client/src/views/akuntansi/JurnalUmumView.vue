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
          <i class="fas fa-book text-indigo-600"></i>
          Jurnal Umum
        </h1>
        <p class="text-gray-500 mt-1">
          Menampilkan semua transaksi berdasarkan periode yang dipilih
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
          @click="printJurnal"
        >
          <i class="fas fa-print"></i>
          <span>Cetak Jurnal</span>
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
      <p class="text-gray-600 font-medium">Memuat data jurnal...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="listJurnal.length === 0"
      class="bg-white rounded-xl border border-gray-200 p-8 text-center"
    >
      <i class="fas fa-inbox text-4xl text-gray-300 mb-4"></i>
      <h3 class="text-lg font-medium text-gray-700 mb-1">
        Tidak ada data jurnal
      </h3>
      <p class="text-gray-500 mb-6">
        Coba pilih periode lain atau tambahkan transaksi baru
      </p>
      <router-link
        to="/pembukuan/jurnal-umum/tambah"
        class="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md mx-auto w-fit"
      >
        <i class="fas fa-plus mr-2"></i>
        Tambah Transaksi
      </router-link>
    </div>

    <!-- Jurnal Table -->
    <div
      v-else
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Akun
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Keterangan
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
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-for="(jurnal, index) in listJurnal" :key="jurnal.id">
              <!-- Debit Row -->
              <tr
                v-if="jurnal.debit > 0"
                class="hover:bg-indigo-50/50 transition-colors group"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="font-medium text-gray-900">
                    {{ formatDate(jurnal.tgl_transaksi) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3"
                    >
                      <i class="fas fa-wallet text-indigo-600 text-sm"></i>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">
                        {{ jurnal.kode_akun }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ jurnal.nama_akun }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ jurnal.keterangan }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600"
                >
                  {{ formatUang(jurnal.debit) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-500"
                >
                  -
                </td>
              </tr>

              <!-- Kredit Row -->
              <tr v-else class="hover:bg-amber-50/50 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <!-- Empty for alignment -->
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center pl-8">
                    <div
                      class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3"
                    >
                      <i class="fas fa-receipt text-amber-600 text-sm"></i>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">
                        {{ jurnal.kode_akun }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ jurnal.nama_akun }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ jurnal.keterangan }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-500"
                >
                  -
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-amber-600"
                >
                  {{ formatUang(jurnal.kredit) }}
                </td>
              </tr>

              <!-- Separator for transaction groups -->
              <tr v-if="shouldAddSeparator(index)" class="bg-gray-50">
                <td colspan="5" class="px-6 py-2">
                  <div class="h-px bg-gray-200"></div>
                </td>
              </tr>
            </template>
          </tbody>

          <!-- Total Row -->
          <tfoot class="bg-gray-50 border-t border-gray-200">
            <tr>
              <th
                colspan="3"
                class="px-6 py-3 text-right text-sm font-medium text-gray-900"
              >
                Total
              </th>
              <th
                class="px-6 py-3 text-right text-sm font-medium text-green-600"
              >
                {{ formatUang(totalDebit) }}
              </th>
              <th
                class="px-6 py-3 text-right text-sm font-medium text-amber-600"
              >
                {{ formatUang(totalKredit) }}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Summary Info -->
    <div
      v-if="!isLoading && listJurnal.length > 0"
      class="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm text-gray-500"
    >
      <div class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
        <i class="fas fa-info-circle text-indigo-500"></i>
        <span>Menampilkan {{ listJurnal.length }} entri jurnal</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center">
          <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span class="text-sm">Debit</span>
        </div>
        <div class="flex items-center ml-4">
          <div class="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
          <span class="text-sm">Kredit</span>
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

const listJurnal = ref([]);
const isLoading = ref(true);
const laporanStore = useLaporanStore();
const toast = useToast();

const fetchJurnal = async (periodeId) => {
  if (!periodeId) {
    isLoading.value = false;
    listJurnal.value = [];
    return;
  }
  isLoading.value = true;
  try {
    const response = await LaporanService.getJurnalUmum(periodeId);
    listJurnal.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat data jurnal.");
    listJurnal.value = [];
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (tanggal) => {
  if (!tanggal) return "-";
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatUang = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);
};

const printJurnal = () => {
  toast.info("Fitur cetak jurnal akan segera tersedia");
};

const shouldAddSeparator = (index) => {
  if (index === listJurnal.value.length - 1) return false;
  return listJurnal.value[index].id !== listJurnal.value[index + 1].id;
};

const totalDebit = computed(() => {
  return listJurnal.value.reduce((total, item) => total + (item.debit || 0), 0);
});

const totalKredit = computed(() => {
  return listJurnal.value.reduce(
    (total, item) => total + (item.kredit || 0),
    0
  );
});

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
    fetchJurnal(newId);
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

/* Striped rows */
tbody tr:nth-child(4n + 1):not(:hover) {
  background-color: #f9fafb;
}
tbody tr:nth-child(4n + 3):not(:hover) {
  background-color: #f9fafb;
}
</style>
