<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <i class="fas fa-cog text-indigo-600"></i>
        Konfigurasi Jenis Simpanan
      </h1>
      <p class="text-gray-500 mt-1">
        Kelola jenis-jenis simpanan dan akun terkait dalam sistem koperasi
      </p>
    </div>

    <!-- Form Tambah Jenis Simpanan -->
    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm mb-8 overflow-hidden"
    >
      <div
        class="bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-4 border-b border-gray-200"
      >
        <h2
          class="text-lg font-semibold text-indigo-700 flex items-center gap-2"
        >
          <i class="fas fa-plus-circle"></i>
          Tambah Jenis Simpanan Baru
        </h2>
      </div>

      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-gray-700 font-medium mb-2">
              Nama Jenis Simpanan <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none"
              >
                <i class="fas fa-tag text-gray-400"></i>
              </div>
              <input
                v-model="form.nama_jenis"
                placeholder="Misal: Simpanan Pokok"
                required
                class="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">
              Akun Terkait <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none"
              >
                <i class="fas fa-file-invoice-dollar text-gray-400"></i>
              </div>
              <select
                v-model="form.akun_id"
                required
                class="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all appearance-none"
              >
                <option disabled value="">Pilih Akun Terkait</option>
                <option
                  v-for="akun in listAkun"
                  :key="akun.id"
                  :value="akun.id"
                >
                  {{ akun.kode }} - {{ akun.nama_akun }}
                </option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
              >
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">
              Deskripsi (Opsional)
            </label>
            <div class="relative">
              <div class="absolute top-3 left-3 pointer-events-none">
                <i class="fas fa-align-left text-gray-400"></i>
              </div>
              <textarea
                v-model="form.deskripsi"
                placeholder="Tambahkan deskripsi tentang jenis simpanan ini..."
                class="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all min-h-[100px]"
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button
              type="submit"
              class="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
            >
              <i class="fas fa-save"></i>
              Simpan Konfigurasi
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Daftar Jenis Simpanan -->
    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div
        class="bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-4 border-b border-gray-200"
      >
        <h2
          class="text-lg font-semibold text-indigo-700 flex items-center gap-2"
        >
          <i class="fas fa-list"></i>
          Daftar Jenis Simpanan
        </h2>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Jenis
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Akun Terkait
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kode Akun
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="item in listJenis"
              :key="item.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">
                  {{ item.nama_jenis }}
                </div>
                <div v-if="item.deskripsi" class="text-sm text-gray-500 mt-1">
                  {{ item.deskripsi }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-gray-900">{{ item.nama_akun }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {{ item.kode }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  <i class="fas fa-check-circle mr-1.5"></i>
                  Aktif
                </span>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="listJenis.length === 0">
              <td colspan="4" class="px-6 py-12 text-center">
                <div
                  class="flex flex-col items-center justify-center text-gray-500"
                >
                  <i class="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                  <h3 class="font-medium text-lg">Belum ada jenis simpanan</h3>
                  <p class="mt-1">
                    Tambahkan jenis simpanan baru menggunakan form di atas
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import JenisSimpananService from "@/services/jenisSimpanan.service.js";
import AkunService from "@/services/akun.service.js";
import { useToast } from "vue-toastification";

const listJenis = ref([]);
const listAkun = ref([]);
const form = ref({ nama_jenis: "", akun_id: "", deskripsi: "" });
const toast = useToast();

const fetchData = async () => {
  try {
    const [resJenis, resAkun] = await Promise.all([
      JenisSimpananService.getAll(),
      AkunService.getAkunKewajiban(),
    ]);
    listJenis.value = resJenis.data;
    listAkun.value = resAkun.data;
  } catch (error) {
    toast.error("Gagal memuat data.");
  }
};

const handleSubmit = async () => {
  try {
    await JenisSimpananService.create(form.value);
    toast.success("Jenis simpanan baru berhasil ditambahkan!");
    form.value = { nama_jenis: "", akun_id: "", deskripsi: "" };
    fetchData();
  } catch (error) {
    toast.error("Gagal menyimpan.");
  }
};

onMounted(fetchData);
</script>

<style scoped>
/* Animasi untuk form */
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

.form-enter-active {
  animation: fadeIn 0.3s ease-out;
}
</style>
