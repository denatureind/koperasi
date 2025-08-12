<template>
  <div
    class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
  >
    <div class="p-6">
      <!-- Header dengan ikon dan judul -->
      <div class="flex items-center mb-6">
        <div
          class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mr-4"
        >
          <i class="fas fa-calculator text-xl text-indigo-600"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-800">
            Konfigurasi Jenis Pinjaman
          </h1>
          <p class="text-gray-500 mt-1">
            Tambah atau kelola jenis produk pinjaman yang ditawarkan
          </p>
        </div>
      </div>

      <!-- Form tambah jenis pinjaman -->
      <div
        class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 mb-8 border border-indigo-100"
      >
        <h3
          class="text-lg font-semibold text-indigo-800 mb-4 flex items-center"
        >
          <i class="fas fa-plus-circle mr-2"></i>
          Tambah Jenis Pinjaman Baru
        </h3>

        <form
          @submit.prevent="handleSubmit"
          class="grid grid-cols-1 md:grid-cols-4 gap-5"
        >
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              <i class="fas fa-tag text-indigo-500 mr-2"></i>
              Nama Jenis Pinjaman
            </label>
            <input
              type="text"
              v-model="form.nama_jenis"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
              placeholder="Contoh: Pinjaman Mikro"
              required
            />
          </div>

          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              <i class="fas fa-percent text-indigo-500 mr-2"></i>
              Tingkat Jasa (%)
            </label>
            <div class="relative">
              <input
                type="number"
                step="0.01"
                v-model="form.tingkat_jasa_persen"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                placeholder="1.5"
                required
              />
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <i class="fas fa-chart-line text-gray-400"></i>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              <i class="fas fa-align-left text-indigo-500 mr-2"></i>
              Deskripsi (Opsional)
            </label>
            <input
              type="text"
              v-model="form.deskripsi"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
              placeholder="Deskripsi singkat"
            />
          </div>

          <button
            type="submit"
            class="h-fit self-end bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center px-4 py-3"
          >
            <i class="fas fa-save mr-2"></i>
            Simpan
          </button>
        </form>
      </div>

      <!-- Tabel jenis pinjaman -->
      <div class="border border-gray-200 rounded-xl overflow-hidden">
        <div class="bg-gradient-to-r from-indigo-700 to-indigo-800 px-6 py-4">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <i class="fas fa-list mr-2"></i>
            Daftar Jenis Pinjaman
          </h3>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-indigo-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider"
                >
                  <i class="fas fa-tag mr-1"></i> Nama Jenis
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider"
                >
                  <i class="fas fa-percent mr-1"></i> Tingkat Jasa
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider"
                >
                  <i class="fas fa-align-left mr-1"></i> Deskripsi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="item in listJenis"
                :key="item.id"
                class="hover:bg-indigo-50/50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center mr-3"
                    >
                      <i
                        class="fas fa-hand-holding-usd text-indigo-600 text-sm"
                      ></i>
                    </div>
                    <span class="font-medium text-gray-900">
                      {{ item.nama_jenis }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                  >
                    {{ item.tingkat_jasa_persen }}%
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-600">
                  {{ item.deskripsi || "-" }}
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="listJenis.length === 0" class="text-center py-10 bg-white">
            <div
              class="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-3"
            >
              <i class="fas fa-inbox text-indigo-600 text-2xl"></i>
            </div>
            <p class="text-gray-500">Belum ada jenis pinjaman yang tersedia</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import JenisPinjamanService from "@/services/jenisPinjaman.service.js";
import { useToast } from "vue-toastification";

const listJenis = ref([]);
const form = ref({ nama_jenis: "", tingkat_jasa_persen: 1.0, deskripsi: "" });
const toast = useToast();

const fetchData = async () => {
  try {
    const response = await JenisPinjamanService.getAll();
    listJenis.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat data.");
  }
};

const handleSubmit = async () => {
  try {
    await JenisPinjamanService.create(form.value);
    toast.success("Jenis pinjaman baru berhasil ditambahkan!");
    form.value = { nama_jenis: "", tingkat_jasa_persen: 1.0, deskripsi: "" };
    fetchData();
  } catch (error) {
    toast.error("Gagal menyimpan.");
  }
};

onMounted(fetchData);
</script>

<style scoped>
.form-group {
  margin-bottom: 0;
}

th,
td {
  padding: 1rem 1.5rem;
}

tr:last-child td {
  border-bottom: 0;
}

input:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  outline: none;
}

button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateY(-1px);
}
</style>
