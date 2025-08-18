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
          <i class="fas fa-edit text-indigo-600"></i>
          Input SHU Pemerataan
        </h1>
        <p class="text-gray-500 mt-1">
          Input manual komponen SHU tambahan untuk setiap anggota per periode.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div
          class="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100"
        >
          <span class="text-sm text-indigo-700 font-medium">
            Periode Aktif: {{ currentPeriodName }}
          </span>
        </div>
      </div>
    </div>

    <!-- Konten Utama -->
    <div v-if="!laporanStore.periodeAktifId" class="text-center py-12">
      <p class="text-gray-600">
        Silakan pilih periode laporan terlebih dahulu.
      </p>
    </div>
    <div v-else>
      <!-- Indikator Loading -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="text-center">
          <div
            class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"
          ></div>
          <p class="text-gray-600 font-medium">Memuat data anggota...</p>
        </div>
      </div>

      <!-- Tabel Input Data -->
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
                  No
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
                  Jumlah (Rp)
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Keterangan
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(anggota, index) in dataPemerataan"
                :key="anggota.anggota_id"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ index + 1 }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ anggota.nama }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    v-model.number="anggota.jumlah"
                    class="w-40 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="0"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    v-model="anggota.keterangan"
                    class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Bonus, Dana Sosial, dll."
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Tombol Simpan -->
        <div
          class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end"
        >
          <button
            @click="saveData"
            :disabled="isSaving"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            <i v-if="isSaving" class="fas fa-spinner fa-spin mr-2"></i>
            {{ isSaving ? "Menyimpan..." : "Simpan Perubahan" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useLaporanStore } from "@/stores/laporan.store";
// PERHATIKAN PERUBAHAN DI SINI: Menggunakan kurung kurawal {}
import { getPemerataanByPeriode, savePemerataan } from "@/services/shu.service";
import { useToast } from "vue-toastification";

const laporanStore = useLaporanStore();
const toast = useToast();

const dataPemerataan = ref([]);
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

const fetchData = async () => {
  if (!laporanStore.periodeAktifId) return;
  isLoading.value = true;
  try {
    // PERHATIKAN PERUBAHAN DI SINI: Memanggil fungsi langsung
    const response = await getPemerataanByPeriode(laporanStore.periodeAktifId);
    dataPemerataan.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat data anggota.");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const saveData = async () => {
  if (!laporanStore.periodeAktifId) {
    toast.error("Periode tidak valid.");
    return;
  }
  isSaving.value = true;
  try {
    const payload = dataPemerataan.value.map((item) => ({
      anggota_id: item.anggota_id,
      jumlah: item.jumlah || 0,
      keterangan: item.keterangan || null,
    }));

    // PERHATIKAN PERUBAHAN DI SINI: Memanggil fungsi langsung
    await savePemerataan(laporanStore.periodeAktifId, payload);
    toast.success("Data SHU Pemerataan berhasil disimpan!");
  } catch (error) {
    toast.error("Gagal menyimpan data.");
    console.error(error);
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  if (laporanStore.periodeList.length === 0) {
    laporanStore.fetchPeriodeList();
  }
});

watch(() => laporanStore.periodeAktifId, fetchData, { immediate: true });
</script>
