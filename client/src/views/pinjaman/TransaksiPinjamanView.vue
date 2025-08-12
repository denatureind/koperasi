<template>
  <div
    class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-200"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center">
          <i class="fas fa-exchange-alt text-indigo-600 mr-3"></i>
          Transaksi Simpanan
        </h1>
        <p class="text-gray-500 mt-1">
          Riwayat semua transaksi simpanan anggota koperasi
        </p>
      </div>

      <div class="relative w-full md:w-auto">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <i class="fas fa-search text-gray-400"></i>
        </div>
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Cari nama atau no. rekening..."
          class="pl-10 py-2.5 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-12"
    >
      <i class="fas fa-spinner fa-spin text-indigo-600 text-3xl mb-4"></i>
      <p class="text-gray-600">Memuat data transaksi...</p>
    </div>

    <!-- Transaction Table -->
    <div
      v-else
      class="overflow-hidden rounded-xl border border-gray-200 shadow-sm"
    >
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
              No. Rekening
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nama Anggota
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Jenis Transaksi
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Jumlah
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="trx in filteredTransaksi"
            :key="trx.id"
            class="hover:bg-gray-50 transition-colors duration-150"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{
                  trx.tgl_transaksi
                    ? new Date(trx.tgl_transaksi).toLocaleDateString("id-ID")
                    : "-"
                }}
              </div>
              <div class="text-xs text-gray-500">
                {{
                  trx.tgl_transaksi
                    ? new Date(trx.tgl_transaksi).toLocaleTimeString("id-ID")
                    : ""
                }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium"
              >
                {{ trx.no_rekening }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3"
                >
                  <i class="fas fa-user text-indigo-600"></i>
                </div>
                <div class="text-sm font-medium text-gray-900">
                  {{ trx.nama_anggota }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'bg-green-100 text-green-800':
                    trx.jenis_transaksi === 'Setor',
                  'bg-amber-100 text-amber-800':
                    trx.jenis_transaksi === 'Tarik',
                }"
                class="px-3 py-1 rounded-full text-xs font-medium flex items-center w-min"
              >
                <i
                  :class="{
                    'fas fa-arrow-down mr-1': trx.jenis_transaksi === 'Setor',
                    'fas fa-arrow-up mr-1': trx.jenis_transaksi === 'Tarik',
                  }"
                ></i>
                {{ trx.jenis_transaksi }}
              </span>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              :class="
                trx.jenis_transaksi === 'Setor'
                  ? 'text-green-600'
                  : 'text-amber-600'
              "
            >
              {{ trx.jenis_transaksi === "Setor" ? "+" : "-" }}
              {{ formatUang(trx.jumlah) }}
            </td>
          </tr>
          <tr v-if="filteredTransaksi.length === 0">
            <td colspan="5" class="px-6 py-12 text-center">
              <div
                class="flex flex-col items-center justify-center text-gray-500"
              >
                <i class="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
                <p class="text-lg font-medium">Data tidak ditemukan</p>
                <p class="mt-1">
                  Tidak ada transaksi yang sesuai dengan pencarian Anda
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Summary Footer -->
    <div
      v-if="!isLoading && filteredTransaksi.length > 0"
      class="mt-4 flex justify-between items-center text-sm text-gray-500"
    >
      <div>
        Menampilkan {{ filteredTransaksi.length }} dari
        {{ transaksiList.length }} transaksi
      </div>
      <div class="flex items-center space-x-2">
        <i class="fas fa-info-circle text-indigo-500"></i>
        <span
          >Terakhir diperbarui:
          {{ new Date().toLocaleTimeString("id-ID") }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import SimpananService from "@/services/simpanan.service.js";

const transaksiList = ref([]);
const isLoading = ref(true);
const searchTerm = ref("");

const filteredTransaksi = computed(() => {
  if (!searchTerm.value) {
    return transaksiList.value;
  }
  const search = searchTerm.value.toLowerCase();
  return transaksiList.value.filter(
    (trx) =>
      (trx.nama_anggota && trx.nama_anggota.toLowerCase().includes(search)) ||
      (trx.no_rekening && trx.no_rekening.toLowerCase().includes(search))
  );
});

const fetchAllTransaksi = async () => {
  isLoading.value = true;
  try {
    const response = await SimpananService.getAllTransaksi();
    transaksiList.value = response.data;
  } catch (error) {
    console.error("Error fetching all transaksi:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka || 0
  );

onMounted(fetchAllTransaksi);
</script>

<style scoped>
/* Smooth transition for table rows */
tr {
  transition: background-color 0.2s ease;
}

/* Animation for new transactions */
@keyframes highlight {
  from {
    background-color: rgba(99, 102, 241, 0.1);
  }
  to {
    background-color: transparent;
  }
}

.highlight {
  animation: highlight 1.5s ease;
}
</style>
