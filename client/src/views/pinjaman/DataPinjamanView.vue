<template>
  <div class="p-4 md:p-6 bg-gray-50 min-h-screen">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
    >
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
          Manajemen Pinjaman
        </h1>
        <p class="text-gray-600 mt-2">Kelola semua rekening pinjaman anggota</p>
      </div>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden"
    >
      <div
        class="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div class="bg-blue-50 px-4 py-3 rounded-lg">
          <p class="text-sm font-medium text-gray-700">
            Menampilkan
            {{
              pinjamanList.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
            }}
            - {{ (currentPage - 1) * itemsPerPage + pinjamanList.length }} dari
            <span class="font-bold text-blue-600">{{ totalItems }}</span>
            pinjaman
          </p>
        </div>
        <div class="relative w-full md:w-auto">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <i class="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Cari nama atau no. pinjaman..."
            class="pl-10 pr-4 py-3 w-full md:w-80 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>
    </div>

    <div
      class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase"
              >
                Anggota
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase"
              >
                Jml. Pinjaman
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase"
              >
                Sisa Pokok
              </th>
              <th
                class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="isLoading">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                <i class="fas fa-spinner fa-spin text-2xl"></i>
                <p class="mt-2">Memuat data...</p>
              </td>
            </tr>
            <tr v-else-if="pinjamanList.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                Data tidak ditemukan.
              </td>
            </tr>
            <tr
              v-for="pinjaman in pinjamanList"
              :key="pinjaman.id"
              class="hover:bg-blue-50"
            >
              <td class="px-6 py-4">
                <router-link
                  :to="`/pinjaman/data/${pinjaman.id}`"
                  class="group"
                >
                  <div
                    class="font-semibold text-gray-800 group-hover:text-blue-600"
                  >
                    {{ pinjaman.nama_anggota }}
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ pinjaman.no_pinjaman }}
                  </div>
                </router-link>
              </td>
              <td class="px-6 py-4 text-right font-medium text-gray-800">
                {{ formatUang(pinjaman.jumlah_pinjaman) }}
              </td>
              <td class="px-6 py-4 text-right font-bold text-blue-600">
                {{ formatUang(pinjaman.sisa_pokok) }}
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    pinjaman.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ pinjaman.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-600">
        Halaman {{ currentPage }} dari {{ totalPages }}
      </div>
      <div class="flex gap-1">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Sebelumnya
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-3 py-1.5 rounded-md border',
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'hover:bg-gray-50',
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Berikutnya
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import PinjamanService from "@/services/pinjaman.service.js";
import { useToast } from "vue-toastification";

const pinjamanList = ref([]);
const isLoading = ref(true);
const searchTerm = ref("");
const toast = useToast();

const currentPage = ref(1);
const totalPages = ref(0);
const totalItems = ref(0);
const itemsPerPage = 10;

const fetchAllPinjaman = async () => {
  isLoading.value = true;
  try {
    const response = await PinjamanService.getAll({
      page: currentPage.value,
      limit: itemsPerPage,
      search: searchTerm.value,
    });

    pinjamanList.value = response.data.data;
    totalItems.value = response.data.totalItems;
    totalPages.value = response.data.totalPages;
    currentPage.value = response.data.currentPage;
  } catch (error) {
    toast.error("Gagal memuat data pinjaman.");
    console.error("Error fetching all pinjaman:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchAllPinjaman();
  }
};

let searchTimeout = null;
watch(searchTerm, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchAllPinjaman();
  }, 500);
});

onMounted(fetchAllPinjaman);
</script>
