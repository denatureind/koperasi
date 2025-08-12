<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-file-invoice text-indigo-600"></i>
          Daftar Kode Akun
        </h1>
        <p class="text-gray-500 mt-1">
          Chart of Accounts - Kelola seluruh akun dalam sistem pembukuan
          koperasi
        </p>
      </div>

      <div class="flex gap-3">
        <button
          class="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
          @click="printAkunList"
        >
          <i class="fas fa-print"></i>
          <span>Cetak Daftar Akun</span>
        </button>
      </div>
    </div>

    <!-- Account Groups Navigation -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="group in accountGroups"
        :key="group.id"
        @click="filterByGroup(group.id)"
        :class="[
          'px-4 py-2 rounded-lg border transition-all',
          activeGroup === group.id
            ? 'bg-indigo-100 text-indigo-700 border-indigo-300 font-medium shadow-sm'
            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
        ]"
      >
        {{ group.name }}
      </button>
    </div>

    <!-- Accounts Table -->
    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]"
              >
                Kode
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Akun
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]"
              >
                Posisi Saldo
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]"
              >
                Header
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]"
              >
                Kelompok
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="akun in filteredAkun"
              :key="akun.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded"
                >
                  {{ akun.kode }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3"
                  >
                    <i :class="getAccountIcon(akun.kelompok_akun)"></i>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">
                      {{ akun.nama_akun }}
                    </div>
                    <div class="text-sm text-gray-500 mt-1">
                      {{ getAccountDescription(akun.kelompok_akun) }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                    akun.posisi_saldo === 'Debit'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800',
                  ]"
                >
                  <i
                    :class="[
                      'mr-1.5',
                      akun.posisi_saldo === 'Debit'
                        ? 'fas fa-arrow-down'
                        : 'fas fa-arrow-up',
                    ]"
                  ></i>
                  {{ akun.posisi_saldo }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ akun.header_akun }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                    getGroupColor(akun.kelompok_akun),
                  ]"
                >
                  {{ akun.kelompok_akun }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Summary Footer -->
    <div
      class="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm text-gray-500"
    >
      <div class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
        <i class="fas fa-info-circle text-indigo-500"></i>
        <span
          >Menampilkan {{ filteredAkun.length }} dari
          {{ listAkun.length }} akun</span
        >
      </div>

      <div class="flex flex-wrap gap-3">
        <div class="flex items-center">
          <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span class="text-sm">Debit</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
          <span class="text-sm">Kredit</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
          <span class="text-sm">Aktiva</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span class="text-sm">Kewajiban</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
          <span class="text-sm">Modal</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import AkunService from "@/services/akun.service.js";
import { useToast } from "vue-toastification";

const listAkun = ref([]);
const toast = useToast();
const activeGroup = ref("all");

const accountGroups = [
  { id: "all", name: "Semua Akun" },
  { id: "Aktiva", name: "Aktiva" },
  { id: "Kewajiban", name: "Kewajiban" },
  { id: "Modal", name: "Modal" },
  { id: "Pendapatan", name: "Pendapatan" },
  { id: "Beban", name: "Beban" },
];

const filteredAkun = computed(() => {
  if (activeGroup.value === "all") {
    return listAkun.value;
  }
  return listAkun.value.filter(
    (akun) => akun.kelompok_akun === activeGroup.value
  );
});

const fetchAkun = async () => {
  try {
    const response = await AkunService.getAll();
    listAkun.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat data akun.");
    console.error("Error mengambil data akun:", error);
  }
};

const filterByGroup = (groupId) => {
  activeGroup.value = groupId;
};

const getAccountIcon = (kelompok) => {
  const icons = {
    Aktiva: "fas fa-building text-indigo-600",
    Kewajiban: "fas fa-file-invoice-dollar text-blue-600",
    Modal: "fas fa-chart-line text-purple-600",
    Pendapatan: "fas fa-money-bill-wave text-green-600",
    Beban: "fas fa-shopping-cart text-rose-600",
  };
  return icons[kelompok] || "fas fa-file-alt text-gray-600";
};

const getAccountDescription = (kelompok) => {
  const descriptions = {
    Aktiva: "Aset yang dimiliki koperasi",
    Kewajiban: "Hutang dan kewajiban koperasi",
    Modal: "Modal dan ekuitas koperasi",
    Pendapatan: "Pendapatan dari operasional",
    Beban: "Pengeluaran operasional",
  };
  return descriptions[kelompok] || "Akun umum";
};

const getGroupColor = (kelompok) => {
  const colors = {
    Aktiva: "bg-indigo-100 text-indigo-800",
    Kewajiban: "bg-blue-100 text-blue-800",
    Modal: "bg-purple-100 text-purple-800",
    Pendapatan: "bg-green-100 text-green-800",
    Beban: "bg-rose-100 text-rose-800",
  };
  return colors[kelompok] || "bg-gray-100 text-gray-800";
};

const printAkunList = () => {
  toast.info("Fitur cetak daftar akun akan segera tersedia");
};

onMounted(fetchAkun);
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

.fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

/* Striped rows */
tbody tr:nth-child(odd) {
  background-color: #f9fafb;
}
</style>
