<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
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

      <div class="flex items-center gap-3">
        <div
          class="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100"
        >
          <span class="text-sm text-indigo-700 font-medium">
            Periode: {{ currentPeriodName }}
          </span>
        </div>
      </div>
    </div>

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
              <span
                v-if="isLoading"
                class="loading loading-spinner loading-sm"
              ></span>
              <i v-else class="fas fa-calculator"></i>
              <span>{{
                isLoading ? "Menghitung..." : "Mulai Hitung SHU"
              }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <div v-if="shuData" class="space-y-6">
      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-800">
            Rincian Alokasi Saldo Laba
          </h3>
          <p class="text-gray-500 text-sm mt-1">
            Total Saldo Laba:
            <span class="font-bold">{{ formatUang(shuData.saldoLaba) }}</span>
          </p>
        </div>
        <div class="px-6 py-4 space-y-4">
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
                {{ formatUang(shuData.distribusi.anggota) }}
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
                {{ formatUang(shuData.distribusi.cadangan) }}
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
                {{ formatUang(shuData.distribusi.danaSosial) }}
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
                {{ formatUang(shuData.distribusi.pengurus) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div class="px-6 py-5">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"
              >
                <i class="fas fa-wallet text-green-600"></i>
              </div>
              <div>
                <p class="text-gray-500 text-sm">
                  Dana untuk Anggota (via Simpanan)
                </p>
                <span class="text-xl font-bold text-green-600">
                  {{ formatUang(shuData.danaUntukAnggotaViaSimpanan) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div class="px-6 py-5">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"
              >
                <i class="fas fa-chart-line text-blue-600"></i>
              </div>
              <div>
                <p class="text-gray-500 text-sm">Total Poin Simpanan</p>
                <span class="text-xl font-bold text-blue-600">
                  {{ shuData.totalPoinSimpananKeseluruhan.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden text-white"
        >
          <div class="px-6 py-5">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center"
              >
                <i class="fas fa-percentage text-white"></i>
              </div>
              <div>
                <p>Nilai per Poin (Indeks)</p>
                <span class="text-xl font-bold">
                  {{ formatUang(shuData.indeksPoin) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Anggota
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Poin
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
                  Total SHU
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="item in shuData.rincianAnggota"
                :key="item.anggota_id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3"
                    >
                      <i class="fas fa-user text-indigo-600 text-sm"></i>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">
                        {{ item.nama }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ item.kode_anggota }}
                      </div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-right font-bold">
                  {{ item.totalPoin.toFixed(2) }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-right">
                  {{ formatUang(item.shuTotalSimpanan) }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-right">
                  {{ formatUang(item.shuDariPinjaman) }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-right">
                  {{ formatUang(item.shuDariBelanja) }}
                </td>

                <td
                  class="px-6 py-4 whitespace-nowrap text-right font-bold text-green-600"
                >
                  {{ formatUang(item.shuTotalDiterima) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-if="!shuData && !isLoading"
      class="bg-white rounded-xl border border-gray-200 p-8 text-center"
    >
      <i class="fas fa-calculator text-4xl text-gray-300 mb-4"></i>
      <h3 class="text-lg font-medium text-gray-700 mb-1">
        Siap Menghitung SHU
      </h3>
      <p class="text-gray-500 mb-6">
        Masukkan jumlah Jasa Belanja dan klik "Mulai Hitung SHU" untuk memulai
        perhitungan
      </p>
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

const currentPeriodName = computed(() => {
  if (!laporanStore.periodeAktifId || !laporanStore.periodeList.length)
    return "Belum dipilih";

  const period = laporanStore.periodeList.find(
    (p) => p.id === laporanStore.periodeAktifId
  );

  return period ? period.nama_periode : "Belum dipilih";
});

const fetchSHU = async () => {
  if (!laporanStore.periodeAktifId) {
    toast.error("Silakan pilih periode laporan terlebih dahulu.");
    return;
  }
  if (jasaBelanjaInput.value <= 0) {
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

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);
</script>

<style scoped>
.loading {
  border: 2px solid #e5e7eb;
  border-top: 2px solid #4f46e5;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
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

tbody tr:nth-child(odd) {
  background-color: #f9fafb;
}
</style>
