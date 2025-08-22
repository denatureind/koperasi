<template>
  <div
    class="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 max-w-3xl mx-auto"
  >
    <div class="flex items-center justify-center mb-6">
      <div
        class="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center mr-4"
      >
        <i class="fas fa-hand-holding-usd text-2xl text-indigo-600"></i>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">
          Form Pengajuan Pinjaman Baru
        </h1>
        <p v-if="anggota" class="text-gray-600 mt-1">
          Untuk Anggota:
          <strong class="text-indigo-600">{{ anggota.nama }}</strong>
        </p>
      </div>
    </div>

    <div class="border-t border-gray-200 pt-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            <i class="fas fa-tag text-indigo-500 mr-2"></i>
            Jenis Pinjaman
          </label>
          <select
            v-model="selectedJenisId"
            class="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300"
            required
          >
            <option value="" disabled selected>Pilih Jenis Pinjaman</option>
            <option
              v-for="jenis in listJenisPinjaman"
              :key="jenis.id"
              :value="jenis.id"
            >
              {{ jenis.nama_jenis }} ({{ jenis.tingkat_jasa_persen }}%)
            </option>
          </select>
        </div>

        <div class="form-group">
          <label
            for="jumlah_pinjaman"
            class="block text-sm font-medium text-gray-700 mb-1.5"
          >
            <i class="fas fa-money-bill-wave text-indigo-500 mr-2"></i>
            Jumlah Pinjaman (Rp)
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <span class="text-gray-500">Rp</span>
            </div>
            <input
              type="number"
              id="jumlah_pinjaman"
              v-model="formData.jumlah_pinjaman"
              required
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300"
              placeholder="Masukkan jumlah pinjaman"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label
              for="tenor"
              class="block text-sm font-medium text-gray-700 mb-1.5"
            >
              <i class="fas fa-calendar-alt text-indigo-500 mr-2"></i>
              Tenor (Bulan)
            </label>
            <div class="relative">
              <input
                type="number"
                id="tenor"
                v-model="formData.tenor"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300"
                placeholder="Durasi pinjaman"
              />
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-clock text-gray-400"></i>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label
              for="tingkat_jasa_persen"
              class="block text-sm font-medium text-gray-700 mb-1.5"
            >
              <i class="fas fa-percent text-indigo-500 mr-2"></i>
              Jasa per Bulan (%)
            </label>
            <div class="relative">
              <input
                type="number"
                step="0.1"
                id="tingkat_jasa_persen"
                v-model="formData.tingkat_jasa_persen"
                required
                readonly
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-100 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300"
                placeholder="Persentase jasa"
              />
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-chart-line text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label
            for="tgl_pencairan"
            class="block text-sm font-medium text-gray-700 mb-1.5"
          >
            <i class="far fa-calendar-check text-indigo-500 mr-2"></i>
            Tanggal Pencairan
          </label>
          <div class="relative">
            <input
              type="date"
              id="tgl_pencairan"
              v-model="formData.tgl_pencairan"
              required
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300"
            />
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <i class="far fa-calendar text-gray-400"></i>
            </div>
          </div>
        </div>

        <div
          v-if="formData.jumlah_pinjaman > 0 && formData.tenor > 0"
          class="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-2"
        >
          <h4 class="font-semibold text-indigo-800">
            Estimasi Angsuran per Bulan:
          </h4>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Angsuran Pokok:</span>
            <span class="font-medium text-gray-800">{{
              formatUang(estimasi.pokok)
            }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Angsuran Jasa:</span>
            <span class="font-medium text-gray-800">{{
              formatUang(estimasi.jasa)
            }}</span>
          </div>
          <div
            class="flex justify-between font-bold text-base pt-2 border-t border-indigo-200"
          >
            <span class="text-indigo-900">Total Angsuran per Bulan:</span>
            <span class="text-indigo-900">{{
              formatUang(estimasi.total)
            }}</span>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="router.push(`/anggota/${anggotaId}`)"
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-300 flex items-center"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Kembali
          </button>
          <button
            type="submit"
            class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
          >
            <i class="fas fa-paper-plane mr-2"></i>
            Ajukan Pinjaman
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import AnggotaService from "@/services/anggota.service.js";
import PinjamanService from "@/services/pinjaman.service.js";
import JenisPinjamanService from "@/services/jenisPinjaman.service.js";
import { useToast } from "vue-toastification";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const anggotaId = route.params.anggotaId;

const anggota = ref(null);
const listJenisPinjaman = ref([]);
const selectedJenisId = ref(null);
const formData = ref({
  anggota_id: parseInt(anggotaId),
  jumlah_pinjaman: 0,
  tenor: 12,
  tingkat_jasa_persen: 1,
  tgl_pencairan: new Date().toISOString().split("T")[0],
});

watch(selectedJenisId, (newVal) => {
  if (newVal) {
    const selectedJenis = listJenisPinjaman.value.find(
      (jenis) => jenis.id === newVal
    );
    if (selectedJenis) {
      formData.value.tingkat_jasa_persen = selectedJenis.tingkat_jasa_persen;
    }
  }
});

const estimasi = computed(() => {
  const jumlah = parseFloat(formData.value.jumlah_pinjaman) || 0;
  const tenor = parseInt(formData.value.tenor) || 1;
  const jasaPersen = parseFloat(formData.value.tingkat_jasa_persen) || 0;

  if (jumlah === 0 || tenor === 0) {
    return { pokok: 0, jasa: 0, total: 0 };
  }

  const pokokPerBulan = jumlah / tenor;
  const jasaPerBulan = jumlah * (jasaPersen / 100);
  const totalPerBulan = pokokPerBulan + jasaPerBulan;

  return {
    pokok: pokokPerBulan,
    jasa: jasaPerBulan,
    total: totalPerBulan,
  };
});

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka || 0
  );

const handleSubmit = async () => {
  try {
    await PinjamanService.create(formData.value);
    toast.success("Pinjaman baru berhasil dibuat!");
    router.push(`/data-master/anggota/${anggotaId}`);
  } catch (error) {
    console.error("Error saat membuat pinjaman:", error);
    toast.error("Gagal membuat pinjaman baru.");
  }
};

onMounted(async () => {
  try {
    if (anggotaId && anggotaId !== "0") {
      const response = await AnggotaService.getById(anggotaId);
      anggota.value = response.data;
    }

    const jenisResponse = await JenisPinjamanService.getAll();
    listJenisPinjaman.value = jenisResponse.data;
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    toast.error("Gagal mengambil data.");
  }
});
</script>

<style scoped>
.form-group label {
  transition: color 0.3s ease;
}

.form-group:focus-within label {
  color: #4f46e5;
}

input:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateY(-1px);
}
</style>
