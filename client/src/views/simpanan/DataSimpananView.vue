<template>
  <div class="p-4 md:p-6 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
    >
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
          Manajemen Pinjaman
        </h1>
        <p class="text-gray-600 mt-2">Kelola semua rekening pinjaman anggota</p>
      </div>
      <div class="flex gap-3">
        <router-link
          to="/pinjaman/impor"
          class="btn bg-blue-500 hover:bg-blue-600 text-white gap-2 transition-all shadow-md hover:shadow-lg border-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
          Impor Pinjaman
        </router-link>
      </div>
    </div>

    <!-- Stats and Search -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden"
    >
      <div
        class="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div class="bg-blue-50 px-4 py-3 rounded-lg">
          <p class="text-sm font-medium text-gray-700">
            Menampilkan
            <span class="font-bold text-blue-600">{{
              (currentPage - 1) * itemsPerPage + 1
            }}</span>
            -
            <span class="font-bold text-blue-600">{{
              Math.min(currentPage * itemsPerPage, totalItems)
            }}</span>
            dari
            <span class="font-bold text-blue-600">{{ totalItems }}</span>
            pinjaman
          </p>
        </div>

        <div class="relative w-full md:w-auto">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <svg
              class="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Cari nama atau no. pinjaman..."
            class="pl-10 pr-4 py-3 w-full md:w-80 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div
      class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Anggota
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Jml. Pinjaman
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Total Bayar Pokok
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Total Bayar Jasa
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Sisa Pokok
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="isLoading">
              <td colspan="6" class="px-6 py-8 text-center">
                <div class="flex justify-center items-center">
                  <div
                    class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
                  ></div>
                </div>
                <p class="mt-4 text-gray-600">Memuat data pinjaman...</p>
              </td>
            </tr>
            <tr v-else-if="pinjamanList.length === 0">
              <td colspan="6" class="px-6 py-12 text-center">
                <div
                  class="mx-auto bg-blue-50 rounded-full p-4 w-16 h-16 flex items-center justify-center"
                >
                  <svg
                    class="h-8 w-8 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h3 class="mt-4 text-lg font-medium text-gray-800">
                  Data tidak ditemukan
                </h3>
                <p class="mt-1 text-gray-600">
                  Tidak ada pinjaman yang cocok dengan pencarian Anda
                </p>
              </td>
            </tr>
            <tr
              v-for="pinjaman in pinjamanList"
              :key="pinjaman.id"
              class="hover:bg-blue-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link
                  :to="`/pinjaman/data/${pinjaman.id}`"
                  class="flex flex-col group"
                >
                  <span
                    class="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors"
                  >
                    {{ pinjaman.nama_anggota }}
                  </span>
                  <span class="text-sm text-gray-600 mt-1">
                    {{ pinjaman.no_pinjaman }}
                  </span>
                </router-link>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-base font-medium text-gray-800"
              >
                {{ formatUang(pinjaman.jumlah_pinjaman) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-base text-gray-700"
              >
                {{ formatUang(pinjaman.total_bayar_pokok) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-base text-gray-700"
              >
                {{ formatUang(pinjaman.total_bayar_jasa) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <span class="text-base font-bold text-blue-600">
                  {{ formatUang(pinjaman.sisa_pokok) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                    pinjaman.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  <svg
                    v-if="pinjaman.status === 'aktif'"
                    class="h-4 w-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ pinjaman.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-600">
        Menampilkan
        {{ pinjamanList.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }}
        - {{ (currentPage - 1) * itemsPerPage + pinjamanList.length }} dari
        {{ totalItems }} pinjaman
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
              ? 'bg-blue-600 text-white'
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
const currentPage = ref(1);
const totalPages = ref(0);
const totalItems = ref(0);
const itemsPerPage = ref(10);
const toast = useToast();

const fetchAllPinjaman = async () => {
  isLoading.value = true;
  try {
    const response = await PinjamanService.getAll({
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchTerm.value,
    });
    console.log("Data diterima dari server:", response.data);
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
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka || 0
  );

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
