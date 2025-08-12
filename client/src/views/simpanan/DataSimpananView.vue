<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        @click="filterAktif = 'Semua'"
        :class="[
          'bg-gradient-to-br from-white to-gray-50 border rounded-xl p-5 shadow-sm cursor-pointer transition-all transform hover:scale-[1.02]',
          filterAktif === 'Semua'
            ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50'
            : 'border-gray-200 hover:border-indigo-300',
        ]"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="bg-indigo-100 p-3 rounded-xl">
            <i class="fas fa-wallet text-indigo-600 text-xl"></i>
          </div>
          <span
            class="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800"
          >
            Semua
          </span>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-1">Semua Simpanan</h3>
        <div class="text-2xl font-bold text-gray-800 mb-2">
          {{ formatUang(totalSaldoKeseluruhan) }}
        </div>
        <div class="text-sm text-gray-500">
          <i class="fas fa-file-invoice mr-2"></i>
          {{ rekeningList.length }} rekening aktif
        </div>
      </div>

      <div
        v-for="summary in summaries"
        :key="summary.jenis_simpanan"
        @click="filterAktif = summary.jenis_simpanan"
        :class="[
          'bg-gradient-to-br from-white to-gray-50 border rounded-xl p-5 shadow-sm cursor-pointer transition-all transform hover:scale-[1.02]',
          filterAktif === summary.jenis_simpanan
            ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50'
            : 'border-gray-200 hover:border-indigo-300',
        ]"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="bg-indigo-100 p-3 rounded-xl">
            <i
              :class="[
                'text-xl',
                summary.jenis_simpanan === 'Simpanan Pokok'
                  ? 'fas fa-key text-indigo-600'
                  : summary.jenis_simpanan === 'Simpanan Wajib'
                  ? 'fas fa-hand-holding-usd text-green-600'
                  : 'fas fa-piggy-bank text-amber-600',
              ]"
            ></i>
          </div>
          <span
            class="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800"
          >
            {{ summary.jenis_simpanan }}
          </span>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-1">
          {{ summary.jenis_simpanan }}
        </h3>
        <div class="text-2xl font-bold text-gray-800 mb-2">
          {{ formatUang(summary.total_saldo) }}
        </div>
        <div class="text-sm text-gray-500">
          <i class="fas fa-file-invoice mr-2"></i>
          {{ summary.jumlah_rekening }} rekening
        </div>
      </div>
    </div>

    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="px-6 py-4 border-b border-gray-200">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <i class="fas fa-list text-indigo-500"></i>
              Detail Rekening
            </h2>
            <p class="text-sm text-gray-500 mt-1">
              Filter:
              <span class="font-medium text-indigo-600">{{ filterAktif }}</span>
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
              placeholder="Cari nama atau no. rekening..."
              class="w-full md:w-80 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
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

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                No. Rekening
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
                Jenis Simpanan
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Saldo
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="rek in rekeningFiltered"
              :key="rek.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link
                  :to="`/simpanan/rekening/${rek.id}`"
                  class="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
                >
                  {{ rek.no_rekening }}
                </router-link>
              </td>
              <td class="px-6 py-4">
                <router-link
                  :to="`/data-master/anggota/${rek.anggota_id}`"
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
                    {{ rek.nama_anggota }}
                  </span>
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-indigo-100 text-indigo-800':
                      rek.jenis_simpanan === 'Simpanan Pokok',
                    'bg-green-100 text-green-800':
                      rek.jenis_simpanan === 'Simpanan Wajib',
                    'bg-amber-100 text-amber-800':
                      rek.jenis_simpanan === 'Simpanan Sukarela',
                  }"
                >
                  <i
                    :class="[
                      'mr-1.5 text-xs',
                      rek.jenis_simpanan === 'Simpanan Pokok'
                        ? 'fas fa-key'
                        : rek.jenis_simpanan === 'Simpanan Wajib'
                        ? 'fas fa-hand-holding-usd'
                        : 'fas fa-piggy-bank',
                    ]"
                  ></i>
                  {{ rek.jenis_simpanan }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-800"
              >
                {{ formatUang(rek.saldo) }}
              </td>
            </tr>

            <tr v-if="rekeningFiltered.length === 0">
              <td colspan="4" class="px-6 py-12 text-center">
                <div
                  class="flex flex-col items-center justify-center text-gray-500"
                >
                  <i class="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                  <h3 class="font-medium text-lg">Data tidak ditemukan</h3>
                  <p class="mt-1">
                    Tidak ada rekening yang cocok dengan pencarian Anda
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
import { ref, onMounted, computed } from "vue";
import SimpananService from "@/services/simpanan.service.js";

const summaries = ref([]);
const rekeningList = ref([]);
const filterAktif = ref("Semua");
const searchTerm = ref("");

const fetchAllRekening = async () => {
  try {
    const response = await SimpananService.getSimpananSummary();
    summaries.value = response.data.summaries;
    rekeningList.value = response.data.detail_rekening;
  } catch (error) {
    console.error("Error fetching all rekening:", error);
  }
};

const rekeningFiltered = computed(() => {
  let list = rekeningList.value;

  if (filterAktif.value !== "Semua") {
    list = list.filter((rek) => rek.jenis_simpanan === filterAktif.value);
  }

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase();
    list = list.filter(
      (rek) =>
        rek.nama_anggota.toLowerCase().includes(search) ||
        rek.no_rekening.toLowerCase().includes(search)
    );
  }

  return list;
});

const totalSaldoKeseluruhan = computed(() => {
  return rekeningList.value.reduce(
    (total, item) => total + parseFloat(item.saldo),
    0
  );
});

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka || 0
  );

onMounted(fetchAllRekening);
</script>

<style scoped>
/* Animations */
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

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
