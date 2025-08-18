<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-200"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-users text-teal-600"></i>
          Input SHU Pemerataan
        </h1>
        <p class="text-gray-500 mt-1">
          Input manual jumlah SHU lain-lain (pemerataan) untuk setiap anggota.
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

    <div v-if="isLoading" class="text-center py-12">
      <span class="loading loading-spinner loading-lg text-indigo-600"></span>
      <p class="mt-4 text-gray-500">Memuat data anggota...</p>
    </div>

    <div v-else-if="anggotaList.length > 0">
      <div
        class="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm"
      >
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
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64"
              >
                Jumlah SHU Pemerataan (Rp)
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="anggota in anggotaList"
              :key="anggota.anggota_id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ anggota.nama }}</div>
                <div class="text-sm text-gray-500">
                  {{ anggota.kode_anggota }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >Rp</span
                  >
                  <input
                    type="number"
                    v-model.number="anggota.jumlah"
                    placeholder="0"
                    class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-6 flex justify-end">
        <button
          @click="saveDataPemerataan"
          :disabled="isSaving"
          class="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <div class="flex items-center gap-2 justify-center">
            <span
              v-if="isSaving"
              class="loading loading-spinner loading-sm"
            ></span>
            <i v-else class="fas fa-save"></i>
            <span>{{ isSaving ? "Menyimpan..." : "Simpan Data" }}</span>
          </div>
        </button>
      </div>
    </div>

    <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
      <i class="fas fa-exclamation-circle text-4xl text-gray-400 mb-4"></i>
      <h3 class="text-lg font-medium text-gray-700">Data Tidak Ditemukan</h3>
      <p class="text-gray-500">
        Pastikan Anda sudah memilih periode laporan yang benar.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useLaporanStore } from "@/stores/laporan.store.js";
import SHUService from "@/services/shu.service.js";
import { useToast } from "vue-toastification";

const laporanStore = useLaporanStore();
const toast = useToast();
const anggotaList = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);

const currentPeriodName = computed(() => {
  if (!laporanStore.periodeAktifId || !laporanStore.periodeList.length)
    return "Belum dipilih";
  const period = laporanStore.periodeList.find(
    (p) => p.id === laporanStore.periodeAktifId
  );
  return period ? period.nama_periode : "Belum dipilih";
});

const fetchDataPemerataan = async () => {
  if (!laporanStore.periodeAktifId) {
    anggotaList.value = [];
    return;
  }
  isLoading.value = true;
  try {
    // === PERBAIKAN NAMA FUNGSI ===
    const response = await SHUService.getPemerataanByPeriode(
      laporanStore.periodeAktifId
    );
    anggotaList.value = response.data;
  } catch (error) {
    toast.error("Gagal mengambil data SHU Pemerataan.");
    console.error("Error fetching data:", error);
    anggotaList.value = [];
  } finally {
    isLoading.value = false;
  }
};

const saveDataPemerataan = async () => {
  if (!laporanStore.periodeAktifId) {
    toast.error("Silakan pilih periode laporan terlebih dahulu.");
    return;
  }
  isSaving.value = true;
  try {
    const dataToSave = anggotaList.value.map((a) => ({
      anggota_id: a.anggota_id,
      jumlah: a.jumlah || 0,
    }));

    // === PERBAIKAN NAMA FUNGSI DAN PARAMETER ===
    await SHUService.savePemerataan(laporanStore.periodeAktifId, dataToSave);
    toast.success("Data SHU Pemerataan berhasil disimpan.");
  } catch (error) {
    toast.error("Gagal menyimpan data.");
    console.error("Error saving data:", error);
  } finally {
    isSaving.value = false;
  }
};

onMounted(fetchDataPemerataan);
watch(() => laporanStore.periodeAktifId, fetchDataPemerataan);
</script>
