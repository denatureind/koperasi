<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-hand-holding-usd text-indigo-600"></i>
          Manajemen Pinjaman
        </h1>
        <p class="text-gray-500 mt-1">
          Kelola semua rekening pinjaman anggota koperasi
        </p>
      </div>

      <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <router-link
          to="/pinjaman/impor"
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
        >
          <i class="fas fa-file-import mr-2"></i>
          Impor Pinjaman
        </router-link>

        <div class="relative w-full md:w-80">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <i class="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Cari nama atau no. pinjaman..."
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
          />
          <button
            v-if="searchTerm"
            @click="searchTerm = ''"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-16"
    >
      <div
        class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-gray-600 font-medium">Memuat data pinjaman...</p>
    </div>

    <div
      v-else-if="filteredPinjaman.length === 0"
      class="bg-white rounded-xl border border-gray-200 p-8 text-center"
    >
      <i class="fas fa-inbox text-4xl text-gray-300 mb-4"></i>
      <h3 class="text-lg font-medium text-gray-700 mb-1">
        Data tidak ditemukan
      </h3>
      <p class="text-gray-500 mb-6">
        Tidak ada pinjaman yang sesuai dengan pencarian Anda
      </p>
      <button
        @click="searchTerm = ''"
        class="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md mx-auto"
      >
        <i class="fas fa-undo mr-2"></i> Reset Pencarian
      </button>
    </div>

    <div
      v-else
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                No. Pinjaman
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Anggota
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jumlah Pinjaman
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tenor
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
              v-for="pinjaman in filteredPinjaman"
              :key="pinjaman.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link
                  :to="`/pinjaman/data/${pinjaman.id}`"
                  class="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
                >
                  {{ pinjaman.no_pinjaman }}
                </router-link>
              </td>
              <td class="px-6 py-4">
                <router-link
                  :to="`/data-master/anggota/${pinjaman.anggota_id}`"
                  class="flex items-center group"
                >
                  <div
                    class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3"
                  >
                    <i class="fas fa-user text-indigo-600 text-sm"></i>
                  </div>
                  <span
                    class="text-gray-800 group-hover:text-indigo-700 group-hover:underline transition-colors"
                  >
                    {{ pinjaman.nama_anggota }}
                  </span>
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                {{ formatUang(pinjaman.jumlah_pinjaman) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <i class="fas fa-calendar-alt mr-1.5"></i>
                  {{ pinjaman.tenor }} bulan
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                    pinjaman.status === 'Aktif'
                      ? 'bg-green-100 text-green-800'
                      : pinjaman.status === 'Lunas'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-amber-100 text-amber-800',
                  ]"
                >
                  <i
                    :class="[
                      'mr-1.5 text-xs',
                      pinjaman.status === 'Aktif'
                        ? 'fas fa-check-circle'
                        : pinjaman.status === 'Lunas'
                        ? 'fas fa-flag-checkered'
                        : 'fas fa-exclamation-triangle',
                    ]"
                  ></i>
                  {{ pinjaman.status }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="flex justify-end gap-2">
                  <router-link
                    :to="`/pinjaman/data/${pinjaman.id}`"
                    class="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
                  >
                    <i class="fas fa-eye mr-1"></i> Detail
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="!isLoading && filteredPinjaman.length > 0"
      class="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm text-gray-500 border-t border-gray-200 pt-4"
    >
      <div>
        Menampilkan
        <span class="font-medium text-gray-700">{{
          filteredPinjaman.length
        }}</span>
        dari
        <span class="font-medium text-gray-700">{{ pinjamanList.length }}</span>
        pinjaman
      </div>
      <div class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
        <i class="fas fa-clock text-indigo-500"></i>
        <span
          >Terakhir diperbarui:
          {{ new Date().toLocaleTimeString("id-ID") }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import PinjamanService from "@/services/pinjaman.service.js";

const pinjamanList = ref([]);
const isLoading = ref(true);
const searchTerm = ref("");

const filteredPinjaman = computed(() => {
  if (!searchTerm.value) {
    return pinjamanList.value;
  }
  const search = searchTerm.value.toLowerCase();
  return pinjamanList.value.filter(
    (p) =>
      (p.nama_anggota && p.nama_anggota.toLowerCase().includes(search)) ||
      (p.no_pinjaman && p.no_pinjaman.toLowerCase().includes(search))
  );
});

const fetchAllPinjaman = async () => {
  isLoading.value = true;
  try {
    const response = await PinjamanService.getAll();
    pinjamanList.value = response.data;
  } catch (error) {
    console.error("Error fetching all pinjaman:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka || 0
  );

onMounted(fetchAllPinjaman);
</script>

<style scoped>
/* Animasi untuk highlight pinjaman baru */
@keyframes highlight {
  0% {
    background-color: rgba(99, 102, 241, 0.2);
  }
  100% {
    background-color: transparent;
  }
}

.highlight-row {
  animation: highlight 1.5s ease;
}
</style>
