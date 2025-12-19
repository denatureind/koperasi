<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <div class="flex flex-col gap-6 mb-6 pb-4 border-b border-gray-200">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <i class="fas fa-book text-indigo-600"></i>
            Jurnal Umum
          </h1>
          <p class="text-gray-500 mt-1">
            Periode:
            <span class="font-semibold text-indigo-600">{{
              currentPeriodName
            }}</span>
          </p>
        </div>

        <div class="flex gap-2 w-full md:w-auto">
          <router-link
            to="/pembukuan/jurnal/tambah"
            class="btn-action bg-indigo-600 text-white hover:bg-indigo-700 justify-center w-full md:w-auto"
          >
            <i class="fas fa-plus"></i> <span class="inline">Tambah</span>
          </router-link>
          <button
            @click="printJurnal"
            class="btn-action bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 w-full md:w-auto justify-center"
          >
            <i class="fas fa-print"></i> <span class="inline">Cetak</span>
          </button>
        </div>
      </div>

      <div
        class="bg-gray-50 p-4 rounded-xl flex flex-col lg:flex-row gap-4 items-end lg:items-center"
      >
        <div class="w-full lg:flex-1">
          <label
            class="text-xs font-semibold text-gray-500 uppercase mb-1 block"
            >Cari Transaksi</label
          >
          <div class="relative">
            <i
              class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            ></i>
            <input
              type="text"
              v-model="filter.search"
              @keyup.enter="applyFilter"
              placeholder="Cari nama, keterangan, atau akun..."
              class="form-input pl-10"
            />
          </div>
        </div>

        <div class="w-full lg:w-auto">
          <label
            class="text-xs font-semibold text-gray-500 uppercase mb-1 block"
            >Dari Tanggal</label
          >
          <input type="date" v-model="filter.startDate" class="form-input" />
        </div>

        <div class="w-full lg:w-auto">
          <label
            class="text-xs font-semibold text-gray-500 uppercase mb-1 block"
            >Sampai Tanggal</label
          >
          <input type="date" v-model="filter.endDate" class="form-input" />
        </div>

        <div class="flex gap-2 w-full lg:w-auto">
          <button
            @click="applyFilter"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors flex-1 lg:flex-none justify-center flex items-center"
          >
            <i class="fas fa-filter mr-2"></i> Terapkan
          </button>
          <button
            @click="resetFilter"
            class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex-1 lg:flex-none justify-center"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative"
    >
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center"
      >
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
        ></div>
      </div>

      <div class="overflow-x-auto min-h-[300px]">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
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
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
              >
                Debit
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
              >
                Kredit
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-if="listJurnal.length > 0">
              <template v-for="(jurnal, index) in listJurnal" :key="jurnal.id">
                <tr
                  :class="jurnal.debit > 0 ? 'bg-white' : 'bg-gray-50/50'"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td
                    class="px-6 py-3 whitespace-nowrap text-sm text-gray-600 align-top"
                  >
                    <span
                      v-if="shouldShowDate(index)"
                      class="font-medium text-gray-900 block mb-1"
                      >{{ formatDate(jurnal.tgl_transaksi) }}</span
                    >
                  </td>
                  <td class="px-6 py-3 whitespace-nowrap align-top">
                    <div class="flex items-center">
                      <span
                        :class="
                          jurnal.debit > 0
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-amber-100 text-amber-700'
                        "
                        class="px-2 py-0.5 rounded text-xs font-bold mr-2"
                      >
                        {{ jurnal.kode_akun }}
                      </span>
                      <span class="text-sm text-gray-700">{{
                        jurnal.nama_akun
                      }}</span>
                    </div>
                  </td>
                  <td
                    class="px-6 py-3 text-sm text-gray-500 max-w-xs truncate align-top"
                    :title="jurnal.keterangan"
                  >
                    {{ jurnal.keterangan }}
                  </td>
                  <td
                    class="px-6 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900 align-top"
                  >
                    {{ jurnal.debit > 0 ? formatUang(jurnal.debit) : "-" }}
                  </td>
                  <td
                    class="px-6 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900 align-top"
                  >
                    {{ jurnal.kredit > 0 ? formatUang(jurnal.kredit) : "-" }}
                  </td>
                  <td class="px-6 py-3 whitespace-nowrap text-center align-top">
                    <button
                      @click="handleDelete(jurnal.id)"
                      class="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                      title="Hapus"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              </template>
            </template>
            <tr v-else>
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <i class="fas fa-search text-4xl mb-3 text-gray-300"></i>
                  <p class="font-medium">Tidak ada data ditemukan.</p>
                  <p class="text-sm text-gray-400 mt-1">
                    Coba ubah kata kunci pencarian atau filter tanggal.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="bg-white px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <span class="text-sm text-gray-700 order-2 sm:order-1">
          Menampilkan
          <span class="font-medium">{{
            (currentPage - 1) * itemsPerPage + 1
          }}</span>
          -
          <span class="font-medium">{{
            Math.min(currentPage * itemsPerPage, totalData)
          }}</span>
          dari <span class="font-medium">{{ totalData }}</span> data
        </span>
        <div
          class="flex gap-2 order-1 sm:order-2 w-full sm:w-auto justify-center"
        >
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            <i class="fas fa-chevron-left mr-1"></i> Prev
          </button>
          <div
            class="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold"
          >
            {{ currentPage }}
          </div>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Next <i class="fas fa-chevron-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useLaporanStore } from "@/stores/laporan.store.js";
import LaporanService from "@/services/laporan.service.js";
import JurnalService from "@/services/jurnal.service.js"; // Untuk Hapus
import { useToast } from "vue-toastification";

const listJurnal = ref([]);
const isLoading = ref(false);
const laporanStore = useLaporanStore();
const toast = useToast();

// Pagination & Filter State
const currentPage = ref(1);
const itemsPerPage = ref(20); // Default 20 data per halaman
const totalData = ref(0);
const filter = ref({
  startDate: "",
  endDate: "",
  search: "",
});

const totalPages = computed(() =>
  Math.ceil(totalData.value / itemsPerPage.value)
);

const currentPeriodName = computed(() => {
  if (!laporanStore.periodeAktifId || !laporanStore.periodeList.length)
    return "Belum dipilih";
  const period = laporanStore.periodeList.find(
    (p) => p.id === laporanStore.periodeAktifId
  );
  return period ? period.nama_periode : "Belum dipilih";
});

const fetchJurnal = async () => {
  if (!laporanStore.periodeAktifId) return;

  isLoading.value = true;
  try {
    const response = await LaporanService.getJurnalUmum(
      laporanStore.periodeAktifId,
      currentPage.value,
      itemsPerPage.value,
      filter.value.startDate,
      filter.value.endDate,
      filter.value.search // Kirim kata kunci pencarian
    );

    if (response.data && response.data.data) {
      listJurnal.value = response.data.data;
      totalData.value = response.data.total;
    } else {
      listJurnal.value = Array.isArray(response.data) ? response.data : [];
      totalData.value = listJurnal.value.length;
    }
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat data jurnal.");
  } finally {
    isLoading.value = false;
  }
};

const applyFilter = () => {
  currentPage.value = 1; // Reset ke halaman 1 saat filter baru
  fetchJurnal();
};

const resetFilter = () => {
  filter.value.startDate = "";
  filter.value.endDate = "";
  filter.value.search = "";
  applyFilter();
};

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    fetchJurnal();
  }
};

// Logika Hapus Data
const handleDelete = async (id) => {
  if (
    !confirm(
      "Yakin ingin menghapus jurnal ini? Neraca mungkin jadi tidak seimbang jika pasangannya tidak dihapus."
    )
  )
    return;

  try {
    await JurnalService.delete(id);
    toast.success("Berhasil dihapus");
    fetchJurnal(); // Refresh tabel
  } catch (error) {
    toast.error("Gagal menghapus");
  }
};

// Utilities
const formatDate = (date) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const formatUang = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val);

// Helper agar tanggal tidak muncul berulang-ulang jika sama
const shouldShowDate = (index) => {
  if (index === 0) return true;
  const currDate = new Date(
    listJurnal.value[index].tgl_transaksi
  ).toDateString();
  const prevDate = new Date(
    listJurnal.value[index - 1].tgl_transaksi
  ).toDateString();
  return currDate !== prevDate;
};

// Watchers
watch(
  () => laporanStore.periodeAktifId,
  () => {
    currentPage.value = 1;
    fetchJurnal();
  }
);

onMounted(() => {
  if (laporanStore.periodeAktifId) fetchJurnal();
});
</script>

<style scoped>
.btn-action {
  @apply px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2;
}
.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm;
}
</style>
