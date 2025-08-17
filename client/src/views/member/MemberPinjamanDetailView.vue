<template>
  <div class="min-h-[calc(100vh-160px)]">
    <div v-if="isLoading" class="text-center p-10">
      <div class="flex justify-center">
        <div
          class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
      <p class="mt-4 text-blue-600 font-medium">Memuat detail pinjaman...</p>
    </div>

    <transition
      v-else-if="data"
      appear
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 translate-y-5"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div class="space-y-6">
        <div
          class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-5 shadow-lg"
        >
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div class="text-white">
              <h1 class="text-2xl md:text-3xl font-bold">Detail Pinjaman</h1>
              <p class="text-lg font-semibold text-blue-200 mt-1">
                {{ data.pinjaman.kode_pinjaman }}
              </p>
            </div>
            <button
              @click="$router.back()"
              class="btn btn-sm md:btn-md bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-white/30 mt-4 md:mt-0 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <i class="fas fa-arrow-left mr-2"></i>Kembali
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            class="card bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl overflow-hidden"
          >
            <div class="card-body p-5">
              <div class="flex items-center">
                <div class="bg-blue-100 p-3 rounded-xl mr-4">
                  <i class="fas fa-coins text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-500">Total Pinjaman</h3>
                  <p class="text-2xl font-bold mt-1">
                    {{ formatUang(data.pinjaman.total_pinjaman) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="card bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl overflow-hidden"
          >
            <div class="card-body p-5">
              <div class="flex items-center">
                <div class="bg-orange-100 p-3 rounded-xl mr-4">
                  <i class="fas fa-chart-line text-orange-600 text-xl"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-500">Sisa Pokok</h3>
                  <p class="text-2xl font-bold text-orange-600 mt-1">
                    {{ formatUang(data.pinjaman.sisa_pokok) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="card bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl overflow-hidden"
          >
            <div class="card-body p-5">
              <div class="flex items-center">
                <div class="bg-green-100 p-3 rounded-xl mr-4">
                  <i class="fas fa-badge-check text-green-600 text-xl"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-500">Status</h3>
                  <div class="mt-2">
                    <span
                      class="px-4 py-1.5 rounded-full text-sm font-medium"
                      :class="
                        data.pinjaman.status === 'aktif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      "
                    >
                      {{ data.pinjaman.status.toUpperCase() }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="card bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl overflow-hidden"
        >
          <div class="p-5 bg-gradient-to-r from-blue-500 to-indigo-600">
            <h3 class="text-xl font-bold text-white flex items-center">
              <i class="fas fa-calendar-alt mr-3"></i> Jadwal Angsuran
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="table w-full responsive-table">
              <thead class="bg-blue-50 md:table-header-group">
                <tr>
                  <th class="text-left py-4 px-5 text-blue-700 font-semibold">
                    No
                  </th>
                  <th class="text-right py-4 px-5 text-blue-700 font-semibold">
                    Jumlah Bayar
                  </th>
                  <th class="text-left py-4 px-5 text-blue-700 font-semibold">
                    Tgl Bayar
                  </th>
                  <th class="text-center py-4 px-5 text-blue-700 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in data.jadwal_angsuran"
                  :key="item.angsuran_ke"
                  class="bg-white even:bg-blue-50 md:table-row"
                >
                  <td class="font-bold py-3 px-5" data-label="No">
                    {{ item.angsuran_ke }}
                  </td>
                  <td
                    class="text-right py-3 px-5 font-bold"
                    data-label="Jumlah Bayar"
                  >
                    {{ formatUang(item.total_bayar) }}
                  </td>
                  <td class="py-3 px-5" data-label="Tgl Bayar">
                    {{ formatDate(item.tgl_pembayaran) }}
                  </td>
                  <td class="py-3 px-5" data-label="Status">
                    <div
                      class="px-3 py-1 rounded-full text-sm font-medium"
                      :class="
                        item.status === 'lunas'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      "
                    >
                      {{ item.status.toUpperCase() }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="p-4 bg-blue-50 border-t border-blue-100 text-center">
            <p class="text-sm text-blue-700">
              Menampilkan {{ data.jadwal_angsuran.length }} angsuran
            </p>
          </div>
        </div>
      </div>
    </transition>

    <div v-else class="text-center p-10">
      <div
        class="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 max-w-md mx-auto border border-red-100 shadow-sm"
      >
        <div
          class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-exclamation-circle text-red-500 text-2xl"></i>
        </div>
        <p class="font-semibold text-red-700 text-lg">
          Gagal memuat data pinjaman
        </p>
        <p class="text-gray-600 mt-2">Silakan coba beberapa saat lagi</p>
        <button
          @click="$router.back()"
          class="btn bg-gradient-to-r from-blue-500 to-indigo-600 text-white mt-6 border-0 hover:opacity-90"
        >
          Kembali ke Daftar Pinjaman
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import MemberService from "@/services/member.service.js";

const data = ref(null);
const isLoading = ref(true);
const route = useRoute();
const toast = useToast();

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(parseFloat(angka) || 0);

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

onMounted(async () => {
  const pinjamanId = route.params.id;
  try {
    const response = await MemberService.getPinjamanDetail(pinjamanId);
    data.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat detail pinjaman.");
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* CSS untuk membuat tabel menjadi card di layar mobile */
@media (max-width: 767px) {
  .responsive-table thead {
    display: none;
  }

  .responsive-table tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .responsive-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: right;
    padding: 0.75rem 0.5rem;
    border-bottom: 1px solid #edf2f7;
  }

  .responsive-table tr:last-child {
    margin-bottom: 0;
  }

  .responsive-table td:last-child {
    border-bottom: none;
  }

  .responsive-table td::before {
    content: attr(data-label);
    font-weight: 600;
    text-align: left;
    margin-right: 1rem;
    color: #4a5568;
  }
}
</style>
