<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-200"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-shopping-cart text-indigo-600"></i>
          Input Belanja Bulanan Anggota
        </h1>
        <p class="text-gray-500 mt-1">
          Masukkan total belanja anggota untuk perhitungan SHU.
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
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="p-6">
        <div class="flex flex-wrap gap-6 items-end mb-6">
          <div class="space-y-1 flex-1 min-w-[180px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Pilih Bulan
            </label>
            <select
              v-model="bulanTerpilih"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <option v-for="bln in 12" :key="bln" :value="bln">
                {{ namaBulan(bln) }}
              </option>
            </select>
          </div>

          <div class="space-y-1 flex-1 min-w-[120px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Pilih Tahun
            </label>
            <input
              type="number"
              v-model="tahunTerpilih"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            @click="fetchData"
            class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            <div class="flex items-center gap-2">
              <span
                v-if="isLoading && !isSaving"
                class="loading loading-spinner loading-sm"
              ></span>
              <span>Tampilkan Data</span>
            </div>
          </button>
        </div>

        <div class="border-t border-gray-200 pt-6 overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nama Anggota
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Belanja (Rp)
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="item in dataBelanja"
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
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="relative">
                    <span
                      class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >Rp</span
                    >
                    <input
                      type="number"
                      v-model="item.total_belanja"
                      placeholder="0"
                      class="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-right"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-end mt-8">
          <button
            @click="handleSimpan"
            class="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="isSaving"
          >
            <div class="flex items-center gap-2">
              <span
                v-if="isSaving"
                class="loading loading-spinner loading-sm"
              ></span>
              <span>Simpan Semua Perubahan</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import TokoService from "@/services/toko.service.js";
import { useToast } from "vue-toastification";
import { useLaporanStore } from "@/stores/laporan.store.js";

const dataBelanja = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);
const toast = useToast();
const laporanStore = useLaporanStore();

const bulanTerpilih = ref(new Date().getMonth() + 1);
const tahunTerpilih = ref(new Date().getFullYear());

const currentPeriodName = computed(() => {
  if (!laporanStore.periodeAktifId || !laporanStore.periodeList.length)
    return "Belum dipilih";

  const period = laporanStore.periodeList.find(
    (p) => p.id === laporanStore.periodeAktifId
  );

  return period ? period.nama_periode : "Belum dipilih";
});

const fetchData = async () => {
  isLoading.value = true;
  try {
    const response = await TokoService.getBelanjaBulanan(
      bulanTerpilih.value,
      tahunTerpilih.value
    );
    dataBelanja.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat data anggota.");
  } finally {
    isLoading.value = false;
  }
};

const handleSimpan = async () => {
  isSaving.value = true;
  try {
    const payload = {
      bulan: bulanTerpilih.value,
      tahun: tahunTerpilih.value,
      dataBelanja: dataBelanja.value.map((item) => ({
        anggota_id: item.anggota_id,
        total_belanja: parseFloat(item.total_belanja) || 0,
      })),
    };
    await TokoService.simpanBelanjaBulanan(payload);
    toast.success("Data belanja berhasil disimpan!");
  } catch (error) {
    toast.error("Gagal menyimpan data belanja.");
  } finally {
    isSaving.value = false;
  }
};

const namaBulan = (month) => {
  return new Date(0, month - 1).toLocaleString("id-ID", { month: "long" });
};

onMounted(fetchData);
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
