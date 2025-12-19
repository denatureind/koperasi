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
      <div
        class="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium"
      >
        <span v-if="!totalValid" class="text-red-600">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Total: {{ totalPersentase.toFixed(2) }}%
        </span>
        <span v-else class="text-green-600">
          <i class="fas fa-check-circle mr-2"></i>
          Total: {{ totalPersentase.toFixed(2) }}%
        </span>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <div
          class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"
        ></div>
        <p class="text-gray-600 font-medium">Memuat konfigurasi...</p>
      </div>
    </div>

    <div v-else>
      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6"
      >
        <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-800">Distribusi SHU</h3>
              <p class="text-gray-500 text-sm mt-1">
                Total wajib 100%. Masukkan angka saja tanpa simbol %.
              </p>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSave" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-3 p-4 border border-gray-200 rounded-lg">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  SHU Anggota
                </label>
                <div class="relative">
                  <input
                    type="number"
                    step="0.01"
                    v-model.number="formValues.shu_anggota"
                    min="0"
                    max="100"
                    class="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                  />
                  <span
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >%</span
                  >
                </div>
              </div>
              <p class="text-sm text-gray-500">Dibagikan langsung ke anggota</p>
            </div>

            <div class="space-y-3 p-4 border border-gray-200 rounded-lg">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Cadangan Modal
                </label>
                <div class="relative">
                  <input
                    type="number"
                    step="0.01"
                    v-model.number="formValues.shu_cadangan"
                    min="0"
                    max="100"
                    class="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                  />
                  <span
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >%</span
                  >
                </div>
              </div>
              <p class="text-sm text-gray-500">Ditahan untuk modal koperasi</p>
            </div>

            <div class="space-y-3 p-4 border border-gray-200 rounded-lg">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Pengurus & Sosial
                </label>
                <div class="relative">
                  <input
                    type="number"
                    step="0.01"
                    v-model.number="formValues.shu_pengurus"
                    min="0"
                    max="100"
                    class="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors"
                  />
                  <span
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >%</span
                  >
                </div>
              </div>
              <p class="text-sm text-gray-500">
                Honor pengurus dan dana sosial
              </p>
            </div>
          </div>

          <div
            v-if="!totalValid"
            class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-pulse"
          >
            <div class="flex items-start">
              <i
                class="fas fa-exclamation-triangle text-red-500 mt-0.5 mr-3"
              ></i>
              <div>
                <h4 class="font-medium text-red-800">
                  Total Persentase Tidak Valid
                </h4>
                <p class="text-sm text-red-700 mt-1">
                  Total saat ini adalah
                  <strong>{{ totalPersentase.toFixed(2) }}%</strong>. Harap
                  sesuaikan agar total menjadi tepat <strong>100%</strong>.
                </p>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              :disabled="!totalValid || saving"
              :class="[
                'px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2',
                totalValid && !saving
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed',
              ]"
            >
              <i v-if="saving" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-save"></i>
              {{ saving ? "Menyimpan..." : "Simpan Perubahan" }}
            </button>
          </div>
        </form>
      </div>

      <div
        class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start"
      >
        <i class="fas fa-info-circle text-blue-500 text-xl mt-1 mr-3"></i>
        <div>
          <h4 class="font-medium text-blue-800">Informasi Sistem</h4>
          <p class="text-blue-600 text-sm mt-1">
            Pengaturan ini hanya berlaku untuk perhitungan SHU yang
            <strong>belum ditutup buku</strong>. Periode yang sudah ditutup
            tidak akan terpengaruh.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import KonfigurasiService from "@/services/konfigurasi.service.js";

// --- State Management ---
const toast = useToast();
const loading = ref(false);
const saving = ref(false);
const rawData = ref([]);

// Object local untuk binding ke Form Input
const formValues = ref({
  shu_anggota: 0,
  shu_cadangan: 0,
  shu_pengurus: 0,
});

// --- Computed Properties ---
const totalPersentase = computed(() => {
  const total =
    (parseFloat(formValues.value.shu_anggota) || 0) +
    (parseFloat(formValues.value.shu_cadangan) || 0) +
    (parseFloat(formValues.value.shu_pengurus) || 0);
  return total;
});

// Validasi total harus 100 (toleransi desimal kecil)
const totalValid = computed(() => {
  return Math.abs(totalPersentase.value - 100) < 0.01;
});

// --- Methods ---
const fetchConfigs = async () => {
  loading.value = true;
  try {
    const response = await KonfigurasiService.getSHU();
    rawData.value = response.data;

    // Map data Array dari DB ke Object Form
    rawData.value.forEach((item) => {
      // ✅ PERBAIKAN: Gunakan Object.prototype.hasOwnProperty.call agar linter senang
      if (Object.prototype.hasOwnProperty.call(formValues.value, item.key)) {
        formValues.value[item.key] = parseFloat(item.nilai);
      }
    });
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat data konfigurasi.");
  } finally {
    loading.value = false;
  }
};

const handleSave = async () => {
  if (!totalValid.value) {
    toast.warning("Total persentase harus 100%!");
    return;
  }

  saving.value = true;
  try {
    const payload = rawData.value.map((item) => {
      // ✅ PERBAIKAN: Gunakan Object.prototype.hasOwnProperty.call
      if (Object.prototype.hasOwnProperty.call(formValues.value, item.key)) {
        return {
          ...item,
          nilai: formValues.value[item.key],
        };
      }
      return item;
    });

    await KonfigurasiService.updateSHU(payload);
    toast.success("Konfigurasi berhasil disimpan!");

    // Refresh data untuk memastikan sinkron
    await fetchConfigs();
  } catch (error) {
    console.error(error);
    toast.error("Gagal menyimpan perubahan.");
  } finally {
    saving.value = false;
  }
};

// --- Lifecycle ---
onMounted(() => {
  fetchConfigs();
});
</script>

<style scoped>
/* Menghilangkan panah spin pada input number */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
