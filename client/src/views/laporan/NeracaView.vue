<template>
  <div class="p-4 md:p-6 bg-gray-50 min-h-screen">
    <div class="flex justify-end mb-4">
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
    </div>

    <div v-if="isLoading" class="text-center py-16">
      <div class="flex justify-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
      </div>
      <p class="mt-4 text-gray-600">Memuat data neraca...</p>
    </div>
    <div
      v-else-if="neracaData"
      class="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-in"
    >
      <div class="card bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="card-body p-6">
          <h2 class="text-xl font-bold text-center text-gray-800 mb-6">
            AKTIVA
          </h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="akun in neracaData.aset"
                  :key="akun.kode"
                  class="hover:bg-blue-50"
                >
                  <td
                    class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-500"
                  >
                    {{ akun.kode }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {{ akun.nama_akun }}
                  </td>
                  <td
                    class="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-800"
                  >
                    {{ formatUang(akun.saldo) }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-blue-100">
                  <th
                    colspan="2"
                    class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Total Aktiva
                  </th>
                  <th
                    class="px-4 py-3 text-right text-sm font-semibold text-gray-800"
                  >
                    {{ formatUang(neracaData.totalAset) }}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div class="card bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="card-body p-6">
          <h2 class="text-xl font-bold text-center text-gray-800 mb-6">
            PASIVA
          </h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 mb-6">
              <thead>
                <tr class="bg-blue-50">
                  <th
                    colspan="3"
                    class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Kewajiban
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="akun in neracaData.kewajiban"
                  :key="akun.kode"
                  class="hover:bg-blue-50"
                >
                  <td class="px-4 py-3 text-sm font-medium text-gray-500">
                    {{ akun.kode }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-800">
                    {{ akun.nama_akun }}
                  </td>
                  <td
                    class="px-4 py-3 text-sm text-right font-medium text-gray-800"
                  >
                    {{ formatUang(akun.saldo) }}
                  </td>
                </tr>
                <tr class="bg-gray-100">
                  <td
                    colspan="2"
                    class="px-4 py-3 text-sm font-semibold text-gray-700"
                  >
                    Jumlah Kewajiban
                  </td>
                  <td
                    class="px-4 py-3 text-right text-sm font-semibold text-gray-800"
                  >
                    {{ formatUang(neracaData.totalKewajiban) }}
                  </td>
                </tr>
              </tbody>
            </table>

            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr class="bg-blue-50">
                  <th
                    colspan="3"
                    class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Modal
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="akun in neracaData.modal"
                  :key="akun.kode"
                  class="hover:bg-blue-50"
                >
                  <td class="px-4 py-3 text-sm font-medium text-gray-500">
                    {{ akun.kode }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-800">
                    {{ akun.nama_akun }}
                  </td>
                  <td
                    class="px-4 py-3 text-sm text-right font-medium text-gray-800"
                  >
                    {{ formatUang(akun.saldo) }}
                  </td>
                </tr>
                <tr class="bg-gray-100">
                  <td
                    colspan="2"
                    class="px-4 py-3 text-sm font-semibold text-gray-700"
                  >
                    Jumlah Modal
                  </td>
                  <td
                    class="px-4 py-3 text-right text-sm font-semibold text-gray-800"
                  >
                    {{ formatUang(neracaData.totalModal) }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-blue-100">
                  <th
                    colspan="2"
                    class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Total Kewajiban & Modal
                  </th>
                  <th
                    class="px-4 py-3 text-right text-sm font-semibold text-gray-800"
                  >
                    {{ formatUang(neracaData.totalKewajibanDanModal) }}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-16 bg-white rounded-xl shadow-sm border">
      <h3 class="text-lg font-semibold text-gray-700">Silakan Pilih Periode</h3>
      <p class="text-gray-500 mt-2">
        Pilih periode laporan di bagian atas untuk menampilkan data neraca.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useLaporanStore } from "@/stores/laporan.store.js";
import LaporanService from "@/services/laporan.service.js";
import { useToast } from "vue-toastification";

const neracaData = ref(null);
const isLoading = ref(true);
const isExporting = ref(false);
const laporanStore = useLaporanStore();
const toast = useToast();

const fetchNeraca = async (periodeId) => {
  if (!periodeId) {
    neracaData.value = null;
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  try {
    const response = await LaporanService.getNeraca(periodeId);
    neracaData.value = response.data;
  } catch (error) {
    console.error("Error mengambil data neraca:", error);
    toast.error("Gagal memuat data neraca.");
  } finally {
    isLoading.value = false;
  }
};

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka || 0
  );

const handleExport = async () => {
  if (!laporanStore.periodeAktifId) {
    toast.error("Silakan pilih periode terlebih dahulu.");
    return;
  }
  isExporting.value = true;
  try {
    const response = await LaporanService.exportNeraca(
      laporanStore.periodeAktifId
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    const contentDisposition = response.headers["content-disposition"];
    let fileName = "Laporan_Neraca.xlsx";
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      if (fileNameMatch && fileNameMatch.length === 2)
        fileName = fileNameMatch[1];
    }

    link.setAttribute("download", fileName);
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
    fetchNeraca(newId);
  },
  { immediate: true }
);
</script>

<style scoped>
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

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

table {
  border-collapse: separate;
  border-spacing: 0;
}

th,
td {
  border-bottom: 1px solid #e5e7eb;
}
</style>
