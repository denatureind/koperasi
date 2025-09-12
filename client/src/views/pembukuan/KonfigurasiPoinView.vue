<template>
  <div class="space-y-8">
    <!-- Panduan Perhitungan Poin -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-blue-800 mb-4">
        Panduan Perhitungan Poin SHU Simpanan
      </h2>

      <div class="space-y-3">
        <div>
          <h3 class="font-medium text-blue-700">
            1. Poin Simpanan Pokok & Wajib
          </h3>
          <p class="text-sm text-gray-700">
            Poin = Total Saldo Simpanan Pokok & Wajib / (Nilai Pembagi)
          </p>
        </div>

        <div>
          <h3 class="font-medium text-blue-700">2. Poin Simpanan Sukarela</h3>
          <p class="text-sm text-gray-700">
            Poin dihitung berdasarkan saldo rata-rata bulanan dan harga saham
            bertingkat yang Anda tentukan di bawah.
          </p>
        </div>

        <div>
          <h3 class="font-medium text-blue-700">3. Poin Simpanan Lebaran</h3>
          <p class="text-sm text-gray-700">
            Poin = Total Saldo Simpanan Lebaran / (Nilai Pembagi)
          </p>
        </div>
      </div>
    </div>

    <!-- Form Aturan Poin Sederhana -->
    <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">
        Aturan Poin Sederhana
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Pembagi Poin (Pokok & Wajib)</label
          >
          <input
            type="number"
            v-model="pembagiPokokWajib"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Masukkan angka"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Pembagi Poin (Lebaran)</label
          >
          <input
            type="number"
            v-model="pembagiLebaran"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Masukkan angka"
          />
        </div>
      </div>
    </div>

    <!-- Form Aturan Bertingkat -->
    <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">
          Aturan Bertingkat (Simpanan Sukarela)
        </h2>
        <button
          @click="tambahBaris"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Tambah Baris
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr>
              <th
                class="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Batas Saldo
              </th>
              <th
                class="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Harga Saham
              </th>
              <th
                class="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in poinSukarela" :key="index">
              <td>
                <input
                  type="number"
                  v-model="item.batas_saldo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masukkan angka"
                />
              </td>
              <td>
                <input
                  type="number"
                  v-model="item.harga_saham"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masukkan angka"
                />
              </td>
              <td>
                <button
                  @click="hapusBaris(index)"
                  class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tombol Simpan -->
    <div class="flex justify-end">
      <button
        @click="simpanPerubahan"
        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Simpan Semua Perubahan
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import KonfigurasiService from "@/services/konfigurasi.service.js";

const toast = useToast();
const configs = ref([]);
const poinSukarela = ref([]);

const findConfig = (key) =>
  configs.value.find((c) => c.kunci_konfigurasi === key);
const updateConfig = (key, value) => {
  const item = findConfig(key);
  if (item) {
    item.nilai = value;
  }
};

const pembagiPokokWajib = computed({
  get: () => findConfig("pembagi_poin_pokok_wajib")?.nilai || "",
  set: (value) => updateConfig("pembagi_poin_pokok_wajib", value),
});

const pembagiLebaran = computed({
  get: () => findConfig("pembagi_poin_lebaran")?.nilai || "",
  set: (value) => updateConfig("pembagi_poin_lebaran", value),
});

const loadData = async () => {
  try {
    const [shuResponse, poinResponse] = await Promise.all([
      KonfigurasiService.getSHU(),
      KonfigurasiService.getPoinSukarela(),
    ]);
    configs.value = shuResponse.data;
    poinSukarela.value = poinResponse.data;
  } catch (error) {
    toast.error("Gagal memuat data konfigurasi.");
    console.error("Error loading data:", error);
  }
};

const tambahBaris = () => {
  poinSukarela.value.push({ batas_saldo: "", harga_saham: "" });
};

const hapusBaris = (index) => {
  poinSukarela.value.splice(index, 1);
};

const simpanPerubahan = async () => {
  try {
    await Promise.all([
      KonfigurasiService.updateSHU(configs.value),
      KonfigurasiService.updatePoinSukarela(poinSukarela.value),
    ]);
    toast.success("Perubahan berhasil disimpan");
  } catch (error) {
    toast.error("Gagal menyimpan perubahan");
    console.error("Error saving data:", error);
  }
};

onMounted(loadData);
</script>
