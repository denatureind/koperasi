<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <!-- Header Halaman -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-200"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-calculator text-indigo-600"></i>
          Perhitungan Sisa Hasil Usaha (SHU)
        </h1>
        <p class="text-gray-500 mt-1">
          Kalkulator untuk menghitung dan mengalokasikan SHU periode berjalan.
        </p>
      </div>
      <!-- Tombol Ekspor -->
      <div class="flex items-center gap-3">
        <button
          @click="exportToExcel"
          :disabled="!shuData"
          class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fas fa-file-excel"></i>
          <span>Ekspor Excel</span>
        </button>
        <div
          class="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100"
        >
          <span class="text-sm text-indigo-700 font-medium">
            Periode: {{ currentPeriodName }}
          </span>
        </div>
      </div>
    </div>

    <!-- Input Jasa Belanja -->
    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8"
    >
      <div class="px-6 py-5">
        <h3 class="text-lg font-medium text-gray-800 mb-4">
          Input Jasa Belanja yang Dikembalikan
        </h3>
        <div class="flex flex-col md:flex-row gap-4 items-end">
          <div class="space-y-1 w-full md:w-80">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Jasa Belanja (Rp)
            </label>
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >Rp</span
              >
              <input
                type="number"
                v-model="jasaBelanjaInput"
                placeholder="Contoh: 20875321"
                class="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
          <button
            @click="fetchSHU"
            :disabled="isLoading"
            class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto"
          >
            <div class="flex items-center gap-2 justify-center">
              <i v-if="!isLoading" class="fas fa-calculator"></i>
              <span>{{
                isLoading ? "Menghitung..." : "Mulai Hitung SHU"
              }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Tampilan Hasil SHU -->
    <div v-if="shuData" class="space-y-6">
      <!-- KARTU RINCIAN ALOKASI -->
      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-800">
            Rincian Alokasi Saldo Laba
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            Total Saldo Laba:
            <span class="font-bold">{{ formatRupiah(shuData.saldoLaba) }}</span>
          </p>
        </div>
        <div class="px-6 py-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              class="flex justify-between items-center p-3 bg-green-50 rounded-lg"
            >
              <div>
                <div class="font-medium">Untuk Anggota</div>
                <div class="text-sm text-gray-500">
                  {{ shuData.configs.distribusi_anggota_persen }}%
                </div>
              </div>
              <div class="font-bold text-green-700">
                {{ formatRupiah(shuData.distribusi.anggota) }}
              </div>
            </div>
            <div
              class="flex justify-between items-center p-3 bg-blue-50 rounded-lg"
            >
              <div>
                <div class="font-medium">Untuk Cadangan</div>
                <div class="text-sm text-gray-500">
                  {{ shuData.configs.distribusi_cadangan_persen }}%
                </div>
              </div>
              <div class="font-bold text-blue-700">
                {{ formatRupiah(shuData.distribusi.cadangan) }}
              </div>
            </div>
            <div
              class="flex justify-between items-center p-3 bg-purple-50 rounded-lg"
            >
              <div>
                <div class="font-medium">Untuk Dana Sosial</div>
                <div class="text-sm text-gray-500">
                  {{ shuData.configs.distribusi_sosial_persen }}%
                </div>
              </div>
              <div class="font-bold text-purple-700">
                {{ formatRupiah(shuData.distribusi.danaSosial) }}
              </div>
            </div>
            <div
              class="flex justify-between items-center p-3 bg-amber-50 rounded-lg"
            >
              <div>
                <div class="font-medium">Untuk Pengurus</div>
                <div class="text-sm text-gray-500">
                  {{ shuData.configs.distribusi_pengurus_persen }}%
                </div>
              </div>
              <div class="font-bold text-amber-700">
                {{ formatRupiah(shuData.distribusi.pengurus) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabel Rincian Anggota -->
      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-800">
            Rincian SHU per Anggota
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  @click="toggleSort"
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                >
                  Anggota <i :class="sortIcon" class="fas ml-2"></i>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  SHU Simpanan
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  SHU Pinjaman
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  SHU Belanja
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  SHU Pemerataan
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-indigo-50 text-indigo-700"
                >
                  Total Diterima
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="anggota in sortedRincianAnggota"
                :key="anggota.anggota_id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">
                    {{ anggota.nama }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ anggota.kode_anggota }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  {{ formatRupiah(anggota.shuTotalSimpanan) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  {{ formatRupiah(anggota.shuDariPinjaman) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  {{ formatRupiah(anggota.shuDariBelanja) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  {{ formatRupiah(anggota.shuPemerataan) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right font-bold text-indigo-600 bg-indigo-50"
                >
                  {{ formatRupiah(anggota.shuTotalDiterima) }}
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-100">
              <tr>
                <td
                  class="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase"
                >
                  Total Keseluruhan
                </td>
                <td
                  class="px-6 py-3 text-right text-sm font-bold text-gray-800"
                >
                  {{ formatRupiah(totals.shuSimpanan) }}
                </td>
                <td
                  class="px-6 py-3 text-right text-sm font-bold text-gray-800"
                >
                  {{ formatRupiah(totals.shuPinjaman) }}
                </td>
                <td
                  class="px-6 py-3 text-right text-sm font-bold text-gray-800"
                >
                  {{ formatRupiah(totals.shuBelanja) }}
                </td>
                <td
                  class="px-6 py-3 text-right text-sm font-bold text-gray-800"
                >
                  {{ formatRupiah(totals.shuPemerataan) }}
                </td>
                <td
                  class="px-6 py-3 text-right text-sm font-bold text-indigo-700 bg-indigo-100"
                >
                  {{ formatRupiah(totals.shuTotal) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useLaporanStore } from "@/stores/laporan.store.js";
import LaporanService from "@/services/laporan.service.js";
import { useToast } from "vue-toastification";

const shuData = ref(null);
const isLoading = ref(false);
const laporanStore = useLaporanStore();
const toast = useToast();
const jasaBelanjaInput = ref(0);
const sortOrder = ref("asc"); // 'asc' untuk A-Z, 'desc' untuk Z-A

const currentPeriodName = computed(() => {
  if (!laporanStore.periodeAktifId || !laporanStore.periodeList.length)
    return "Belum dipilih";
  const period = laporanStore.periodeList.find(
    (p) => p.id === laporanStore.periodeAktifId
  );
  return period ? period.nama_periode : "Belum dipilih";
});

// FUNGSI BARU UNTUK SORTIR
const sortedRincianAnggota = computed(() => {
  if (!shuData.value || !shuData.value.rincianAnggota) return [];
  // Buat salinan array agar tidak mengubah data asli
  const dataToSort = [...shuData.value.rincianAnggota];
  return dataToSort.sort((a, b) => {
    if (sortOrder.value === "asc") {
      return a.nama.localeCompare(b.nama);
    } else {
      return b.nama.localeCompare(a.nama);
    }
  });
});

const sortIcon = computed(() => {
  return sortOrder.value === "asc" ? "fa-sort-alpha-down" : "fa-sort-alpha-up";
});

const toggleSort = () => {
  sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
};

const totals = computed(() => {
  if (!shuData.value || !shuData.value.rincianAnggota) {
    return {
      shuSimpanan: 0,
      shuPinjaman: 0,
      shuBelanja: 0,
      shuPemerataan: 0,
      shuTotal: 0,
    };
  }
  return shuData.value.rincianAnggota.reduce(
    (acc, item) => {
      acc.shuSimpanan += item.shuTotalSimpanan || 0;
      acc.shuPinjaman += item.shuDariPinjaman || 0;
      acc.shuBelanja += item.shuDariBelanja || 0;
      acc.shuPemerataan += item.shuPemerataan || 0;
      acc.shuTotal += item.shuTotalDiterima || 0;
      return acc;
    },
    {
      shuSimpanan: 0,
      shuPinjaman: 0,
      shuBelanja: 0,
      shuPemerataan: 0,
      shuTotal: 0,
    }
  );
});

const fetchSHU = async () => {
  if (!laporanStore.periodeAktifId) {
    toast.error("Silakan pilih periode laporan terlebih dahulu.");
    return;
  }
  if (jasaBelanjaInput.value < 0) {
    toast.error("Silakan masukkan jumlah Jasa Belanja yang valid.");
    return;
  }

  isLoading.value = true;
  shuData.value = null;
  try {
    const response = await LaporanService.hitungSHU(
      laporanStore.periodeAktifId,
      jasaBelanjaInput.value
    );
    shuData.value = response.data;
    toast.success("Perhitungan SHU berhasil diselesaikan.");
  } catch (error) {
    toast.error("Gagal menghitung SHU.");
  } finally {
    isLoading.value = false;
  }
};

// FUNGSI BARU UNTUK EKSPOR
const exportToExcel = async () => {
  if (!shuData.value) {
    toast.error(
      "Tidak ada data untuk diekspor. Silakan hitung SHU terlebih dahulu."
    );
    return;
  }
  try {
    const response = await LaporanService.exportSHU(
      laporanStore.periodeAktifId,
      jasaBelanjaInput.value
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Laporan_SHU_${currentPeriodName.value}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Laporan berhasil diunduh.");
  } catch (error) {
    toast.error("Gagal mengunduh laporan.");
  }
};

const formatRupiah = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);
</script>
