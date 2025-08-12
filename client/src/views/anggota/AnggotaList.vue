<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <!-- Header dengan judul dan kontrol -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Daftar Anggota</h1>
        <p class="text-gray-500 mt-1">
          Kelola data anggota koperasi dengan mudah
        </p>
      </div>

      <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <!-- Kotak pencarian -->
        <div class="relative flex-grow">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <i class="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Cari nama anggota..."
            class="pl-10 pr-4 py-2.5 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
          />
          <button
            v-if="searchTerm"
            @click="searchTerm = ''"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Tombol Impor dan Tambah Anggota -->
        <div class="flex gap-2">
          <router-link to="/data-master/anggota/impor">
            <button
              class="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
            >
              <i class="fas fa-file-import"></i>
              <span>Impor</span>
            </button>
          </router-link>
          <router-link to="/data-master/anggota/tambah">
            <button
              class="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
            >
              <i class="fas fa-plus"></i>
              <span>Tambah Anggota</span>
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Indikator loading -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-16"
    >
      <div
        class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-gray-600 font-medium">Memuat data anggota...</p>
    </div>

    <!-- Tabel anggota -->
    <div
      v-else
      class="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kode Anggota
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jenis Kelamin
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="item in filteredAnggota"
              :key="item.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ item.kode_anggota }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link
                  :to="`/data-master/anggota/${item.id}`"
                  class="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
                >
                  {{ item.nama }}
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.jenis_kelamin }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                    item.status === 'Aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-rose-100 text-rose-800',
                  ]"
                >
                  <i
                    :class="[
                      'mr-1.5 text-xs',
                      item.status === 'Aktif'
                        ? 'fas fa-check-circle'
                        : 'fas fa-times-circle',
                    ]"
                  ></i>
                  {{ item.status }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="flex justify-end gap-2">
                  <router-link
                    :to="`/data-master/anggota/edit/${item.id}`"
                    class="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
                  >
                    <i class="fas fa-edit text-sm"></i>
                    <span>Edit</span>
                  </router-link>
                  <button
                    @click="deleteAnggota(item.id)"
                    class="flex items-center gap-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-md transition-colors"
                  >
                    <i class="fas fa-trash-alt text-sm"></i>
                    <span>Hapus</span>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Tampilkan pesan jika tidak ada data yang ditemukan -->
            <tr v-if="filteredAnggota.length === 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <div
                  class="flex flex-col items-center justify-center text-gray-500"
                >
                  <i class="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                  <h3 class="font-medium text-lg">Data tidak ditemukan</h3>
                  <p class="mt-1">
                    Tidak ada anggota yang cocok dengan pencarian Anda
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-bold text-gray-900">
            Konfirmasi Penghapusan
          </h3>
          <button
            @click="showDeleteModal = false"
            class="text-gray-400 hover:text-gray-500"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <p class="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus anggota
          <span class="font-semibold">{{ selectedAnggotaName }}</span
          >? Data yang dihapus tidak dapat dikembalikan.
        </p>

        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white transition-all shadow-sm"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AnggotaService from "@/services/anggota.service.js";
import { useToast } from "vue-toastification";

const anggota = ref([]);
const toast = useToast();
const isLoading = ref(true);
const searchTerm = ref("");
const showDeleteModal = ref(false);
const selectedAnggotaId = ref(null);
const selectedAnggotaName = ref("");

const filteredAnggota = computed(() => {
  if (!searchTerm.value) {
    return anggota.value;
  }
  return anggota.value.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const fetchAnggota = async () => {
  isLoading.value = true;
  try {
    const response = await AnggotaService.getAll();
    anggota.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat data anggota.");
  } finally {
    isLoading.value = false;
  }
};

const deleteAnggota = (id) => {
  const anggotaItem = anggota.value.find((item) => item.id === id);
  if (anggotaItem) {
    selectedAnggotaId.value = id;
    selectedAnggotaName.value = anggotaItem.nama;
    showDeleteModal.value = true;
  }
};

const confirmDelete = async () => {
  if (selectedAnggotaId.value) {
    try {
      await AnggotaService.delete(selectedAnggotaId.value);
      toast.success("Anggota berhasil dihapus.");
      fetchAnggota();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus anggota.");
      console.error("Error saat menghapus anggota:", error);
    } finally {
      showDeleteModal.value = false;
      selectedAnggotaId.value = null;
      selectedAnggotaName.value = "";
    }
  }
};

onMounted(fetchAnggota);
</script>

<style scoped>
/* Animasi untuk modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
