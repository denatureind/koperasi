<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-200"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-percentage text-indigo-600"></i>
          Konfigurasi Persentase SHU
        </h1>
        <p class="text-gray-500 mt-1">
          Ubah nilai persentase untuk periode perhitungan berikutnya
        </p>
      </div>
    </div>

    <div v-if="configs.length === 0" class="flex justify-center py-12">
      <div class="text-center">
        <div
          class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"
        ></div>
        <p class="text-gray-600 font-medium">Memuat konfigurasi...</p>
      </div>
    </div>

    <div
      v-else
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-800">Aturan Distribusi SHU</h3>
        <p class="text-gray-500 text-sm mt-1">
          Total semua persentase harus berjumlah 100%
        </p>
      </div>

      <form @submit.prevent="handleSave" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="config in configs"
            :key="config.id"
            class="space-y-3 p-4 border border-gray-200 rounded-lg hover:bg-indigo-50/20 transition-colors"
          >
            <div>
              <label
                :for="config.kunci_konfigurasi"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                {{ config.nama_konfigurasi }}
              </label>

              <div class="relative">
                <input
                  type="number"
                  step="0.01"
                  v-model="config.nilai"
                  :id="config.kunci_konfigurasi"
                  min="0"
                  max="100"
                  class="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <span
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >%</span
                >
              </div>
            </div>

            <p class="text-sm text-gray-500 mt-1">
              {{ config.deskripsi }}
            </p>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <i class="fas fa-save"></i>
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>

    <div
      class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start"
    >
      <div class="flex-shrink-0">
        <i class="fas fa-info-circle text-blue-500 text-xl mt-1 mr-3"></i>
      </div>
      <div>
        <h4 class="font-medium text-blue-800">Catatan Penting</h4>
        <p class="text-blue-600 text-sm mt-1">
          Pastikan total semua persentase berjumlah tepat 100%. Perubahan akan
          mempengaruhi perhitungan SHU periode berikutnya.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import KonfigurasiService from "@/services/konfigurasi.service.js";
import { useToast } from "vue-toastification";

const configs = ref([]);
const toast = useToast();

const fetchConfigs = async () => {
  try {
    const response = await KonfigurasiService.getSHU();
    configs.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat data konfigurasi.");
  }
};

const handleSave = async () => {
  try {
    // Validasi total persentase
    const totalPersentase = configs.value.reduce(
      (total, config) => total + parseFloat(config.nilai),
      0
    );

    if (Math.abs(totalPersentase - 100) > 0.01) {
      toast.error(
        `Total persentase harus 100% (Saat ini: ${totalPersentase.toFixed(2)}%)`
      );
      return;
    }

    await KonfigurasiService.updateSHU(configs.value);
    toast.success("Konfigurasi berhasil disimpan!");
  } catch (error) {
    toast.error("Gagal menyimpan perubahan.");
  }
};

onMounted(fetchConfigs);
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
